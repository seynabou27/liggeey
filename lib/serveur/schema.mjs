/* Schéma de la base de données (PostgreSQL, Drizzle ORM).
   Après une modification : npm run db:generer (crée la migration SQL dans drizzle/), puis npm run db:migrer.

   Socle : comptes, parents ou tuteurs (Cap Métier), sessions, tentatives de connexion.
   Les autres données (offres, candidatures, messagerie, paiements…) viendront par étapes. */

import { pgTable, pgEnum, uuid, text, date, jsonb, timestamp, boolean, serial, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const profilEnum = pgEnum('profil', ['chercheur', 'prestataire', 'entreprise', 'jeune', 'mentor', 'admin']);

/** actif : accès normal ; a_valider : candidature mentor en cours d'examen ; suspendu : accès bloqué par l'admin. */
export const statutCompteEnum = pgEnum('statut_compte', ['actif', 'a_valider', 'suspendu']);

export const accordParentalEnum = pgEnum('accord_parental', ['en_attente', 'accorde', 'refuse']);

export const utilisateurs = pgTable(
  'utilisateurs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    profil: profilEnum('profil').notNull(),
    statut: statutCompteEnum('statut').notNull().default('actif'),
    /** Nom complet ; pour une entreprise, le responsable des recrutements. */
    nom: text('nom').notNull(),
    /** En minuscules. Facultatif pour Cap Métier. */
    email: text('email'),
    /** Format international : +221XXXXXXXXX. */
    telephone: text('telephone').notNull(),
    motDePasseHash: text('mot_de_passe_hash').notNull(),
    dateNaissance: date('date_naissance'),
    /** Champs propres au profil : entreprise, secteur, competences, ville, metier, experience. */
    details: jsonb('details').notNull().default({}),
    cguAccepteesLe: timestamp('cgu_acceptees_le', { withTimezone: true }),
    derniereConnexionLe: timestamp('derniere_connexion_le', { withTimezone: true }),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
    misAJourLe: timestamp('mis_a_jour_le', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('utilisateurs_email_unique').on(t.email), uniqueIndex('utilisateurs_telephone_unique').on(t.telephone)],
);

/** Parent ou tuteur d'un jeune de 15 à 17 ans (Cap Métier). Le mentor n'est attribué qu'après l'accord. */
export const tuteurs = pgTable('tuteurs', {
  id: uuid('id').primaryKey().defaultRandom(),
  utilisateurId: uuid('utilisateur_id')
    .notNull()
    .unique()
    .references(() => utilisateurs.id, { onDelete: 'cascade' }),
  nom: text('nom').notNull(),
  telephone: text('telephone').notNull(),
  lien: text('lien').notNull(),
  accord: accordParentalEnum('accord').notNull().default('en_attente'),
  accordLe: timestamp('accord_le', { withTimezone: true }),
  creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
});

/** Sessions ouvertes. L'identifiant est l'empreinte SHA-256 du jeton : le jeton lui-même n'est que dans le cookie. */
export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    utilisateurId: uuid('utilisateur_id')
      .notNull()
      .references(() => utilisateurs.id, { onDelete: 'cascade' }),
    expireLe: timestamp('expire_le', { withTimezone: true }).notNull(),
    agentUtilisateur: text('agent_utilisateur'),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('sessions_utilisateur_idx').on(t.utilisateurId)],
);

/** Journal des connexions, pour limiter les essais de mots de passe. */
export const tentativesConnexion = pgTable(
  'tentatives_connexion',
  {
    id: serial('id').primaryKey(),
    identifiant: text('identifiant').notNull(),
    ip: text('ip'),
    reussie: boolean('reussie').notNull(),
    creeLe: timestamp('cree_le', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('tentatives_identifiant_idx').on(t.identifiant, t.creeLe), index('tentatives_ip_idx').on(t.ip, t.creeLe)],
);
