import logger from "../logger.js";

export default function (err, req, res, next) {
  logger.error(err.message, {
    metadata: { message: err.message, name: err.name, stack: err.stack },
  });
  res.status(500).send("Something went wrong.");
}
