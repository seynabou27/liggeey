/* Connexion à la base de données.
   - DATABASE_URL renseignée : PostgreSQL (Neon, Supabase, serveur dédié…), via node-postgres.
   - DATABASE_URL vide : PGlite, un PostgreSQL intégré, sans rien installer. Les données sont dans
     .donnees/pglite (ignoré par Git). Pratique en développement, à ne pas utiliser en production.
   Fichier .mjs : partagé par les routes de l'API et les scripts Node (scripts/). */

import path from 'node:path';
import * as schema from './schema.mjs';

const DOSSIER_MIGRATIONS = path.join(process.cwd(), 'drizzle');
const DOSSIER_PGLITE = path.join(process.cwd(), '.donnees', 'pglite');

/* Une seule connexion par processus, gardée sur globalThis pour survivre aux rechargements de `next dev`. */
const cache = globalThis;

async function ouvrir() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { default: pg } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const pool = new pg.Pool({ connectionString: url, max: Number(process.env.DATABASE_POOL_MAX || 5) });
    return { db: drizzle(pool, { schema }), fermer: () => pool.end(), type: 'postgres' };
  }

  if (process.env.NODE_ENV === 'production' && !process.env.AUTORISER_PGLITE) {
    throw new Error('DATABASE_URL manquante : la base intégrée (PGlite) est réservée au développement.');
  }
  const { mkdir } = await import('node:fs/promises');
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');
  await mkdir(DOSSIER_PGLITE, { recursive: true });
  const client = new PGlite(DOSSIER_PGLITE);
  const db = drizzle(client, { schema });
  // Base locale : les migrations s'appliquent toutes seules au démarrage.
  await migrate(db, { migrationsFolder: DOSSIER_MIGRATIONS });
  return { db, fermer: () => client.close(), type: 'pglite' };
}

/** Connexion partagée (créée au premier appel). */
export async function obtenirDb() {
  if (!cache.__liggeeyDb) {
    cache.__liggeeyDb = ouvrir().catch((erreur) => {
      cache.__liggeeyDb = null; // nouvel essai au prochain appel
      throw erreur;
    });
  }
  return (await cache.__liggeeyDb).db;
}

/** Ferme la connexion (scripts). */
export async function fermerDb() {
  if (!cache.__liggeeyDb) return;
  const { fermer } = await cache.__liggeeyDb;
  cache.__liggeeyDb = null;
  await fermer();
}

/** Applique les migrations de drizzle/ (npm run db:migrer, à lancer à chaque mise en ligne). */
export async function migrerDb() {
  const connexion = await (cache.__liggeeyDb ??= ouvrir());
  if (connexion.type === 'postgres') {
    const { migrate } = await import('drizzle-orm/node-postgres/migrator');
    await migrate(connexion.db, { migrationsFolder: DOSSIER_MIGRATIONS });
  }
  return connexion.type;
}

export { schema };
