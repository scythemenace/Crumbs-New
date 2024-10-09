const jwt = require("jsonwebtoken");
const jwtpassword = require("../token");
const { Restaurant } = require("../db/dbSchema");

async function restaurantAuth(req, res, next) {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, jwtpassword);
  if (decoded != undefined && Object.keys(decoded).length >= 1) {
    const restaurantExists = Restaurant.findOne({
      username: decoded.username,
      password: decoded.password,
    });
    if (restaurantExists) {
      return next();
    }
    return res.status(404).json({
      message: "Restaurant not found",
    });
  }
  return res.status(404).json({
    message: "Token is invalid",
  });
}

module.exports = restaurantAuth;
