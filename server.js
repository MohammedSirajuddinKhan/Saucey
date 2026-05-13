const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");
const { connectDB } = require("./config/db.js");

dotenv.config();

// DB Connection
connectDB();

const PORT = process.env.PORT;

const app = express();

app.set("trust proxy", 1);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));

//routes imported

app.use("/api/v1/auth", require("./routes/authRoutes.js"));
app.use("/api/v1/user", require("./routes/userRoutes.js"));
app.use("/api/v1/test", require("./routes/testRoute.js"));
app.use("/api/v1/restaurant", require("./routes/restaurantRoutes.js"));
app.use("/api/v1/category", require("./routes/categoryRoutes.js"));
app.use("/api/v1/food", require("./routes/foodRoutes.js"));
app.use("/api/v1/order", require("./routes/orderRoutes.js"));
app.use("/", require("./routes/webRoutes.js"));

app.use((req, res) => {
  if (req.accepts("html")) {
    return res.status(404).render("404");
  }

  return res.status(404).send({
    message: "Route not found",
  });
});

if (require.main === module && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SERVER LISTENING AT http://localhost:${PORT}`.bgWhite);
  });
}

module.exports = app;
