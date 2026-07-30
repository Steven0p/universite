const jwt = require("jsonwebtoken");

function proteger(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Accès refusé, token manquant" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.utilisateur = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

function autoriser(...roles) {
  return (req, res, next) => {
    if (!req.utilisateur || !roles.includes(req.utilisateur.role)) {
      return res.status(403).json({ message: "Accès interdit pour ce rôle" });
    }
    next();
  };
}

module.exports = { proteger, autoriser };
