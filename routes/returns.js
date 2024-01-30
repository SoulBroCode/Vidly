import express from "express";
import Rental from "../models/rental.js";
import Movie from "../models/movie.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import validateObjectId from "../middleware/validateObjectId.js";
import mongoose from "mongoose";
import Joi from "joi";

const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rentals = await Rental.lookupMany(
    req.body.customerId,
    req.body.movieId
  );

  if (rentals.length === 0) res.status(404).send("No rental found");

  if (rentals.length > 1) {
    res
      .status(400)
      .send(
        "Multiple rentals found, can't process, use return with rental id instead"
      );
  }

  const rental = rentals[0];

  if (rental.dateReturned)
    return res.status(400).send("Rental is already processed");

  rental.return();

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await rental.save();
      await Movie.updateOne(
        { _id: rental.movie._id },
        { $inc: { numberInStock: 1 } }
      );

      res.send(rental);
    });

    session.endSession();
  } catch (error) {
    console.log("error", error.message);
  }
});

router.put("/:id", [auth, validateObjectId], async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  if (rental.dateReturned)
    return res.status(400).send("Rental is already processed");

  rental.return();

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await rental.save();
      await Movie.updateOne(
        { _id: rental.movie._id },
        { $inc: { numberInStock: 1 } }
      );

      res.send(rental);
    });

    session.endSession();
  } catch (error) {
    console.log("error", error.message);
  }
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

export default router;
