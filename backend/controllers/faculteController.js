const Faculte = require("../models/Faculte");
const Cours = require("../models/Cours");

exports.listerFacultes = async (req, res) => {
  const facultes = await Faculte.findAll({ order: [["nom", "ASC"]] });
  res.json(facultes);
};

exports.obtenirFaculte = async (req, res) => {
  const faculte = await Faculte.findByPk(req.params.id);
  if (!faculte) return res.status(404).json({ message: "Faculté introuvable" });
  res.json(faculte);
};

exports.creerFaculte = async (req, res) => {
  const { nom, description, doyen, image } = req.body;
  if (!nom) return res.status(400).json({ message: "Le nom de la faculté est requis" });

  const faculte = await Faculte.create({ nom, description, doyen, image });
  res.status(201).json(faculte);
};

exports.modifierFaculte = async (req, res) => {
  const faculte = await Faculte.findByPk(req.params.id);
  if (!faculte) return res.status(404).json({ message: "Faculté introuvable" });

  const { nom, description, doyen, image } = req.body;
  await faculte.update({ nom, description, doyen, image });
  res.json(faculte);
};

exports.supprimerFaculte = async (req, res) => {
  const faculte = await Faculte.findByPk(req.params.id);
  if (!faculte) return res.status(404).json({ message: "Faculté introuvable" });

  await Cours.destroy({ where: { faculteId: faculte.id } });
  await faculte.destroy();
  res.json({ message: "Faculté supprimée" });
};

exports.listerCoursDeFaculte = async (req, res) => {
  const faculte = await Faculte.findByPk(req.params.id);
  if (!faculte) return res.status(404).json({ message: "Faculté introuvable" });

  const cours = await Cours.findAll({ where: { faculteId: faculte.id }, order: [["nom", "ASC"]] });
  res.json(cours);
};
