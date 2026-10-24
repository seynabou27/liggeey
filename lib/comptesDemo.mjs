/* Comptes de démonstration (un par espace), créés par npm run db:amorcer.
   Les noms reprennent les profils de démo du prototype (USER_BY_ESPACE).
   L’écran de connexion propose ces comptes quand NEXT_PUBLIC_COMPTES_DEMO=true. */

export const MOT_DE_PASSE_DEMO = 'demo1234';

export const COMPTES_DEMO = [
  { profil: 'chercheur', nom: 'Absatou Diallo', email: 'demo-chercheur@liggeey.sn', telephone: '+221330000001', dateNaissance: '1999-03-12', details: {} },
  { profil: 'prestataire', nom: 'Mamadou Ndiaye', email: 'demo-prestataire@liggeey.sn', telephone: '+221330000002', dateNaissance: '1990-07-04', details: { competences: 'Électricité', ville: 'Dakar' } },
  { profil: 'entreprise', nom: 'Awa Diallo', email: 'demo-entreprise@liggeey.sn', telephone: '+221330000003', dateNaissance: null, details: { entreprise: 'Senegal Construction SARL', secteur: 'BTP et construction' } },
  { profil: 'jeune', nom: 'Mame Diarra Sène', email: 'demo-capmetier@liggeey.sn', telephone: '+221330000004', dateNaissance: '2010-05-20', details: { ville: 'Pikine' }, tuteur: { nom: 'Ndèye Sène', telephone: '+221330000014', lien: 'Mère' } },
  { profil: 'mentor', nom: 'Cheikh Fall', email: 'demo-mentor@liggeey.sn', telephone: '+221330000005', dateNaissance: '1980-11-02', details: { metier: 'Responsable RH', experience: 15 } },
  { profil: 'admin', nom: 'Admin LIGGEEY', email: 'demo-admin@liggeey.sn', telephone: '+221330000006', dateNaissance: null, details: {} },
];
