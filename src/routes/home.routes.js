const express = require("express");
const { getHome } = require("../controllers/home.controllers.js");
const authMiddleware = require("../middleware/isAuth.js");
const router = express.Router();
router.get("/", authMiddleware, getHome);
module.exports = router;
