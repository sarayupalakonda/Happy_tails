const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);



const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
const createAdmin = require("./config/adminInit");

const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://happy-tails-0opo.onrender.com",
  ...(process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(",").map(origin => origin.trim()) : []),
  ...(process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map(origin => origin.trim()) : [])
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());

// Initialize Default Admin
createAdmin();

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/dogs", require("./routes/dogRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/adoption", require("./routes/adoptionRoutes")); // Legacy
app.use("/api/adoptions", require("./routes/adoptionRoutes")); // New plural standard
app.use("/api/admin", require("./routes/adminRoutes"));

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
