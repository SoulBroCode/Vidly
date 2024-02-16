import express from "express";

import genres from "../routes/genres.js";
import customers from "../routes/customers.js";
import movies from "../routes/movies.js";
import rentals from "../routes/rentals.js";
import users from "../routes/users.js";
import auth from "../routes/auth.js";
import returns from "../routes/returns.js";
import oauth from "../routes/oauth2Callback.js";

import error from "../middleware/error.js";

export default function (app) {
  const api = process.env.NODE_ENV === "production" ? "" : "/api";

  app.use(express.json());
  app.use(api + "/genres", genres);
  app.use(api + "/customers", customers);
  app.use(api + "/movies", movies);
  app.use(api + "/rentals", rentals);
  app.use(api + "/users", users);
  app.use(api + "/auth", auth);
  app.use(api + "/returns", returns);
  app.use(api + "/oauth2callback", oauth);

  app.use(error);
}
