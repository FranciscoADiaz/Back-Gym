const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("La base de datos está conectada"))
  .catch((error) => console.log(error));


