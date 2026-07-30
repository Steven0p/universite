const jwt = require("jsonwebtoken");
const Utilisateur = require("../models/Utilisateur");

function genererToken(utilisateur) {
  return jwt.sign(
    {
      id: utilisateur.id,
      role: utilisateur.role,
      faculteId: utilisateur.faculteId,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

exports.login = async (req, res) => {
  const { email, motDePasse } = req.body;
  if (!email || !motDePasse) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  const utilisateur = await Utilisateur.findOne({ where: { email } });
  if (!utilisateur) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const motDePasseValide = await utilisateur.comparerMotDePasse(motDePasse);
  if (!motDePasseValide) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  const token = genererToken(utilisateur);
  res.json({
    token,
    utilisateur: {
      id: utilisateur.id,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
      faculteId: utilisateur.faculteId,
    },
  });
};
