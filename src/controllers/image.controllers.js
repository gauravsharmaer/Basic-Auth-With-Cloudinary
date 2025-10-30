const Image = require("../models/image.model.js");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper.js");
const fs = require("fs");
const cloudinary = require("../config/cloudinary.js");
const { parse } = require("path");
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "image is required",
      });
    }
    //upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);
    //set it in db
    const image = await Image.create({
      url,
      publicId,
      uploadedBy: req.user.userId, //coming from isAuthmiddleware
    });
    //delete file from local after saving in db
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      success: true,
      message: "image uploaded successfully",
      image,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const fetchAllImagesController = async (req, res) => {
  try {
    const page = parse(req.query.page) || 1;
    const limit = parse(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder;
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    res.status(200).json({
      success: true,
      images,
      totalImages,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const getImages = async (req, res) => {
  try {
    const images = await Image.find({ uploadedBy: req.user.userId });
    res.status(200).json({
      success: true,
      images,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const getCurrentIdOfImageToBweDeleted = req.params.id;
    const userId = req.user.userId;

    const image = await Image.findByIdAndDelete(
      getCurrentIdOfImageToBweDeleted
    );
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "image not found",
      });
    }

    //check if image belongs to user
    if (image.uploadedBy.toString() !== userId) {
      return res.status(401).json({
        success: false,
        message: "unauthorized",
      });
    }
    //delete image from cloudinary
    await cloudinary.uploader.destroy(image.publicId);

    //delete from mongodb
    await Image.findByIdAndDelete(getCurrentIdOfImageToBweDeleted);

    res.status(200).json({
      success: true,
      message: "image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = {
  uploadImage,
  getImages,
  deleteImage,
  fetchAllImagesController,
};
