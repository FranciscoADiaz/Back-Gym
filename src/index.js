const express = require("express");
const cors = require("cors");
require(__dirname + "/db/config.db.js");

const morgan = require("morgan");

const app = express();
const puerto = process.env.PORT || 3005;

app.use(
  cors({
    origin: [
      "https://front-gym-rho.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(morgan("dev"));

app.listen(puerto, () => {});

app.use("/api", require("./routes/index.routes"));

module.exports = app;
