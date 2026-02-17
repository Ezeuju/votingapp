require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const environment = process.env.NODE_ENV;
const http = require("http");
const logger = require("./src/logger");
const createDbConnection = require("./src/models/db");
// const redisConnection = require("./src/models/db/redisConnection");
const cron = require("node-cron");
const UserService = require("./src/services/users");

if (environment == "production") {
  require("newrelic");
}

const app = require("./app");
const port = process.env.PORT || 2000;

// connects to mongodb
createDbConnection();
// connects to redis
// redisConnection.connect();

http.createServer(app).listen(port);
logger.info(`Started server at port: ${port}`);

// schedule the job to run at 12 AM every day
cron.schedule("0 0 * * *", () => {
  UserService.anonymizeUsers();
});
