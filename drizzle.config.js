/* Drizzle Kit : génère les migrations SQL (drizzle/) à partir de lib/serveur/schema.mjs.
   npm run db:generer après chaque modification du schéma ; npm run db:migrer pour les appliquer. */
export default {
  dialect: 'postgresql',
  schema: './lib/serveur/schema.mjs',
  out: './drizzle',
};
