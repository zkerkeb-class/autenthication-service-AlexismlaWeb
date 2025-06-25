const bcrypt = require("bcrypt");
const prisma = require("../prisma/client");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Cet utilisateur existe déjà." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: "Utilisateur créé avec succès",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Erreur dans register:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
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
    console.error("Erreur dans login:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true },
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Erreur dans me:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const deleteAccount = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé." });
    }

    await prisma.user.delete({ where: { id: userId } });

    res.status(200).json({ message: "Compte supprimé avec succès." });
  } catch (error) {
    console.error("Erreur dans deleteAccount:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = { register, login, me, deleteAccount };
