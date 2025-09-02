const express = require("express");
const cors = require("cors");
require(__dirname + "/db/config.db.js");

const morgan = require("morgan");

const app = express();
const puerto = process.env.PORT || 3005;

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "https://front-gym-rho.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(express.json());
app.use(morgan("dev"));

app.listen(puerto, () => {});

app.use("/api", require("./routes/index.routes"));

module.exports = app;
