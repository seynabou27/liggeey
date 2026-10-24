import fs from 'node:fs';
import path from 'node:path';

/**
 * Indique si une image existe dans /public.
 * Les photos ne sont pas encore fournies : on n’affiche une image que si le
 * fichier est présent, sinon le fond ardoise prend le relais (pas d’image cassée).
 * À n’utiliser que dans des composants serveur.
 */
export function imageExiste(src) {
  if (!src || /^https?:/.test(src)) return Boolean(src);
  return fs.existsSync(path.join(process.cwd(), 'public', src));
}
