import { evenements } from '@/content/evenements';

export function getEvenements() {
  return [...evenements].sort((a, b) => a.date.localeCompare(b.date));
}

/** Prochain Job Dating à venir (ou null s’il n’y en a pas). */
export function getProchainEvenement(maintenant = new Date()) {
  const aujourdhui = maintenant.toISOString().slice(0, 10);
  return getEvenements().find((e) => e.date >= aujourdhui) ?? null;
}

export function getEvenement(slug) {
  return evenements.find((e) => e.slug === slug) ?? null;
}
