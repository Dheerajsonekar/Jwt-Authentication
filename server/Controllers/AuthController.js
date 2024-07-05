const User = require("../Models/UserModel");
const { SecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { username, dob, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ username, dob, email, password: hashedPassword });
    await newUser.save();

    const token = SecretToken(newUser._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(201).json({ message: "User signed up successfully", success: true, user: newUser });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Incorrect email or password!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password!" });
    }

    const token = SecretToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User logged in successfully!", success: true, user });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports.GetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ status: false, message: "Server error" });
  }
};