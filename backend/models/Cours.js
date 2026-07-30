const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Faculte = require("./Faculte");

const Cours = sequelize.define("Cours", {
  code: { type: DataTypes.STRING, allowNull: false },
  nom: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: "" },
  credits: { type: DataTypes.INTEGER, defaultValue: 0 },
  semestre: { type: DataTypes.STRING, defaultValue: "" },
  enseignant: { type: DataTypes.STRING, defaultValue: "" },
});

Faculte.hasMany(Cours, { foreignKey: "faculteId", onDelete: "CASCADE" });
Cours.belongsTo(Faculte, { foreignKey: "faculteId" });

module.exports = Cours;
