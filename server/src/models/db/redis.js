const environment = process.env.NODE_ENV;

const logger = require("../../logger");
const redisConnection = require("./redisConnection");

async function getRedisClient() {
  await redisConnection.connect();
  return redisConnection.getClient();
}

const redis = {
  async storeSession(user, token, device) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const key = `session:${device.device_id}:${user._id}`;

      await client.set(
        key,
        token,
        "EX",
        Number(process.env.REDIS_USER_ACCESS_TOKEN_TIME),
      );
    } catch (error) {
      logger.error("Error storing session on redis:", error);
    }
  },

  async storeRefreshToken(user_id, token, device = {}) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const key = `refresh_token:${device.device_id}:${user_id}`;

      await client.set(
        key,
        token,
        "EX",
        process.env.REDIS_USER_REFRESH_TOKEN_TIME,
      );
    } catch (error) {
      logger.error("Error storing refresh token on redis:", error);
    }
  },

  async verifySession(user, token, device = {}) {
    try {
      if (environment === "test") return true;

      const client = await getRedisClient();
      const key = `session:${device.device_id}:${user._id}`;
      const stored_token = await client.get(key);
      
      if (stored_token !== token) return false;

      // refresh the TTL if session is valid or ongoing (simulate idle timeout)
      await client.expire(key, Number(process.env.REDIS_USER_ACCESS_TOKEN_TIME));

      return true;
    } catch (error) {
      logger.error("Error verifying session on redis:", error);
    }
  },

  async verifyRefreshToken(user_id, token, device) {
    try {
      if (environment === "test") return true;

      const client = await getRedisClient();
      const key = `refresh_token:${device.device_id}:${user_id}`;
      const stored_token = await client.get(key);
      
      if (stored_token !== token) return false;

      await client.expire(key, process.env.REDIS_USER_REFRESH_TOKEN_TIME);

      return true;
    } catch (error) {
      logger.error("Error verifying refresh token on redis:", error.message);
      return false;
    }
  },

  async deleteSession(user_id) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const key = `session:${user_id}`;

      await client.del(key);
    } catch (error) {
      logger.error("Error deleting session on redis:", error);
    }
  },

  async redisCache(key, fetchDB) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const cachedData = await client.get(key);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const fetchedData = await fetchDB();

      // Only set if key doesn't already exist
      await client.set(key, JSON.stringify(fetchedData), "NX");

      return fetchedData;
    } catch (error) {
      logger.error(`Error on redis Cache for key "${key}":`, error);
      return fetchDB(); // fallback to DB
    }
  },

  async rateLimiter(user_id) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const limit = Number(process.env.REDIS_REQUEST_RATE_LIMIT);
      const seconds = Number(process.env.REDIS_REQUEST_RATE_LIMIT_TIME_WINDOW);

      const key = `rate_limit:${user_id}`;
      const count = await client.incr(key);

      if (count === 1) {
        await client.expire(key, seconds);
      }

      return count <= limit;
    } catch (error) {
      logger.error("Error on redis rate limit:", error);
    }
  },

  async activityLimiter(userId, activity, maxCount, durationSeconds) {
    try {
      if (environment === "test") return true;

      const client = await getRedisClient();
      const key = `limitcount:${userId}:${activity}`;

      // Increment count atomically
      const count = await client.incr(key);
      if (count === 1) {
        // Set expiry on first increment to reset count daily
        await client.expire(key, durationSeconds);
      }

      return count <= maxCount;
    } catch (error) {
      logger.error(
        `Error limiting activity count "${activity}" for user ${userId} on redis:`,
        error,
      );
      return false; // Deny action on error
    }
  },

  async checkActivityLimit(user_id, activity, maxCount) {
    try {
      if (environment === "test") return true;

      const client = await getRedisClient();
      const key = `limitcount:${user_id}:${activity}`;

      const count = await client.get(key);
      const currentCount = parseInt(count, 10) || 0;

      return currentCount < maxCount;
    } catch (error) {
      logger.error(
        `Error checking activity limit "${activity}" for user ${user_id} on redis:`,
        error,
      );
      return false; // Deny action on error
    }
  },

  async incrementActivityCount(user_id, activity, durationSeconds) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const key = `limitcount:${user_id}:${activity}`;

      // Atomically increment the count
      const count = await client.incr(key);

      // Set expiry on first increment to reset the count after durationSeconds
      if (count === 1) {
        await client.expire(key, durationSeconds);
      }

      return count;
    } catch (error) {
      logger.error(
        `Error incrementing activity count "${activity}" for user ${user_id}:`,
        error,
      );
      throw error; // or handle according to your error strategy
    }
  },

  async lock(activity, user_id, TTL = 20) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const key = `lock:user:${user_id}:${activity}`;

      const ok = await client.set(key, "1", "NX", "EX", TTL); // 20 seconds TTL

      return ok;
    } catch (error) {
      logger.error("Error storing session on redis:", error);

      return false;
    }
  },

  async activeDevice(device_id, user_id) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();
      const key = `lock:activeDevice:${user_id}`;

      const activeDeviceId = await client.get(key);

      // If there's an active device locked
      if (activeDeviceId) {
        // return true only if it's the same device, else false (block new device within 10s)
        return activeDeviceId === device_id;
      }

      // No active device, lock this device for 50 seconds
      const ok = await client.set(key, device_id, "NX", "EX", 50);

      // Return true if lock acquired, false otherwise
      return ok === "OK";
    } catch (error) {
      logger.error("Error locking active device on redis:", error);
      return false;
    }
  },

  async logout(user, all_session, device_id) {
    try {
      if (environment === "test") return;

      const client = await getRedisClient();

      if (all_session) {
        const pattern1 = `session:*:${user._id}`;
        const keys1 = await client.keys(pattern1);
        if (keys1.length > 0) {
          await client.del(keys1);
        }
      } else {
        // logout single
        const key = `session:${device_id}:${user._id}`;
        await client.del(key);
      }

      return true;
    } catch (error) {
      logger.error("Error verifying session on redis:", error);
    }
  },
};

module.exports = redis;
