import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL = process.env.DB_URL || "";

const connectDB = async () => {
  try {
    await mongoose
      .connect(DB_URL)
      .then((data) =>
        console.log(`Database connected with ${data.connection.host}`)
      );
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
