const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth.routes.js");
const homeRoutes = require("./src/routes/home.routes.js");
const adminRoutes = require("./src/routes/admin.routes.js");
const imageRoutes = require("./src/routes/image.routes.js");
const connectDB = require("./src/db/dbConnect.js");
dotenv.config();

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello",
  });
});
const port = process.env.PORT || 3030;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`sun rha hu ${port} pr`);
    });
  })
  .catch((err) => {
    console.error("err connecting db", err);
    process.exit(1);
  });
