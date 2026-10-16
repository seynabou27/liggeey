import { Ecran, parametresEcran } from './_ecran';

export default {
  title: 'Écrans/Plateforme complète',
  parameters: {
    ...parametresEcran,
    docs: { ...parametresEcran.docs, description: { component: 'Le prototype entier, comme sur /plateforme. Choisissez un espace, puis naviguez librement. Les données de démo repartent de zéro à chaque ouverture.' } },
  },
  argTypes: { espace: { control: 'inline-radio', options: ['chercheur', 'prestataire', 'entreprise', 'admin'] } },
  args: { espace: 'chercheur' },
  render: ({ espace }) => <Ecran ecran="dashboard" espace={espace} />,
};

export const Navigation = { name: 'Naviguer dans la plateforme' };
