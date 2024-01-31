import cors from "cors";
import config from "config";

export default function (app) {
  const corsOptions = {
    origin: config.get("frontendOrigin"),
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}
