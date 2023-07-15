const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models").User;
const { sendPasswordResetEmail } = require("../utils/emailUtils");
const { jwtSecret } = require("../../config");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "user_already_exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "user_registered_successfully",
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      error: true,
      message: "register_user_error",
      details: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "user_not_found",
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        error: true,
        message: "invalid_password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
      },
      jwtSecret,
      { expiresIn: "356d" }
    );

    res.status(200).json({
      success: true,
      message: "user_logged_in_successfully",
      data: { userId: user.id, username: user.name, token, email: user.email },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      error: true,
      message: "unknown_error",
      details: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate new password
    const newPassword = Math.random().toString(36).slice(-8);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.update({ password: hashedPassword }, { where: { email } });

    // Send password reset email
    await sendPasswordResetEmail(email, newPassword);

    res.status(200).json({
      success: true,
      message: "password_reset_successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      error: true,
      message: "reset_password_error",
      details: error.message,
    });
  }
};

module.exports = { registerUser, loginUser, resetPassword };
