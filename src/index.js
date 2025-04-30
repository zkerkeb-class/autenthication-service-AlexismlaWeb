require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes.js");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
});
