import cors from "cors";
import config from "../utility/config";

export default function (app) {
  const origins = config(
    "origins",
    "FATAL ERROR: cors' origins is not defined."
  );

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origins.indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    allowedHeaders: ["Content-Type", "x-auth-token"],
    optionsSuccessStatus: 200,
    credentials: true,
  };

  app.use(cors(corsOptions));
}
