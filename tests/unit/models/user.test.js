import User from "../../../models/user.js";
import jwt from "jsonwebtoken";
import config from "config";
import mongoose from "mongoose";

describe("user.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const user = new User(payload);
    const token = user.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});

// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign(
//       { _id: this._id, isAdmin: this.isAdmin },
//       config.get("jwtPrivateKey")
//     );
//     return token;
//   };
