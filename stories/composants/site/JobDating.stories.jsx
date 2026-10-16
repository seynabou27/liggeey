import CarteEvenement from '../../../components/jobdating/CarteEvenement';
import { evenements } from '../../../content/evenements';

export default {
  title: 'Composants/Site/Job Dating/CarteEvenement',
  component: CarteEvenement,
  args: { evenement: evenements[0], lienDetails: false },
  parameters: {
    docs: { description: { component: 'Carte d’un Job Dating : date, horaires, lieu, prix, inscription et partage WhatsApp. Données : content/evenements.js.' } },
  },
};

export const Simple = {};

export const AvecLienProgramme = { name: 'Avec le lien « Voir le programme »', args: { lienDetails: true } };
