import request from "supertest";
import User from "../../models/user.js";
//import Genre from "../../models/genre.js";
import Rental from "../../models/rental.js";
import Movie from "../../models/movie.js";
import mongoose from "mongoose";
import moment from "moment";

let server;
let token;
let customerId;
let movieId;
let rental;
let movie;

describe("/api/returns", () => {
  const exec = () => {
    return request(server)
      .post("/api/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index.js");

    token = new User().generateAuthToken();
    customerId = new mongoose.Types.ObjectId().toHexString();
    movieId = new mongoose.Types.ObjectId().toHexString();

    movie = new Movie({
      _id: movieId,
      title: "movie1",
      dailyRentalRate: 2,
      genre: { name: "12345" },
      numberInStock: 10,
    });
    await movie.save();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "movie1",
        dailyRentalRate: 2,
      },
    });
    await rental.save();
  });
  afterEach(async () => {
    await Movie.collection.drop();
    await Rental.collection.drop();
    await server.close();
  });

  describe("POST /", () => {
    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if customerId is not provided", async () => {
      customerId = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if movieId is not provided", async () => {
      movieId = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if no rental found for this customer/movie", async () => {
      await Rental.collection.drop();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if rental already processed", async () => {
      rental.dateReturned = new Date();
      await rental.save();

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 200 if rental is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
    });

    it("should set the returnDate if input is valid", async () => {
      const res = await exec();

      const rentalInDb = await Rental.findById(rental._id);
      const diff = new Date() - rentalInDb.dateReturned; //difference in millisecond
      expect(diff).toBeLessThan(10 * 1000); //Less than 10 second
    });

    it("should set the rentalFee if input is valid", async () => {
      rental.dateOut = moment().add(-7, "days").toDate();
      await rental.save();

      const res = await exec();

      const rentalInDb = await Rental.findById(rental._id);

      expect(rentalInDb.rentalFee).toBe(14);
    });

    it("should increase the movie stock if input is valid", async () => {
      const res = await exec();

      const movieInDb = await Movie.findById(movieId);

      expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it("should return the rental if input is valid", async () => {
      const res = await exec();

      const rentalInDb = await Rental.findById(rental._id);

      // expect(res.body).toHaveProperty("");
      // expect(res.body).toHaveProperty("dateReturned");
      // expect(res.body).toHaveProperty("rentalFee");
      // expect(res.body).toHaveProperty("customer");
      // expect(res.body).toHaveProperty("movie");

      expect(Object.keys(res.body)).toEqual(
        expect.arrayContaining([
          "dateOut",
          "dateReturned",
          "rentalFee",
          "customer",
          "movie",
        ])
      );
    });
  });
});
