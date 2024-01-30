import logger from "./logger.js";
import mongoose from "mongoose";
import config from "config";

export default function () {
  const db = config.get("db");
  mongoose.connect(db).then(() => logger.info(`Connected to ${db}...`));
}
