const mongoose = require("mongoose");
const userSchema = require("../models/users");
const jwt = require("jsonwebtoken");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");

const userModel = mongoose.models.User || mongoose.model("User", userSchema);

// Encrypt Password
const encryptOption = (option, salt = 10) => {
  const genSalt = genSaltSync(salt);
  return hashSync(option, genSalt);
};

// ================= REGISTER =================
const userRegister = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName) {
      return res.status(400).json({ success: 0, message: "First name is required" });
    }
    if (!lastName) {
      return res.status(400).json({ success: 0, message: "Last name is required" });
    }
    if (!email) {
      return res.status(400).json({ success: 0, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ success: 0, message: "Password is required" });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: 0, message: "Email already exists" });
    }

    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: encryptOption(password),
      role: role || "user",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return res.status(200).json({
      success: 1,
      message: "User successfully created",
      userId: user._id
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: 0, message: "Server error" });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res.status(400).json({ success: 0, message: "Username is required" });
    }
    if (!password) {
      return res.status(400).json({ success: 0, message: "Password is required" });
    }

    const user = await userModel.findOne({ email: username });

    console.log("LOGIN USER:", user); // debug

    if (!user) {
      return res.status(400).json({ success: 0, message: "Email not found" });
    }

    const isPasswordMatch = compareSync(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: 0, message: "Password is incorrect" });
    }

    // ✅ FIXED TOKEN STRUCTURE
    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: 1,
      message: "Login Success",
      accessToken: token
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: 0, message: "Server error" });
  }
};

// ================= GET USERS =================
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { firstName: 1, lastName: 1 });

    const formattedUsers = users.map(
      (u) => `${u.firstName} ${u.lastName}`
    );

    return res.status(200).json({
      success: 1,
      message: "Users retrieved successfully",
      users: formattedUsers
    });

  } catch (error) {
    return res.status(500).json({ success: 0, message: "Server error" });
  }
};

// ================= VIEW DETAIL =================
const viewDetail = async (req, res) => {
  try {
    return res.status(200).json({
      success: 1,
      message: "User detail retrieved successfully",
      data: {
        firstName: req.authUser.firstName,
        lastName: req.authUser.lastName
      }
    });
  } catch (error) {
    return res.status(500).json({ success: 0, message: "Server error" });
  }
};

module.exports = {
  userRegister,
  login,
  getAllUsers,
  viewDetail
};