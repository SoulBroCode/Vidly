import logger from "./logger.js";
import mongoose from "mongoose";
import config from "../utility/config.js";

export default function () {
  const db = config("db", "FATAL ERROR: vidly_db is not defined.");

  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() =>
      logger.info(
        `Connected to ${
          process.env.NODE_ENV === "production" ? "mogodDB Atlas" : db
        }...`
      )
    )
    .catch((err) => {
      console.log(err);
    });
}
