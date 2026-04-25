const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // ✅ use your file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect DB
connectDB();

// ✅ Middleware
app.use(express.json());

// ✅ CORS (keep simple for now)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Content-Type, Accept, Authorization"
  );
  next();
});

// ✅ Routes
app.use("/", require("./routes"));

// ✅ Start server (ALWAYS LAST)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});