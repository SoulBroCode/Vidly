import cookieParser from "cookie-parser";

export default function (app) {
  app.use(cookieParser());
}
