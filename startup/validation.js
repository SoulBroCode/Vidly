import Joi from "joi";
import JoiObjectId from "joi-objectid";

export default function () {
  Joi.objectId = JoiObjectId(Joi);
}
