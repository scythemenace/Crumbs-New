const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;

// Importing from db
const { User } = require("./db/dbSchema");
const { Restaurant } = require("./db/dbSchema");
const { Post } = require("./db/dbSchema");

app.get("/user", async (req, res) => {
  const data = req.body;
  const coords = [data.longitude, data.latitude];
  const user = new User({
    username: data.username,
    password: data.password,
    name: data.name,
    location: {
      type: "Point",
      coordinates: coords,
    },
  });

  await user.save();
  res.status(200).json(user);
});

app.get("/restaurant", async (req, res) => {
  const data = req.body;
  const coords = [data.longitude, data.latitude];
  const restaurant = new Restaurant({
    username: data.username,
    password: data.password,
    location: {
      type: "Point",
      coordinates: coords,
    },
  });
  await restaurant.save();
  res.status(200).json(restaurant);
});

app.get("/post", async (req, res) => {
  const data = req.body;
  const post = new Post({
    title: data.title,
    description: data.description,
    price: data.price,
    postedBy: data.postedBy,
  });

  post.expiresAt = new Date(data.expiryYear, data.expiryMonth, data.expiryDay);
  //post.postedBy.setDate(data.expiryDay);
  //post.postedBy.setMonth(data.expiryMonth);
  //post.postedBy.setFullYear(data.expiryYear);

  post.markModified("postedBy");
  await post.save();

  res.status(200).json(post);
});

app.listen(port, () => {
  console.log(`Started listening on ${port}`);
});
