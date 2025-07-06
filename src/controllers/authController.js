const axios = require("axios");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const DB_SERVICE_URL = process.env.DB_SERVICE_URL || "http://localhost:4001"; // 👈 port correct du service BDD

// Register
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà dans la base
    const existing = await axios
      .get(`${DB_SERVICE_URL}/api/users/email/${email}`)
      .catch(() => null);

    if (existing && existing.data) {
      return res.status(400).json({ error: "Cet utilisateur existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crée l'utilisateur via le service BDD
    const { data: user } = await axios.post(`${DB_SERVICE_URL}/api/users`, {
      email,
      password: hashedPassword,
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user,
      token,
    });
  } catch (error) {
    console.error("Erreur dans register:", error.response?.data || error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user } = await axios.get(`${DB_SERVICE_URL}/api/users/email/${email}`);

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe invalide." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email ou mot de passe invalide." });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      message: "Connexion réussie",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Erreur dans login:", error.response?.data || error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Me
const me = async (req, res) => {
  try {
    const { data: user } = await axios.get(`${DB_SERVICE_URL}/api/users/${req.user.id}`);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur dans me:", error.response?.data || error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Delete
const deleteAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    await axios.delete(`${DB_SERVICE_URL}/api/users/${userId}`);
    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (error) {
    console.error("Erreur dans deleteAccount:", error.response?.data || error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { register, login, me, deleteAccount };
