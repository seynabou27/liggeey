import { Briefcase } from 'lucide-react';
import { BarreProgression, ListeClassee, Anneau, PastilleIcone, Carte } from '../../../../components/app';

export default {
  title: 'Composants/Application/Bibliothèque/Progression',
  component: BarreProgression,
  parameters: { docs: { description: { component: 'Barres, listes classées et anneaux. `components/app/Progression.jsx`' } } },
};

export const Barres = {
  name: 'BarreProgression',
  render: () => (
    <div className="max-w-md space-y-4">
      <BarreProgression valeur={75} label="Profil" />
      <BarreProgression valeur={40} ton="succes" hauteur="epaisse" label="Formation" />
      <BarreProgression valeur={15} ton="danger" label="Quota" />
    </div>
  ),
};

export const Liste = {
  name: 'ListeClassee',
  render: () => (
    <Carte titre="Mes offres actives" sousTitre="Candidatures reçues par offre" className="max-w-lg">
      <ListeClassee
        elements={[
          { id: 1, libelle: "Chef d'équipe électricité", pourcentage: 100, valeur: '12', visuel: <PastilleIcone icone={Briefcase} taille="sm" /> },
          { id: 2, libelle: 'Technicienne plomberie', pourcentage: 67, valeur: '8', visuel: <PastilleIcone icone={Briefcase} taille="sm" /> },
          { id: 3, libelle: 'Soudeur TIG/MIG', pourcentage: 25, valeur: '3', visuel: <PastilleIcone icone={Briefcase} taille="sm" /> },
        ]}
      />
    </Carte>
  ),
};

export const Anneaux = {
  name: 'Anneau',
  render: () => (
    <div className="flex gap-6">
      <Anneau valeur={70} />
      <Anneau valeur={100} taille={88} epaisseur={9} />
      <Anneau valeur={20} taille={56} epaisseur={6}>J+18</Anneau>
    </div>
  ),
};
