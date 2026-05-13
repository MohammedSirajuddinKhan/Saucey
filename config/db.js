const mongoose = require("mongoose");
const colors = require("colors");

let cachedConnection = global.mongooseConnection;

const connectDB = async () => {
  try {
    if (cachedConnection) {
      return cachedConnection;
    }

    const connection = await mongoose.connect(process.env.MONGODB_URI);
    cachedConnection = connection;
    global.mongooseConnection = connection;
    console.log(
      `DB CONNECTION SUCCESSFULL -> ${mongoose.connection.host}`.bgGreen,
    );

    return connection;
  } catch (error) {
    console.log("DB CONNECTION ERROR -> ", error.message, colors.bgRed);
    process.exit(1);
  }
};

module.exports = { connectDB };
