const express = require("express");
const router = express.Router();
const { proteger, autoriser } = require("../middleware/auth");
const {
  listerCours,
  obtenirCours,
  creerCours,
  modifierCours,
  supprimerCours,
} = require("../controllers/coursController");

router.get("/", listerCours);
router.get("/:id", obtenirCours);

router.post("/", proteger, autoriser("admin_general", "responsable_faculte"), creerCours);
router.put("/:id", proteger, autoriser("admin_general", "responsable_faculte"), modifierCours);
router.delete("/:id", proteger, autoriser("admin_general", "responsable_faculte"), supprimerCours);

module.exports = router;
