import logger from "./logger.js";
import mongoose from "mongoose";
import config from "config";

export default function () {
  const dbLocation =
    process.env.NODE_ENV === "development" ? "localhost db" : "mogodDB Atlas";
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => logger.info(`Connected to ${dbLocation}...`));
}
