import mongoose from "mongoose";
import colors from "colors"
//mongodb connection
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `DB CONNECTION SUCCESSFULL -> ${mongoose.connection.host}`.bgGreen
    );
  } catch (error) {
    console.log("DB CONNECTION ERROR -> ", error,colors.bgRed);
  }
};
