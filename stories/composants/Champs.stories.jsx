import { ChampTexte } from '../../components/formulaires/Champs';

export default {
  title: 'Composants/Champs',
  component: ChampTexte,
  args: { nom: 'email', label: 'Adresse e-mail', placeholder: 'vous@exemple.sn', requis: true },
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
};

export const Texte = {};

export const AvecErreur = { args: { erreur: 'Indiquez une adresse e-mail valide.', defaultValue: 'abdou@' } };
