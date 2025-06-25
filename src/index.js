require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes.js");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;

// ✅ Vérification si JWT_SECRET est bien chargé
if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET manquant dans le fichier .env");
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
  console.log(`🌐 JWT_SECRET : ${process.env.JWT_SECRET ? "✅ Chargé" : "❌ Manquant"}`);
});
