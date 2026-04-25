const jwt = require("jsonwebtoken");
const userModel = require("../models/users");

const verifyToken = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        success: 0,
        message: "No token provided"
      });
    }

    // Bearer TOKEN
    token = token.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: 0,
        message: "USER NOT FOUND"
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: 0,
        message: "Account deactivated"
      });
    }

    req.authUser = user;

    next();

  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: 0,
      message: "Invalid or expired token"
    });
  }
};

module.exports = { verifyToken };