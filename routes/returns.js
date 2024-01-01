import express from "express";
import Rental from "../models/rental.js";
import Movie from "../models/movie.js";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import Joi from "joi";

const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("No rental found");

  if (rental.dateReturned)
    return res.status(400).send("Rental is already processed");

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

export default router;
