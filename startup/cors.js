import cors from "cors";

export default function (app) {
  if (process.env.NODE_ENV === "development") {
    app.use(cors());
    console.log("in development");
  }
}
