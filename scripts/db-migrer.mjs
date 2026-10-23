/* Applique les migrations de drizzle/ à la base (DATABASE_URL, ou PGlite en local).
   npm run db:migrer : à lancer à chaque mise en ligne, avant de démarrer le site. */
import { migrerDb, fermerDb } from '../lib/serveur/db.mjs';

try {
  const type = await migrerDb();
  console.log(`Migrations appliquées (${type === 'pglite' ? 'base locale .donnees/pglite' : 'DATABASE_URL'}).`);
} catch (erreur) {
  console.error('Échec des migrations :', erreur);
  process.exitCode = 1;
} finally {
  await fermerDb();
}
