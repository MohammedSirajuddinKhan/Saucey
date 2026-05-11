const express = require("express");
const colors = require("colors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", function (req, res) {
  return res.status(200).send("<h1>Welcome to FOOD SERVER APP</h1>");
});

app.listen(PORT, () => {
  console.log(`server listening at http://localhost:${PORT}`);
});
