import logger from "./logger.js";
import mongoose from "mongoose";
import config from "config";

export default function () {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      logger.info(
        `Connected to ${
          process.env.NODE_ENV === "production"
            ? "mogodDB Atlas"
            : "localhost db"
        }...`
      )
    )
    .catch((err) => {
      console.log(err);
    });
}
