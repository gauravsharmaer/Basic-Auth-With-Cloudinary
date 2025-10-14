const Image = require("../models/image.model.js");
const { uploadToCloudinary } = require("../utils/cloudinaryHelper.js");
const fs = require("fs");
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

module.exports = {
  uploadImage,
  getImages,
};
