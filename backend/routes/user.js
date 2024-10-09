const express = require("express");
const app = express();
app.use(express.json());
const jwtPassword = require("../token");
const port = 3000;

// Importing from db
const { User } = require("./db/dbSchema");
const { Location } = require("./db/dbSchema");
const { Post } = require("./db/dbSchema");

// Importing middleware for auth
const { userAuth } = require("../middleware/user.js");

app.post("/user/signup", async (req, res) => {
  const data = req.body;
  const username = data.username;
  const password = data.password;

  const userExists = await User.findOne({
    username: username,
    password: password,
  });
  if (userExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const token = jwt.sign(
    { username: username, password: password },
    jwtPassword,
  );

  const user = new User({
    username: data.username,
    password: data.password,
    name: data.name,
    token: token,
  });

  const location = new Location({
    nickname: nickname,
  });

  if (data.longitude && data.latitude) {
    const coords = [data.longitude, data.latitude];

    location.location = {
      type: "Point",
      coordinates: coords,
    };
    user.location = location._id;
  }

  if (data.address) {
    user.address = data.address;
  }

  await location.save();
  await user.save();
  res.status(200).json(user);
});

app.post("/user/signin", async (req, res) => {
  const { username, password } = req.body;
  const userExists = await User.findOne({
    username: username,
    password: password,
  });

  if (userExists) {
    return res.status(200).json({
      token: userExists.token,
    });
  }

  return res.status(404).json({
    message: "User doesn't exist",
  });
});

app.get("/users/:id", userAuth, async (req, res) => {
  const id = Number(req.params.id);
  const changes = req.body;
  const user = await User.findOne({ _id: id });

  for (const change in changes) {
    user[change] = changes[change];
  }

  return res.status(200).json({
    message: "Profile updated",
  });
});

app.get("/user/posts", userAuth, async (req, res) => {
  const longitude = req.query.longitude;
  const latitude = req.query.latitude;
  const minDistance = req.query.minDistance ? req.query.minDistance : 1000;
  const maxDistance = req.query.maxDistance ? req.query.maxDistance : 10000;
  const price = req.query.price ? req.query.price : 0;

  const posts = Post.find({
    price: price,
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $minDistance: minDistance,
        $maxDistance: maxDistance,
      },
    },
  });

  return res.status(200).json(posts);
});

app.listen(port, () => {
  console.log(`Started listening on ${port}`);
});
