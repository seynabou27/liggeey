/* Comptes : validation de l’inscription, création, recherche par identifiant.
   Les règles reprennent celles du formulaire d’inscription du prototype (FIELD_CONFIG) :
   le serveur les revérifie, sans faire confiance au navigateur. */

import { eq, or } from 'drizzle-orm';
import { utilisateurs, tuteurs } from './schema.mjs';
import { chiffrerMotDePasse } from './motDePasse.mjs';
import {
  PROFILS_INSCRIPTION,
  AGE_MIN_PAR_PROFIL,
  AGE_MAJORITE,
  AGE_MIN_CAP_METIER,
  LIENS_PARENT,
  ROLE_PAR_PROFIL,
  ageAu,
  motDePasseValide,
  normaliserEmail,
  normaliserTelephone,
  initiales,
} from '../comptes.mjs';

const MESSAGES = {
  requis: 'Ce champ est requis.',
  email: 'Veuillez saisir une adresse e-mail valide.',
  telephone: 'Indiquez un numéro sénégalais valide, par exemple +221 77 000 00 00.',
  naissance: 'Veuillez saisir une date de naissance valide.',
  motDePasse: '8 caractères minimum avec au moins un chiffre.',
  cgu: "Merci d’accepter les conditions pour continuer.",
  parentInforme: "Parlez-en d’abord à votre parent ou tuteur, puis cochez cette case.",
};

/* Champs propres à chaque profil (gardés dans utilisateurs.details). */
const DETAILS_PAR_PROFIL = {
  chercheur: [],
  prestataire: ['competences', 'ville'],
  entreprise: ['entreprise', 'secteur'],
  jeune: ['ville'],
  mentor: ['metier', 'experience'],
};

const LONGUEUR_MAX = 200;
const texte = (v) => (typeof v === 'string' ? v.trim().slice(0, LONGUEUR_MAX) : '');
const estEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

/**
 * Vérifie une demande d’inscription.
 * @returns {{ erreurs: Record<string,string>, erreur?: string, donnees?: object }}
 */
export function verifierInscription(entree, aujourdHui = new Date()) {
  const e = entree ?? {};
  const profil = e.profil;
  if (!PROFILS_INSCRIPTION.includes(profil)) return { erreurs: {}, erreur: 'Profil inconnu.' };

  const erreurs = {};
  const requis = (champ, valeur) => {
    if (!valeur) erreurs[champ] = MESSAGES.requis;
    return valeur;
  };

  // Nom : « responsable » pour une entreprise, « nom » pour les autres profils.
  const champNom = profil === 'entreprise' ? 'responsable' : 'nom';
  const nom = requis(champNom, texte(e[champNom]));

  const email = normaliserEmail(e.email);
  if (!email) {
    if (profil !== 'jeune') erreurs.email = MESSAGES.requis;
  } else if (!estEmail(email) || email.length > LONGUEUR_MAX) erreurs.email = MESSAGES.email;

  const telephone = normaliserTelephone(e.telephone);
  if (!texte(e.telephone)) erreurs.telephone = MESSAGES.requis;
  else if (!telephone) erreurs.telephone = MESSAGES.telephone;

  let dateNaissance = null;
  let mineur = false;
  if (profil in AGE_MIN_PAR_PROFIL) {
    dateNaissance = texte(e.naissance);
    const age = ageAu(dateNaissance, aujourdHui);
    if (!dateNaissance) erreurs.naissance = MESSAGES.requis;
    else if (age === null) erreurs.naissance = MESSAGES.naissance;
    else if (age < AGE_MIN_PAR_PROFIL[profil]) {
      erreurs.naissance =
        age < AGE_MIN_CAP_METIER
          ? 'LIGGEEY accueille les jeunes à partir de 15 ans.'
          : `Cet espace est réservé aux personnes de ${AGE_MIN_PAR_PROFIL[profil]} ans et plus.`;
    }
    mineur = profil === 'jeune' && age !== null && age >= AGE_MIN_CAP_METIER && age < AGE_MAJORITE;
  }

  const details = {};
  for (const champ of DETAILS_PAR_PROFIL[profil]) {
    if (champ === 'experience') {
      const n = Number(e.experience);
      if (e.experience === '' || e.experience === undefined || e.experience === null) erreurs.experience = MESSAGES.requis;
      else if (!Number.isInteger(n) || n < 0 || n > 70) erreurs.experience = "Indiquez un nombre d’années valide.";
      else details.experience = n;
    } else {
      details[champ] = requis(champ, texte(e[champ]));
    }
  }

  let tuteur = null;
  if (mineur) {
    const parentNom = requis('parentNom', texte(e.parentNom));
    const parentTelephone = normaliserTelephone(e.parentTelephone);
    if (!texte(e.parentTelephone)) erreurs.parentTelephone = MESSAGES.requis;
    else if (!parentTelephone) erreurs.parentTelephone = MESSAGES.telephone;
    else if (parentTelephone === telephone) erreurs.parentTelephone = 'Indiquez le numéro de votre parent ou tuteur, pas le vôtre.';
    if (!LIENS_PARENT.includes(e.parentLien)) erreurs.parentLien = MESSAGES.requis;
    if (e.parentInforme !== true) erreurs.parentInforme = MESSAGES.parentInforme;
    tuteur = { nom: parentNom, telephone: parentTelephone, lien: e.parentLien };
  }

  if (!motDePasseValide(e.motDePasse)) erreurs.motDePasse = MESSAGES.motDePasse;
  if (e.cgu !== true) erreurs.cgu = MESSAGES.cgu;

  if (Object.keys(erreurs).length > 0) return { erreurs };
  return {
    erreurs,
    donnees: {
      profil,
      // Mentor : candidature examinée par l’équipe (identité, expérience, références, charte).
      statut: profil === 'mentor' ? 'a_valider' : 'actif',
      nom,
      email: email || null,
      telephone,
      dateNaissance,
      details,
      motDePasse: e.motDePasse,
      tuteur,
    },
  };
}

/** Erreur levée quand l’e-mail ou le téléphone est déjà utilisé. */
export class ErreurDoublon extends Error {
  constructor(champ) {
    super(champ === 'email' ? 'Cette adresse e-mail est déjà utilisée.' : 'Ce numéro de téléphone est déjà utilisé.');
    this.champ = champ;
  }
}

/** Crée le compte (et le parent ou tuteur d’un mineur). Renvoie la ligne utilisateur. */
export async function creerUtilisateur(db, donnees) {
  const { motDePasse, tuteur, ...champs } = donnees;
  const existants = await db
    .select({ email: utilisateurs.email, telephone: utilisateurs.telephone })
    .from(utilisateurs)
    .where(champs.email ? or(eq(utilisateurs.email, champs.email), eq(utilisateurs.telephone, champs.telephone)) : eq(utilisateurs.telephone, champs.telephone));
  if (existants.some((u) => champs.email && u.email === champs.email)) throw new ErreurDoublon('email');
  if (existants.length > 0) throw new ErreurDoublon('telephone');

  const motDePasseHash = await chiffrerMotDePasse(motDePasse);
  try {
    return await db.transaction(async (tx) => {
      const [utilisateur] = await tx
        .insert(utilisateurs)
        .values({ ...champs, motDePasseHash, cguAccepteesLe: new Date() })
        .returning();
      if (tuteur) await tx.insert(tuteurs).values({ ...tuteur, utilisateurId: utilisateur.id });
      return utilisateur;
    });
  } catch (erreur) {
    // Deux inscriptions simultanées avec les mêmes coordonnées : l’index unique tranche.
    const contrainte = erreur?.constraint ?? erreur?.cause?.constraint ?? '';
    if (contrainte.includes('email')) throw new ErreurDoublon('email');
    if (contrainte.includes('telephone')) throw new ErreurDoublon('telephone');
    throw erreur;
  }
}

/** Recherche par e-mail ou par téléphone (format libre). */
export async function trouverParIdentifiant(db, identifiant) {
  const brut = String(identifiant ?? '').trim();
  if (!brut) return null;
  const condition = brut.includes('@') ? eq(utilisateurs.email, normaliserEmail(brut)) : eq(utilisateurs.telephone, normaliserTelephone(brut) ?? '');
  const [utilisateur] = await db.select().from(utilisateurs).where(condition).limit(1);
  return utilisateur ?? null;
}

/** Ce que le navigateur peut voir du compte (jamais l’empreinte du mot de passe). */
export function comptePublic(u) {
  if (!u) return null;
  return {
    id: u.id,
    profil: u.profil,
    statut: u.statut,
    nom: u.nom,
    initiales: initiales(u.nom),
    role: u.profil === 'entreprise' && u.details?.entreprise ? u.details.entreprise : ROLE_PAR_PROFIL[u.profil],
    email: u.email,
    telephone: u.telephone,
  };
}
