import app from "./app";
import dotenv from "dotenv";
import connectDB from "./utils/db";
dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`SERVER RUNING IN ${process.env.PORT} port`);
  connectDB();
});
