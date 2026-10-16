const FUSEAU = 'Africa/Dakar';

/** 1500 → « 1 500 FCFA » */
export function fcfa(montant) {
  return `${new Intl.NumberFormat('fr-FR').format(montant)} FCFA`;
}

/** « samedi 12 décembre 2026 » */
export function dateLongue(iso) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: FUSEAU,
  }).format(new Date(`${iso}T12:00:00Z`));
}

/** Pastille de calendrier : { jour: '12', mois: 'DÉC.' } */
export function datePastille(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  const jour = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', timeZone: FUSEAU }).format(d);
  const mois = new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: FUSEAU }).format(d);
  return { jour, mois: mois.toUpperCase() };
}

/** « 09:00 » → « 9 h », « 13:30 » → « 13 h 30 » */
export function heure(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h} h ${String(m).padStart(2, '0')}` : `${h} h`;
}
