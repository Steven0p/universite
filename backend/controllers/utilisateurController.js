const Utilisateur = require("../models/Utilisateur");
const Faculte = require("../models/Faculte");
const { enregistrerActivite } = require("../utils/activite");

const SANS_MOT_DE_PASSE = { exclude: ["motDePasse"] };

exports.listerUtilisateurs = async (req, res) => {
  const utilisateurs = await Utilisateur.findAll({
    attributes: SANS_MOT_DE_PASSE,
    include: [{ model: Faculte, attributes: ["id", "nom"] }],
    order: [["nom", "ASC"]],
  });
  res.json(utilisateurs);
};

exports.creerUtilisateur = async (req, res) => {
  const { nom, email, motDePasse, role, faculteId } = req.body;
  if (!nom || !email || !motDePasse || !role) {
    return res.status(400).json({ message: "nom, email, motDePasse et role sont requis" });
  }
  if (!["admin_general", "responsable_faculte"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }
  if (role === "responsable_faculte" && !faculteId) {
    return res.status(400).json({ message: "faculteId est requis pour un responsable de faculté" });
  }

  const existant = await Utilisateur.findOne({ where: { email } });
  if (existant) return res.status(409).json({ message: "Cet e-mail est déjà utilisé" });

  const utilisateur = await Utilisateur.create({
    nom, email, motDePasse, role,
    faculteId: role === "responsable_faculte" ? faculteId : null,
  });

  await enregistrerActivite(req.utilisateur, "creation", "utilisateur", utilisateur.id, `${nom} (${email})`);

  const { motDePasse: _omis, ...donnees } = utilisateur.toJSON();
  res.status(201).json(donnees);
};

exports.modifierUtilisateur = async (req, res) => {
  const utilisateur = await Utilisateur.findByPk(req.params.id);
  if (!utilisateur) return res.status(404).json({ message: "Utilisateur introuvable" });

  const { nom, email, motDePasse, role, faculteId } = req.body;
  if (role && !["admin_general", "responsable_faculte"].includes(role)) {
    return res.status(400).json({ message: "Rôle invalide" });
  }

  if (nom) utilisateur.nom = nom;
  if (email) utilisateur.email = email;
  if (role) utilisateur.role = role;
  utilisateur.faculteId = utilisateur.role === "responsable_faculte" ? (faculteId || utilisateur.faculteId) : null;
  if (motDePasse) utilisateur.motDePasse = motDePasse;

  await utilisateur.save();
  await enregistrerActivite(req.utilisateur, "modification", "utilisateur", utilisateur.id, `${utilisateur.nom} (${utilisateur.email})`);

  const { motDePasse: _omis, ...donnees } = utilisateur.toJSON();
  res.json(donnees);
};

exports.supprimerUtilisateur = async (req, res) => {
  const utilisateur = await Utilisateur.findByPk(req.params.id);
  if (!utilisateur) return res.status(404).json({ message: "Utilisateur introuvable" });

  if (String(utilisateur.id) === String(req.utilisateur.id)) {
    return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
  }

  const libelle = `${utilisateur.nom} (${utilisateur.email})`;
  await utilisateur.destroy();
  await enregistrerActivite(req.utilisateur, "suppression", "utilisateur", req.params.id, libelle);

  res.json({ message: "Utilisateur supprimé" });
};
