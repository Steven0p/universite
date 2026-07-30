// Crée (ou met à jour) le compte administrateur général.
// Modifiez EMAIL et MOT_DE_PASSE ci-dessous, puis lancez : node seed.js
require('dotenv').config();
const sequelize = require('./config/db');
const Utilisateur = require('./models/Utilisateur');

const EMAIL = 'admin@universite.test';
const MOT_DE_PASSE = 'Passw0rd!';
const NOM = 'Admin Général';

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const [admin, cree] = await Utilisateur.findOrCreate({
    where: { email: EMAIL },
    defaults: { nom: NOM, motDePasse: MOT_DE_PASSE, role: 'admin_general' },
  });

  if (!cree) {
    admin.nom = NOM;
    admin.motDePasse = MOT_DE_PASSE;
    await admin.save();
  }

  console.log(cree ? 'Administrateur créé :' : 'Administrateur mis à jour :', EMAIL);
  process.exit(0);
})();
