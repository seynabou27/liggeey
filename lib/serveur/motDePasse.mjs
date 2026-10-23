/* Mots de passe : empreinte scrypt (module crypto de Node, sans dépendance).
   Format stocké : scrypt$N$r$p$sel$empreinte (sel et empreinte en base64). */

import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';

const N = 16384;
const R = 8;
const P = 1;
const LONGUEUR = 64;

function deriver(motDePasse, sel, n, r, p) {
  return new Promise((resolve, reject) => {
    scrypt(motDePasse.normalize('NFKC'), sel, LONGUEUR, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (err, cle) => (err ? reject(err) : resolve(cle)));
  });
}

export async function chiffrerMotDePasse(motDePasse) {
  const sel = randomBytes(16);
  const cle = await deriver(motDePasse, sel, N, R, P);
  return `scrypt$${N}$${R}$${P}$${sel.toString('base64')}$${cle.toString('base64')}`;
}

export async function verifierMotDePasse(motDePasse, stocke) {
  const [algo, n, r, p, sel, empreinte] = String(stocke ?? '').split('$');
  if (algo !== 'scrypt' || !sel || !empreinte) return false;
  const attendu = Buffer.from(empreinte, 'base64');
  const cle = await deriver(motDePasse, Buffer.from(sel, 'base64'), Number(n), Number(r), Number(p));
  return cle.length === attendu.length && timingSafeEqual(cle, attendu);
}

/* Empreinte factice : quand l'identifiant n'existe pas, on vérifie quand même un mot de passe,
   pour que le temps de réponse ne révèle pas si le compte existe. */
let empreinteFactice;
export async function verifierSansCompte(motDePasse) {
  empreinteFactice ??= await chiffrerMotDePasse('liggeey-compte-inexistant-0');
  await verifierMotDePasse(motDePasse, empreinteFactice);
  return false;
}
