const express = require("express");
const router = express.Router();
const { proteger, autoriser } = require("../middleware/auth");
const {
  listerUtilisateurs,
  creerUtilisateur,
  modifierUtilisateur,
  supprimerUtilisateur,
} = require("../controllers/utilisateurController");

router.use(proteger, autoriser("admin_general"));

router.get("/", listerUtilisateurs);
router.post("/", creerUtilisateur);
router.put("/:id", modifierUtilisateur);
router.delete("/:id", supprimerUtilisateur);

module.exports = router;
