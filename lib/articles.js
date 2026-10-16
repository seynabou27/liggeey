import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

/**
 * Articles du blog « Ressources » : un fichier Markdown par article dans
 * content/ressources/. L'en-tête (entre les deux lignes ---) contient :
 * titre, resume, public (talents | independants | entreprises), date (AAAA-MM-JJ),
 * auteur, image (facultatif), brouillon (true pour ne pas publier).
 * Seul le serveur lit ces fichiers.
 */
const DOSSIER = path.join(process.cwd(), 'content', 'ressources');

function lireEnTete(source) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { donnees: {}, contenu: source };
  const donnees = {};
  for (const ligne of m[1].split(/\r?\n/)) {
    const i = ligne.indexOf(':');
    if (i === -1) continue;
    const cle = ligne.slice(0, i).trim();
    let valeur = ligne.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    if (valeur === 'true') valeur = true;
    else if (valeur === 'false') valeur = false;
    donnees[cle] = valeur;
  }
  return { donnees, contenu: m[2] };
}

export function tempsDeLecture(texte = '') {
  const mots = texte.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(mots / 200));
}

export function getArticles({ avecBrouillons = false } = {}) {
  if (!fs.existsSync(DOSSIER)) return [];
  return fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const { donnees, contenu } = lireEnTete(fs.readFileSync(path.join(DOSSIER, f), 'utf8'));
      return { slug: f.replace(/\.md$/, ''), ...donnees, contenu, minutes: tempsDeLecture(contenu) };
    })
    .filter((a) => avecBrouillons || !a.brouillon)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function getArticle(slug) {
  const article = getArticles().find((a) => a.slug === slug);
  return article ? { ...article, html: marked.parse(article.contenu) } : null;
}
