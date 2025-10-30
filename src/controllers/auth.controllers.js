const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const registerUser = async (req, res) => {
  try {
    //get details from body
    const { username, email, password } = req.body;
    //check the regex is the values are what they supposed to be

    //check if username or email already exists in db
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists with this user name or email",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //creare new user and save in db
    const newlyCreatedUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (newlyCreatedUser) {
      return res.status(201).json({
        success: true,
        message: "user created successfully",
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "Unable to register user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong please try again",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const properPassword = await bcrypt.compare(password, userExist.password);
    if (!properPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //create user token which user will store in local or seeeion and send in back in header as bearer token with api request and in auth middleware we will check if user has this token
    const accessToken = jwt.sign(
      {
        userId: userExist._id,
        username: userExist.username,
        email: userExist.email,
        role: userExist.role,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );
    res.status(200).json({
      success: true,
      message: "Logged in Successful",
      accessToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "something went wrong please try again",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;
    const userExist = await User.findById(userId);
    if (!userExist) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const properPassword = await bcrypt.compare(
      oldPassword,
      userExist.password
    );
    if (!properPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    //update in db
    userExist.password = newHashedPassword;
    await userExist.save();
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "something went wrong please try again",
    });
  }
};

module.exports = { loginUser, registerUser, changePassword };
