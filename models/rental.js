import Joi from "joi";
import moment from "moment";
import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

rentalSchema.statics.lookup = function (customerId, movieId) {
  return this.findOne({
    "customer._id": new mongoose.Types.ObjectId(customerId),
    "movie._id": new mongoose.Types.ObjectId(movieId),
  });
};

rentalSchema.statics.lookupMany = function (customerId, movieId) {
  return this.find({
    "customer._id": new mongoose.Types.ObjectId(customerId),
    "movie._id": new mongoose.Types.ObjectId(movieId),
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  this.rentalFee =
    moment().diff(this.dateOut, "days") * this.movie.dailyRentalRate;
};

const Rental = mongoose.model("Rental", rentalSchema);

export function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental); //Joi.validate(rental, schema);
}

export default Rental;
