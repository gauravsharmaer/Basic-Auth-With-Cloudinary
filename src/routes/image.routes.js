const express = require("express");
const {
  uploadImage,
  getImages,
  deleteImage,
  fetchAllImagesController,
} = require("../controllers/image.controllers.js");
const authMiddleware = require("../middleware/isAuth.js");
const isAdminUser = require("../middleware/isAdmin.js");
const uploadMiddleware = require("../middleware/uploadMiddleware.js");

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  isAdminUser,
  uploadMiddleware.single("image"),
  uploadImage
);
router.get("/", authMiddleware, isAdminUser, getImages);
router.get("/all", authMiddleware, isAdminUser, fetchAllImagesController);
router.delete("/:id", authMiddleware, isAdminUser, deleteImage);
module.exports = router;
