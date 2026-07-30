const { Op } = require("sequelize");
const Cours = require("../models/Cours");
const Faculte = require("../models/Faculte");

exports.listerCours = async (req, res) => {
  const { faculteId, nom, semestre } = req.query;
  const where = {};
  if (faculteId) where.faculteId = faculteId;
  if (semestre) where.semestre = semestre;
  if (nom) where.nom = { [Op.like]: `%${nom}%` };

  const cours = await Cours.findAll({
    where,
    include: [{ model: Faculte, attributes: ["id", "nom"] }],
    order: [["nom", "ASC"]],
  });
  res.json(cours);
};

exports.obtenirCours = async (req, res) => {
  const cours = await Cours.findByPk(req.params.id, {
    include: [{ model: Faculte, attributes: ["id", "nom"] }],
  });
  if (!cours) return res.status(404).json({ message: "Cours introuvable" });
  res.json(cours);
};

function peutGererFaculte(utilisateur, faculteId) {
  if (utilisateur.role === "admin_general") return true;
  return utilisateur.role === "responsable_faculte" && String(utilisateur.faculteId) === String(faculteId);
}

exports.creerCours = async (req, res) => {
  const { faculteId, code, nom, description, credits, semestre, enseignant } = req.body;
  if (!faculteId || !code || !nom) {
    return res.status(400).json({ message: "faculteId, code et nom sont requis" });
  }
  if (!peutGererFaculte(req.utilisateur, faculteId)) {
    return res.status(403).json({ message: "Vous ne pouvez gérer que les cours de votre propre faculté" });
  }

  const cours = await Cours.create({ faculteId, code, nom, description, credits, semestre, enseignant });
  res.status(201).json(cours);
};

exports.modifierCours = async (req, res) => {
  const cours = await Cours.findByPk(req.params.id);
  if (!cours) return res.status(404).json({ message: "Cours introuvable" });
  if (!peutGererFaculte(req.utilisateur, cours.faculteId)) {
    return res.status(403).json({ message: "Vous ne pouvez gérer que les cours de votre propre faculté" });
  }

  const { code, nom, description, credits, semestre, enseignant } = req.body;
  await cours.update({ code, nom, description, credits, semestre, enseignant });
  res.json(cours);
};

exports.supprimerCours = async (req, res) => {
  const cours = await Cours.findByPk(req.params.id);
  if (!cours) return res.status(404).json({ message: "Cours introuvable" });
  if (!peutGererFaculte(req.utilisateur, cours.faculteId)) {
    return res.status(403).json({ message: "Vous ne pouvez gérer que les cours de votre propre faculté" });
  }

  await cours.destroy();
  res.json({ message: "Cours supprimé" });
};
