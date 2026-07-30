const express = require("express");
const router = express.Router();
const { proteger, autoriser } = require("../middleware/auth");
const {
  listerFacultes,
  obtenirFaculte,
  creerFaculte,
  modifierFaculte,
  supprimerFaculte,
  listerCoursDeFaculte,
} = require("../controllers/faculteController");

router.get("/", listerFacultes);
router.get("/:id", obtenirFaculte);
router.get("/:id/cours", listerCoursDeFaculte);

router.post("/", proteger, autoriser("admin_general"), creerFaculte);
router.put("/:id", proteger, autoriser("admin_general"), modifierFaculte);
router.delete("/:id", proteger, autoriser("admin_general"), supprimerFaculte);

module.exports = router;
