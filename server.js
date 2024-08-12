const express = require("express");
const cors = require("cors");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//env configuration
dotenv.config();

//DB connection
connectDB();

// rest object
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

//middlewares
app.use(cors(corsOptions)); // cors
app.use(express.json()); // json
app.use(morgan("dev"));

//routes
app.get("/", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  return res
    .status(200)
    .send(
      "<h1>Welcome to VJIT Placement Portal Server</h1><h3>Started on Sunday June 8 2024 12:57PM</h3>"
    );
});

// authentication routes
app.use("/api/v1/auth", require("./routes/authRoutes"));

// user routes
app.use("/api/v1/user", require("./routes/userRoutes"));

// student routes
app.use("/api/v1/student", require("./routes/studentRoutes"));

// admin routes
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// placement routes
app.use("/api/v1/placements", require("./routes/placementRoutes.js"));

// placement application routes
app.use(
  "/api/v1/application",
  require("./routes/placementApplicationRoutes.js")
);

//PORT
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.white.bgMagenta);
});
