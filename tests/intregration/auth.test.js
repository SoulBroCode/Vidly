import User from "../../models/user.js";
import Genre from "../../models/genre.js";
import request from "supertest";

let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index.js");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await Genre.collection.drop();
    await server.close();
  });

  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genri1" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
