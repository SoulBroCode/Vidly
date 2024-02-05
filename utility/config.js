import config from "config";

export default function (key, errorMsg) {
  const value = config.get(key);
  if (!value) {
    throw new Error(errorMsg);
  }
  return value;
}
