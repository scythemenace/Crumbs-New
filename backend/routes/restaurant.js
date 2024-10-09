const express = require("express");
const app = express();
const jwtPassword = require("../token");
app.use(express.json());
const port = 3000;

// Importing from db
const { Restaurant } = require("./db/dbSchema");
const { Post } = require("./db/dbSchema");
const { Location } = require("./db/dbSchema");

// Importing middleware for auth
const { restaurantAuth } = require("../middleware/restaurant.js");

app.post("/restaurant/signup", async (req, res) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;
  const nickname = data.nickname;

  const restaurantExists = await Restaurant.findOne({
    username: username,
    password: password,
  });
  if (restaurantExists) {
    return res.status(409).json({
      message: "Restaurant already registered",
    });
  }

  const token = jwt.sign(
    { username: username, password: password },
    jwtPassword,
  );

  const restaurant = new Restaurant({
    username: data.username,
    password: data.password,
    name: data.name,
    token: token,
  });

  const location = new Location({
    nickname: nickname,
  });

  if (data.latitude && data.longitude) {
    const coords = [data.longitude, data.latitude];

    location.location = {
      type: "Point",
      coordinates: coords,
    };
    restaurant.location = location._id;
  } else {
    restaurant.address = data.address;
  }

  await location.save();
  await restaurant.save();
  res.status(200).json(restaurant);
});

app.post("/restaurant/signin", async (req, res) => {
  const { username, password } = req.body;
  const restaurantExists = await Restaurant.findOne({
    username: username,
    password: password,
  });
  if (restaurantExists) {
    return res.status(200).json({
      token: restaurantExists.token,
    });
  }
  return res.status(404).json({
    message: "Restaurant not registered",
  });
});

app.get("/restaurant/:id", restaurantAuth, async (req, res) => {
  const id = Number(req.params.id);
  const changes = req.body;
  const restaurant = await Restaurant.findOne({ _id: id });

  for (const change in changes) {
    restaurant[change] = changes[change];
  }

  return res.status(200).json({
    message: "Profile updated",
  });
});

app.post("/restaurant/post", restaurantAuth, async (req, res) => {
  const data = req.body;
  const coords = [data.longitude, data.latitude];
  const post = new Post({
    title: data.title,
    description: data.description,
    price: data.price,
    postedBy: data.postedBy,
    location: {
      type: "Point",
      coordinates: coords,
    },
  });

  post.expiresAt = new Date(data.expiryYear, data.expiryMonth, data.expiryDay);

  post.markModified("postedBy");
  await post.save();

  res.status(200).json(post);
});

app.post("/restaurant/post/:id", restaurantAuth, async (req, res) => {
  const id = Number(req.params.id);
  const post = await Post.findOne({ _id: id });
  const changes = req.body;

  for (const change in changes) {
    post[change] = changes[change];
  }

  res.status(200).json({
    message: "Post updated",
  });
});

app.listen(port, () => {
  console.log(`Started listening on ${port}`);
});
