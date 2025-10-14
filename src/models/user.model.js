const mongoose = require("mongoose");
const { AvailableUserRoles, UserRolesEnum } = require("../utils/constants.js");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: AvailableUserRoles,
      default: UserRolesEnum.USER,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
