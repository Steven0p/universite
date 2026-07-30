const express = require("express");
const router = express.Router();
const { proteger, autoriser } = require("../middleware/auth");
const { listerActivites } = require("../controllers/activiteController");

router.get("/", proteger, autoriser("admin_general"), listerActivites);

module.exports = router;
