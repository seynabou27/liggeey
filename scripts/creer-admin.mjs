/* Crée un compte admin (les admins ne passent pas par l'inscription).
   ADMIN_NOM="Prénom Nom" ADMIN_EMAIL=… ADMIN_TELEPHONE=… ADMIN_MOT_DE_PASSE=… npm run db:admin
   Les variables peuvent aussi être posées dans .env.local, puis retirées après usage. */
import { migrerDb, obtenirDb, fermerDb } from '../lib/serveur/db.mjs';
import { creerUtilisateur, ErreurDoublon } from '../lib/serveur/comptes.mjs';
import { motDePasseValide, normaliserEmail, normaliserTelephone } from '../lib/comptes.mjs';

const { ADMIN_NOM, ADMIN_EMAIL, ADMIN_TELEPHONE, ADMIN_MOT_DE_PASSE } = process.env;
const telephone = normaliserTelephone(ADMIN_TELEPHONE);

if (!ADMIN_NOM || !ADMIN_EMAIL || !telephone || !motDePasseValide(ADMIN_MOT_DE_PASSE) || ADMIN_MOT_DE_PASSE.length < 12) {
  console.error('Renseignez ADMIN_NOM, ADMIN_EMAIL, ADMIN_TELEPHONE (numéro sénégalais) et ADMIN_MOT_DE_PASSE (12 caractères minimum, dont un chiffre).');
  process.exit(1);
}

try {
  await migrerDb();
  const db = await obtenirDb();
  await creerUtilisateur(db, {
    profil: 'admin',
    statut: 'actif',
    nom: ADMIN_NOM.trim(),
    email: normaliserEmail(ADMIN_EMAIL),
    telephone,
    dateNaissance: null,
    details: {},
    motDePasse: ADMIN_MOT_DE_PASSE,
    tuteur: null,
  });
  console.log(`Compte admin créé pour ${normaliserEmail(ADMIN_EMAIL)}.`);
} catch (erreur) {
  console.error(erreur instanceof ErreurDoublon ? erreur.message : erreur);
  process.exitCode = 1;
} finally {
  await fermerDb();
}
