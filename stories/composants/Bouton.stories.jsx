import Bouton from '../../components/ui/Bouton';

export default {
  title: 'Composants/Bouton',
  component: Bouton,
  args: { children: 'Créer mon profil', variante: 'principal', petit: false, pleineLargeur: false },
  argTypes: {
    variante: { control: 'inline-radio', options: ['principal', 'secondaire', 'clair', 'sombre', 'whatsapp'] },
  },
};

export const Principal = {};

export const Secondaire = { args: { variante: 'secondaire', children: 'En savoir plus' } };

export const Clair = {
  args: { variante: 'clair', children: 'Découvrir les offres' },
  decorators: [(Story) => <div className="rounded-lg bg-sombre p-6"><Story /></div>],
};

export const Sombre = { args: { variante: 'sombre', children: 'Demander une démo' } };

export const WhatsApp = { args: { variante: 'whatsapp', children: 'Écrire sur WhatsApp' } };

export const Toutes = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Bouton>Principal</Bouton>
        <Bouton variante="secondaire">Secondaire</Bouton>
        <Bouton variante="sombre">Sombre</Bouton>
        <Bouton variante="whatsapp">WhatsApp</Bouton>
        <Bouton disabled>Désactivé</Bouton>
      </div>
      <div className="flex flex-wrap gap-3 rounded-lg bg-sombre p-6">
        <Bouton>Principal</Bouton>
        <Bouton variante="clair">Clair</Bouton>
      </div>
    </div>
  ),
};
