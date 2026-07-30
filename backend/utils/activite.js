const ActiviteLog = require("../models/ActiviteLog");

async function enregistrerActivite(utilisateur, action, ressource, ressourceId, libelle) {
  await ActiviteLog.create({
    action,
    ressource,
    ressourceId,
    libelle,
    utilisateurNom: utilisateur.nom || utilisateur.email,
    utilisateurEmail: utilisateur.email,
  });
}

module.exports = { enregistrerActivite };
