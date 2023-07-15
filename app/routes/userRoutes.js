const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
  authenticateTokenAdmin,
} = require("../utils/authUtils");




// user routes
router.get("/", authenticateToken, userController.getUser);
router.put("/", authenticateToken, userController.editUser);
router.delete("/", authenticateToken, userController.deleteUser);

// admin routes
router.get("/:userId", authenticateTokenAdmin, userController.getUser);
router.put("/:userId", authenticateTokenAdmin, userController.editUser);
router.delete("/:userId", authenticateTokenAdmin, userController.deleteUser);




module.exports = router;
