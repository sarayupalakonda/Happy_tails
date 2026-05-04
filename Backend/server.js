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

app.use(cors());
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
