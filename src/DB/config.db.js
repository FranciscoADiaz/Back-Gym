const mongoose = require("mongoose");

const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://admin:admin123@cluster0.mongodb.net/gym?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URL)
  .then(() => {})
  .catch((error) => {
    const localUrl = "mongodb://localhost:27017/gym";
    mongoose
      .connect(localUrl)
      .then(() => {})
      .catch((localError) => {});
  });
module.exports = mongoose;
