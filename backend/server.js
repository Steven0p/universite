require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

require("./models/Faculte");
require("./models/Cours");
require("./models/Utilisateur");

const authRoutes = require("./routes/authRoutes");
const faculteRoutes = require("./routes/faculteRoutes");
const coursRoutes = require("./routes/coursRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/facultes", faculteRoutes);
app.use("/api/cours", coursRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    console.log("Base de données MySQL connectée et synchronisée");
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error("Échec de connexion à la base de données :", err.message);
    process.exit(1);
  });
