const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization;
  if (!authToken) {
    return res.status(401).json({
      success: false,
      message: "user not authenticated",
    });
  }
  const token = authToken.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Acess denied user not authenticated",
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //will save decoded details in req.user
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Acess denied user not authenticated",
    });
  }
};

module.exports = authMiddleware;
