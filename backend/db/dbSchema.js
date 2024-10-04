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

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  name: String,
  location: {
    type: pointSchema,
    required: true,
  },
});

userSchema.index({ location: "2dsphere" });

const restaurantSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  name: String, // Different that a name of a person, this should be a name of a restaurant.
  location: {
    type: pointSchema,
    required: true,
  },
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
});

const User = mongoose.model("User", userSchema);
const Restaurant = mongoose.model("Restaurant", restaurantSchema);
const Post = mongoose.model("Post", postSchema);

module.exports = {
  User,
  Restaurant,
  Post,
};
