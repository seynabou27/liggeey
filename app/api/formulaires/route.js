import { NextResponse } from 'next/server';
import { estEmail, estTelephone } from '@/lib/validation';

/**
 * Réception de tous les formulaires du site (contact, démo, Job Dating, newsletter).
 *
 * Les demandes sont transmises en JSON à FORM_WEBHOOK_URL (Make, Zapier,
 * Google Apps Script, CRM…). Sans webhook, elles sont seulement écrites dans
 * les journaux du serveur : pratique en développement, à configurer avant la mise en ligne.
 */
const REQUIS = {
  contact: ['nom', 'telephone', 'motif', 'message', 'consentement'],
  demo: ['nom', 'entreprise', 'telephone', 'email', 'consentement'],
  jobdating: ['nom', 'telephone', 'evenement', 'consentement'],
  newsletter: ['email'],
};
const LONGUEUR_MAX = 2000;

const reponse = (corps, status = 200) => NextResponse.json(corps, { status });

export async function POST(requete) {
  let donnees;
  try {
    donnees = await requete.json();
  } catch {
    return reponse({ ok: false, erreur: 'Requête invalide.' }, 400);
  }

  const { type, site_web: potDeMiel, ...champs } = donnees ?? {};

  // Pot de miel rempli : c'est un robot. On répond « ok » sans rien transmettre.
  if (potDeMiel) return reponse({ ok: true });

  const requis = REQUIS[type];
  if (!requis) return reponse({ ok: false, erreur: 'Formulaire inconnu.' }, 400);

  // Nettoyage : chaînes coupées à 2 000 caractères, tableaux de chaînes conservés.
  const propres = {};
  for (const [cle, valeur] of Object.entries(champs)) {
    if (typeof valeur === 'string') propres[cle] = valeur.trim().slice(0, LONGUEUR_MAX);
    else if (typeof valeur === 'boolean') propres[cle] = valeur;
    else if (Array.isArray(valeur)) propres[cle] = valeur.filter((v) => typeof v === 'string').map((v) => v.slice(0, 200));
  }

  const manquants = requis.filter((c) => !propres[c]);
  if (manquants.length) return reponse({ ok: false, erreur: 'Champs manquants.', champs: manquants }, 422);
  if (propres.email && !estEmail(propres.email)) return reponse({ ok: false, erreur: 'E-mail invalide.', champs: ['email'] }, 422);
  if (propres.telephone && !estTelephone(propres.telephone)) return reponse({ ok: false, erreur: 'Téléphone invalide.', champs: ['telephone'] }, 422);

  const envoi = { type, ...propres, recuLe: new Date().toISOString() };
  const webhook = process.env.FORM_WEBHOOK_URL;

  if (!webhook) {
    console.info('[formulaires] Aucun FORM_WEBHOOK_URL configuré. Demande reçue :', envoi);
    return reponse({ ok: true });
  }

  try {
    const r = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(envoi) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return reponse({ ok: true });
  } catch (erreur) {
    console.error('[formulaires] Échec de transmission au webhook :', erreur);
    return reponse({ ok: false, erreur: 'Envoi impossible pour le moment.' }, 502);
  }
}
