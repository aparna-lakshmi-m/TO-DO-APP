const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error("MONGO_URL is not defined in .env file");
  process.exit(1); // Exit the process with an error code
}

console.log(MONGO_URL);

mongoose
  .connect("mongodb://0.0.0.0:27017/todoapp")
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit the process with an error code
  });

