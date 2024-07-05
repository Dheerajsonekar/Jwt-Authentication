const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ status: false });
  }

  jwt.verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: false });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ status: false });
      }
      return res.status(200).json({ status: true, user });
    } catch (error) {
      console.error("Error verifying user:", error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  });
};
