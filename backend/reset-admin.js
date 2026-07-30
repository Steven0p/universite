// Réinitialise l'e-mail et le mot de passe de l'administrateur général.
// Usage : node reset-admin.js <email> <motDePasse> ["Nom complet"]
require('dotenv').config();
const sequelize = require('./config/db');
const Utilisateur = require('./models/Utilisateur');

const [, , email, motDePasse, nom] = process.argv;

if (!email || !motDePasse) {
  console.error('Usage : node reset-admin.js <email> <motDePasse> ["Nom complet"]');
  process.exit(1);
}
if (motDePasse.length < 8) {
  console.error('Le mot de passe doit contenir au moins 8 caractères.');
  process.exit(1);
}

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  const admin = await Utilisateur.findOne({ where: { role: 'admin_general' } });

  if (admin) {
    admin.email = email;
    admin.motDePasse = motDePasse;
    if (nom) admin.nom = nom;
    await admin.save();
    console.log('Administrateur général mis à jour :', email);
  } else {
    await Utilisateur.create({
      email,
      motDePasse,
      nom: nom || 'Administrateur',
      role: 'admin_general',
    });
    console.log('Administrateur général créé :', email);
  }

  process.exit(0);
})();
