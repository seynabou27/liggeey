/**
 * Remplace lib/images.js dans Storybook (le vrai module lit le disque avec node:fs).
 * Par défaut, toutes les images de /public sont considérées comme présentes.
 * Une story peut simuler l'absence de photo avec `parameters: { sansPhotos: true }` (voir preview.jsx).
 */
export function imageExiste(src) {
  if (typeof window !== 'undefined' && window.__LIGGEEY_SANS_PHOTOS__) return false;
  return Boolean(src);
}
