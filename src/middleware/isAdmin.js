const isAdminUser = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "user is not admin",
    });
  }
  next();
};
module.exports = isAdminUser;
