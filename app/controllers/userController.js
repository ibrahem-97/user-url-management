const bcrypt = require("bcrypt");
const { sequelize } = require("../models");
const User = require("../models").User;
const URL = require("../models").URL;

const getUser = async (req, res) => {
  console.log("getUser");
  try {
    let { userId } = req.params;
    // check user is admin or not
    if (req.user.type != "admin") {
      userId = req.user.userId;
    }
    if (!userId && req.user.type == "admin") {
      userId = req.user.userId;
    }
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "user_not_found",
      });
    }

    // Exclude password from the response
    const { password, ...userData } = user.toJSON();

    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error in getUser:", error);
    res.status(500).json({
      error: true,
      message: "get_user_error",
      details: error.message,
    });
  }
};

const editUser = async (req, res) => {
  try {
    let { userId } = req.params;
    // check user is admin or not
    if (req.user.type != "admin") {
      userId = req.user.userId;
    }
    if (!userId && req.user.type == "admin") {
      userId = req.user.userId;
    }
    const { username, email, password } = req.body;
    let profilePicture = null;
    if (req.files && req.files.length > 0) {
      profilePicture = req.files[0].path;
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "user_not_found",
      });
    }

    // Update user data
    user.username = username || user.username;
    user.email = email || user.email;

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (profilePicture) {
      user.profile_picture = profilePicture;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "user_updated_successfully",
    });
  } catch (error) {
    console.error("Error in editUser:", error);
    res.status(500).json({
      error: true,
      message: "edit_user_error",
      details: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    let { userId } = req.params;
    // check user is admin or not
    if (req.user.type != "admin") {
      userId = req.user.userId;
    }
    if (!userId && req.user.type == "admin") {
      userId = req.user.userId;
    }
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "user_not_found",
      });
    }

    // Delete the user and associated URLs
    (async () => {
      await sequelize.sync();
      // delete urls associated with the user
      await URL.destroy({
        where: {
          user_id: userId,
        },
      });
      // delete the user
      await user.destroy({
        where: {
          id: userId,
        },
      });
    })();
    res.status(200).json({
      success: true,
      message: "user_deleted_successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({
      error: true,
      message: "delete_user_error",
      details: error.message,
    });
  }
};

/**
 * function to get all users (admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    // check user is admin or not
    if (req.user.type != "admin") {
      return res.status(403).json({
        error: true,
        message: "unauthorized_access",
      });
    }
    const users = await User.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      error: true,
      message: "get_all_users_error",
      details: error.message,
    });
  }
};
module.exports = { getUser, editUser, deleteUser, getAllUsers };
