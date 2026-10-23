/* Comptes de démonstration, un par espace, pour tester la plateforme (npm run db:amorcer).
   Mot de passe commun : demo1234. Les comptes déjà présents sont laissés tels quels.
   Refusé en production : ces comptes ont un mot de passe connu de tous. */
import { migrerDb, obtenirDb, fermerDb } from '../lib/serveur/db.mjs';
import { creerUtilisateur, ErreurDoublon } from '../lib/serveur/comptes.mjs';
import { COMPTES_DEMO, MOT_DE_PASSE_DEMO } from '../lib/comptesDemo.mjs';

if (process.env.NODE_ENV === 'production') {
  console.error('Comptes de démonstration refusés en production.');
  process.exit(1);
}

try {
  await migrerDb();
  const db = await obtenirDb();
  for (const compte of COMPTES_DEMO) {
    try {
      await creerUtilisateur(db, { ...compte, statut: 'actif', motDePasse: MOT_DE_PASSE_DEMO });
      console.log(`  créé    ${compte.profil.padEnd(12)} ${compte.email}`);
    } catch (erreur) {
      if (!(erreur instanceof ErreurDoublon)) throw erreur;
      console.log(`  présent ${compte.profil.padEnd(12)} ${compte.email}`);
    }
  }
  console.log(`\nMot de passe de tous les comptes : ${MOT_DE_PASSE_DEMO}`);
} catch (erreur) {
  console.error('Échec :', erreur);
  process.exitCode = 1;
} finally {
  await fermerDb();
}
