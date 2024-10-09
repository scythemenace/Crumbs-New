const mongoose = require("mongoose");
const mongoDBURI = require("./mongoDBURI");

mongoose.connect(mongoDBURI);

const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const locationSchema = new mongoose.schema({
  nickname: String,
  location: {
    type: pointSchema,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  name: String,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
  },
  address: {
    type: String,
    required: () => {
      return this.location ? false : true;
    },
  },
  token: String,
});

userSchema.index({ location: "2dsphere" });

const restaurantSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  name: String, // Different that a name of a person, this should be a name of a restaurant.
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  token: String,
});

restaurantSchema.index({ location: "2dsphere" });

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: Date,
  price: {
    type: Number,
    default: 0,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
  },
  location: {
    type: pointSchema,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
const Location = mongoose.model("Location", locationSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = {
  User,
  Restaurant,
  Location,
  Post,
};
