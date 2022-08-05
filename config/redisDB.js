const { createClient } = require("redis");
const { REDIS_HOST, REDIS_PORT } = require(".");
const logger = require("../logger/appLogger");

const redisClient = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
});

const redisDB = () => {
  redisClient
    .connect()
    .then(() => logger.info("Connected to RedisDB"))
    .catch((err) => logger.error(`RedisDB connection error => ${err}`));
};

module.exports = {
  redisDB,
  redisClient,
};
