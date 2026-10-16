import { ArrowRight, MessageCircle } from 'lucide-react';
import { fn } from 'storybook/test';
import Bouton from '../../../components/ui/Bouton';

export default {
  title: 'Composants/Site/Actions/Bouton',
  component: Bouton,
  args: { children: 'Créer mon profil', variante: 'principal', petit: false, pleineLargeur: false, onClick: fn() },
  argTypes: {
    variante: { control: 'inline-radio', options: ['principal', 'secondaire', 'clair', 'sombre', 'whatsapp'] },
    href: { control: 'text', description: 'Sans href : <button>. Lien http, mailto ou tel : <a>. Lien interne : <Link>.' },
  },
  parameters: {
    docs: { description: { component: 'Bouton ou lien en forme de bouton, 44 px de haut au minimum. `components/ui/Bouton.jsx`' } },
  },
};

export const Principal = {};

export const Secondaire = { args: { variante: 'secondaire', children: 'En savoir plus' } };

export const Clair = {
  args: { variante: 'clair', children: 'Découvrir les offres' },
  decorators: [(Story) => <div className="rounded-lg bg-sombre p-6"><Story /></div>],
};

export const Sombre = { args: { variante: 'sombre', children: 'Demander une démo' } };

export const WhatsApp = {
  args: {
    variante: 'whatsapp',
    children: (
      <>
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
        Écrire sur WhatsApp
      </>
    ),
  },
};

export const Petit = { args: { petit: true, children: 'Je m’inscris' } };

export const PleineLargeur = {
  args: { pleineLargeur: true, children: 'Se connecter' },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
};

export const AvecIcone = {
  args: {
    children: (
      <>
        Voir les offres
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </>
    ),
  },
};

export const Desactive = { name: 'Désactivé', args: { disabled: true, children: 'Envoi…' } };

export const LienInterne = { args: { href: '/tarifs', children: 'Voir les tarifs' } };

export const LienExterne = { args: { href: 'https://wa.me/221770000000', nouvelOnglet: true, variante: 'whatsapp', children: 'Ouvrir WhatsApp' } };

export const Toutes = {
  name: 'Toutes les variantes',
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Bouton>Principal</Bouton>
        <Bouton variante="secondaire">Secondaire</Bouton>
        <Bouton variante="sombre">Sombre</Bouton>
        <Bouton variante="whatsapp">WhatsApp</Bouton>
        <Bouton disabled>Désactivé</Bouton>
        <Bouton petit>Petit</Bouton>
      </div>
      <div className="flex flex-wrap gap-3 rounded-lg bg-sombre p-6">
        <Bouton>Principal</Bouton>
        <Bouton variante="clair">Clair</Bouton>
      </div>
    </div>
  ),
};
