const { redisClient } = require("../config/redisDB");
const { promisify } = require("util");
const logger = require("../logger/appLogger");

class cacheService {
  constructor() {
    this.getAsync = promisify(redisClient.get).bind(redisClient);
  }

  /**
   * It takes an error, a result, and a message as parameters, and if there's an error, it logs the
   * message and returns the error. Otherwise, it returns the result
   * @param err - The error object returned by the function.
   * @param result - The result of the query.
   * @param msg - The message to be logged.
   * @returns The callbackHandler function is being returned.
   */
  #callbackHandler(err, result, msg) {
    if (err) {
      logger.error(msg);
      return err;
    }
    return result;
  }

  /**
   * It gets the value of a key from the redis cache.
   * @param key - The key to be used to store the data in the cache.
   */
  getCache(key) {
    redisClient.get(key, (err, result) => {
      console.log("Result", result);

      this.#callbackHandler(
        err,
        result,
        `Unable to get ${key} from redis cache`
      );
    });
  }

  async getCacheAsync(key) {
    // await
  }

  /**
   * It sets a key value pair in the redis cache.
   * @param key - The key to be used to store the value in the cache.
   * @param value - The value to be stored in the cache.
   */
  setCache(key, value) {
    redisClient.set(key, value, (err, result) =>
      this.#callbackHandler(
        err,
        result,
        `Unable to set ${key} into redis cache`
      )
    );
  }

  /**
   * It sets a key value pair in redis cache with a time to live (ttl)
   * @param key - The key to be set in the cache
   * @param value - The value to be stored in the cache
   * @param ttl - Time to live in seconds
   */
  setCacheExp(key, value, ttl) {
    redisClient.setEx(key, ttl, value, (err, result) =>
      this.#callbackHandler(
        err,
        result,
        `Unable to set ${key} into redis cache`
      )
    );
  }

  /**
   * It deletes a key from the redis cache.
   * @param key - The key to be deleted from the cache
   */
  delCache(key) {
    redisClient.del(key, (err, result) =>
      this.#callbackHandler(
        err,
        result,
        `Unable to delete ${key} from redis cache`
      )
    );
  }
}

module.exports = new cacheService();
