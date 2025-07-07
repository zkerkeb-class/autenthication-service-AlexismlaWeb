const axios = require("axios");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // Librairie native Node.js !
const generateToken = require("../utils/generateToken");

const DB_SERVICE_URL = process.env.DB_SERVICE_URL || "http://localhost:4001";
const MAIL_SERVICE_URL = process.env.MAIL_SERVICE_URL || "http://localhost:4004";

// REGISTER
const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existing = await axios.get(`${DB_SERVICE_URL}/api/users/email/${email}`).catch(() => null);
    if (existing && existing.data) {
      return res.status(400).json({ error: "Cet utilisateur existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerifyToken = crypto.randomBytes(24).toString("hex"); 

    // Crée l'utilisateur en BDD avec le token de vérif
    const { data: user } = await axios.post(`${DB_SERVICE_URL}/api/users`, {
      email,
      password: hashedPassword,
      emailVerifyToken,
    });

    // Envoi du mail de confirmation
    await axios.post(`${MAIL_SERVICE_URL}/api/mail/send`, {
      to: email,
      subject: "Confirme ton adresse e-mail",
      text: `Bienvenue ! Voici ton code de confirmation : ${emailVerifyToken}\n\nEntre ce code dans l’application pour valider ton compte.`,
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: "Utilisateur créé, vérifie tes mails pour confirmer ton compte.",
      user,
      token,
    });
  } catch (error) {
    console.error("Erreur dans register:", error.response?.data || error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Champs manquants." });

  try {
    const { data: user } = await axios.get(`${DB_SERVICE_URL}/api/users/email/${email}`);
    if (!user || !user.emailVerifyToken) return res.status(400).json({ error: "Aucun token à valider." });
    if (user.emailVerifyToken !== code) return res.status(400).json({ error: "Code invalide." });

    await axios.put(`${DB_SERVICE_URL}/api/users/${user.id}`, {
      isEmailVerified: true,
      emailVerifyToken: null,
    });

    res.status(200).json({ message: "Email vérifié !" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data: user } = await axios.get(`${DB_SERVICE_URL}/api/users/email/${email}`);
    if (!user) return res.status(401).json({ error: "Email ou mot de passe invalide." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Email ou mot de passe invalide." });

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

// ME
const me = async (req, res) => {
  try {
    const { data: user } = await axios.get(`${DB_SERVICE_URL}/api/users/${req.user.id}`);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur dans me:", error.response?.data || error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// DELETE
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

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requis." });

  try {
    const { data: user } = await axios.get(`${DB_SERVICE_URL}/api/users/email/${email}`);
    if (!user) return res.status(404).json({ error: "Aucun compte avec cet email." });

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30);

    await axios.put(`${DB_SERVICE_URL}/api/users/${user.id}/reset-password`, {
      resetToken: token,
      resetTokenExpires: expires,
    });

    // Envoi du mail via service mail
    await axios.post(`${MAIL_SERVICE_URL}/api/mail/send`, {
      to: email,
      subject: "Réinitialisation du mot de passe",
      text: `Voici ton code de réinitialisation : ${token}\n\nCopie ce code dans l’application pour changer ton mot de passe.`,
    });

    res.status(200).json({ message: "Email envoyé." });
  } catch (err) {
    console.error("Erreur forgotPassword:", err.response?.data || err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: "Champs manquants." });

  try {
    const { data: user } = await axios.get(`${DB_SERVICE_URL}/api/users/by-reset-token/${token}`);
    if (!user || !user.resetTokenExpires || new Date(user.resetTokenExpires) < new Date()) {
      return res.status(400).json({ error: "Token invalide ou expiré." });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await axios.put(`${DB_SERVICE_URL}/api/users/${user.id}/reset-password`, {
      resetToken: null,
      resetTokenExpires: null,
      password: hashedPassword,
    });    

    res.status(200).json({ message: "Mot de passe réinitialisé." });
  } catch (err) {
    console.error("Erreur resetPassword:", err.response?.data || err);
    res.status(500).json({ error: "Erreur serveur." });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  me,
  deleteAccount,
  forgotPassword,
  resetPassword,
};
