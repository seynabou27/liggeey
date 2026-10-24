/**
 * Job Dating (un par trimestre).
 * ⚠️ Événement de décembre 2026 : date, lieu et programme PROVISOIRES.
 * Les entreprises participantes ne sont listées que si elles l’ont confirmé.
 */
export const evenements = [
  {
    slug: 'job-dating-decembre-2026',
    titre: 'Job Dating LIGGEEY\u00a0· Décembre 2026', // espace insécable : le point médian ne commence jamais une ligne
    date: '2026-12-12',
    debut: '09:00',
    fin: '14:00',
    lieu: 'Dakar Plateau',
    precisionLieu: "Salle communiquée à l’inscription",
    prix: 5000,
    public: 'Talents et indépendants',
    programme: [
      { heure: '09:00', titre: 'Accueil des participants' },
      { heure: '09:30', titre: 'Présentation des entreprises' },
      { heure: '10:00', titre: 'Entretiens en face à face' },
      { heure: '13:00', titre: 'Atelier CV' },
    ],
    entreprises: [],
  },
];
