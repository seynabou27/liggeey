import PageLegale from '../../../components/legal/PageLegale';

export default {
  title: 'Composants/Site/Gabarits/PageLegale',
  component: PageLegale,
  args: { cle: 'mentions-legales' },
  argTypes: { cle: { control: 'inline-radio', options: ['mentions-legales', 'cgu', 'confidentialite'] } },
  parameters: {
    layout: 'fullscreen',
    sansPhotos: true,
    docs: { description: { component: 'Gabarit des pages légales (components/legal). Textes : content/fr/legal.js.' } },
  },
};

export const MentionsLegales = { name: 'Mentions légales', parameters: { nextjs: { navigation: { pathname: '/mentions-legales' } } } };

export const CGU = { args: { cle: 'cgu' } };

export const Confidentialite = { name: 'Confidentialité', args: { cle: 'confidentialite' } };
