require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes.js");

const app = express();

// Security middlewares
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8081'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req, res) => res.status(200).json({ ok: true }));

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
