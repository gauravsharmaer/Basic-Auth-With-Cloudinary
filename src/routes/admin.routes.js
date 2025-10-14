const express = require("express");
const authMiddleware = require("../middleware/isAuth.js");
const { getAdmin } = require("../controllers/admin.controllers.js");
const isAdminUser = require("../middleware/isAdmin.js");
const router = express.Router();
//check if authenticated and user is admin
router.get("/", authMiddleware, isAdminUser, getAdmin);
module.exports = router;
