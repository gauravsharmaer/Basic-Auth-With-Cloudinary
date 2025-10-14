const cloudinary = require("../config/cloudinary.js");

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { uploadToCloudinary };
