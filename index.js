import express from "express";

import logger, {
  logUncaughtException,
  logUnhandledRejection,
} from "./startup/logger.js";
import config from "./startup/config.js";
import routes from "./startup/routes.js";
import db from "./startup/db.js";
import validation from "./startup/validation.js";
import prod from "./startup/prod.js";

const app = express();

logUncaughtException();
logUnhandledRejection();
routes(app);
db();
config();
validation();
prod(app);

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

console.log("Working");

//throw new Error("Something is wrong");

// const p = Promise.reject(new Error("Fail promise"));
// p.then(() => console.log("Done"));

module.exports = server;
