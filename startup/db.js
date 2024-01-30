import logger from "./logger.js";
import mongoose from "mongoose";
import config from "config";

export default function () {
  const uri =
    process.env.NODE_ENV === "development"
      ? config.get("db")
      : config.get("atlasDB");
  mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger.info(`Connected to ${db}...`));
}
