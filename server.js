const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db.js");

dotenv.config();

// DB Connection
connectDB();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes imported

app.use("/api/v1/auth", require("./routes/authRoutes.js"))
app.use("/api/v1/user",require("./routes/userRoutes.js"))

app.get("/", function (req, res) {
  return res.status(200).send("<h1>Welcome to FOOD SERVER APP</h1>");
});

app.listen(PORT, () => {
  console.log(`SERVER LISTENING AT http://localhost:${PORT}`.bgWhite);
});
