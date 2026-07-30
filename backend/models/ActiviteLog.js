const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ActiviteLog = sequelize.define(
  "ActiviteLog",
  {
    action: {
      type: DataTypes.ENUM("creation", "modification", "suppression"),
      allowNull: false,
    },
    ressource: {
      type: DataTypes.ENUM("faculte", "cours", "utilisateur"),
      allowNull: false,
    },
    ressourceId: { type: DataTypes.INTEGER, allowNull: true },
    libelle: { type: DataTypes.STRING, allowNull: false },
    utilisateurNom: { type: DataTypes.STRING, allowNull: false },
    utilisateurEmail: { type: DataTypes.STRING, allowNull: false },
  },
  { updatedAt: false }
);

module.exports = ActiviteLog;
