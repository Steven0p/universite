const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Faculte = sequelize.define("Faculte", {
  nom: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: "" },
  doyen: { type: DataTypes.STRING, defaultValue: "" },
  image: { type: DataTypes.STRING, defaultValue: "" },
});

module.exports = Faculte;
