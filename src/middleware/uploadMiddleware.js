const multer = require("multer");
const path = require("path");

//setting multer tsorage
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "src/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

//file filter function
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("file type is not supported"), false);
  }
};

//multer middleware

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //5 mb
});
