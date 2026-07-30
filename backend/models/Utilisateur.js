const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");
const Faculte = require("./Faculte");

const Utilisateur = sequelize.define(
  "Utilisateur",
  {
    nom: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    motDePasse: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("admin_general", "responsable_faculte"),
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeSave: async (utilisateur) => {
        if (utilisateur.changed("motDePasse")) {
          utilisateur.motDePasse = await bcrypt.hash(utilisateur.motDePasse, 10);
        }
      },
    },
  }
);

Utilisateur.prototype.comparerMotDePasse = function (motDePasseSaisi) {
  return bcrypt.compare(motDePasseSaisi, this.motDePasse);
};

Faculte.hasMany(Utilisateur, { foreignKey: "faculteId" });
Utilisateur.belongsTo(Faculte, { foreignKey: "faculteId" });

module.exports = Utilisateur;
