/**
 * Wrappers module provides utility functions to wrap asynchronous controllers and library functions
 * with consistent error handling and logging.
 * @module utils/wrappers
 */

const { AppError } = require("../middleware/error");
const logger = require("../logger");
const helpers = require("../utils/helpers");

/**
 * Collection of wrapper functions for async operations
 * @namespace
 */
const wrappers = {
  /**
   * Wraps an async controller function to handle errors and pass them to Express error middleware
   * @param {Function} fn - Async controller function to wrap
   * @returns {Function} Wrapped middleware function with error handling
   * @example
   * router.get('/path', asyncControllerWrapper(async (req, res) => {
   *   // controller logic
   * }));
   */
  asyncControllerWrapper(fn) {
    return async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        next(error);
      }
    };
  },

  /**
   * Wraps an async library function to handle errors and log unexpected errors
   * @param {Function} libFn - Async library function to wrap
   * @returns {Function} Wrapped function with error handling
   * @example
   * const safeLibFunction = asyncLibWrapper(libFunction);
   * await safeLibFunction(param1, param2);
   */
  asyncLibWrapper(libFn) {
    return async (...params) => {
      try {
        return await libFn(...params);
      } catch (error) {
        if (error instanceof AppError) {
          throw error;
        } else if (error.code === 11000) {
          //Mongoose Duplicate error
          const key = Object.keys(error.keyPattern || {})[0] || "field";
          throw new AppError(
            400,
            `${helpers.capitalizeFirst(key)} already exists.`,
          );
        }
        logger.error(error);
        throw new AppError(500, "Internal Sever Error");
      }
    };
  },

  wrapper(libFn) {
    return (...params) => {
      try {
        const result = libFn(...params);

        if (result instanceof Promise) {
          return result.catch((error) => {
            logger.error(error);
            return null;
          });
        }

        return result;
      } catch (error) {
        logger.error(error);
        return null;
      }
    };
  },
};

module.exports = wrappers;
