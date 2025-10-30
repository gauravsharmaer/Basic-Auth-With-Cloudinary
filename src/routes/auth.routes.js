const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  changePassword,
} = require("../controllers/auth.controllers.js");
const authMiddleware = require("../middleware/isAuth.js");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
