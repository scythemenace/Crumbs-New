const { User } = require("../db/dbSchema");
const jwt = require("jsonwebtoken");
const jwtpassword = require("../token");

async function userAuth(req, res, next) {
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, jwtpassword);

  if (decoded != undefined && Object.keys(decoded).length >= 1) {
    const userExists = User.findOne({
      username: decoded.username,
      password: decoded.password,
    });
    if (userExists) {
      return next();
    }
    return res.status(404).json({
      message: "User doesn't exist",
    });
  }
  return res.status(404).json({
    message: "Token is invalid",
  });
}

module.exports = userAuth;
