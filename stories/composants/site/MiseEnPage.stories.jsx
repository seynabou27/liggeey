import { Section, Source, TitreSection } from '../../../components/ui/Section';
import { VagueAccueil, VagueDouce } from '../../../components/ui/Vague';
import EnTetePage from '../../../components/blocs/EnTetePage';
import { AppelFinal, BlocAide } from '../../../components/blocs/Blocs';
import Bouton from '../../../components/ui/Bouton';
import { talents } from '../../../content/fr/talents';
import { independants } from '../../../content/fr/independants';

const Contenu = () => <div className="h-24 rounded-lg border border-dashed border-forte" />;

export const SectionBlanche = {
  name: 'Section · fond blanc',
  render: (args) => (
    <Section {...args}>
      <TitreSection surtitre="Pour les talents" titre={talents.atouts.titre} texte={talents.constat.texte} />
      <Contenu />
    </Section>
  ),
  args: { fond: 'blanc', etroit: false },
  argTypes: { fond: { control: 'inline-radio', options: ['blanc', 'gris', 'clair', 'sombre'] } },
};

export const SectionGrise = { ...SectionBlanche, name: 'Section · fond gris', args: { fond: 'gris' } };
export const SectionClaire = { ...SectionBlanche, name: 'Section · fond orange doux', args: { fond: 'clair' } };
export const SectionEtroite = { ...SectionBlanche, name: 'Section · étroite', args: { fond: 'blanc', etroit: true } };

export const SectionSombre = {
  name: 'Section · fond sombre',
  render: () => (
    <Section fond="sombre">
      <TitreSection clair surtitre="Le constat" titre={talents.constat.titre} texte={talents.constat.texte} />
      <Source clair>{talents.constat.source}</Source>
    </Section>
  ),
};

export const TitreCentre = {
  name: 'TitreSection · centré',
  render: () => (
    <Section>
      <TitreSection centre titre={talents.etapes.titre} texte="Quatre étapes, depuis votre téléphone." />
    </Section>
  ),
};

export const SourceChiffre = {
  name: 'Source',
  render: () => (
    <div className="container py-6">
      <p className="text-5xl font-light text-marque-titre">78,5 %</p>
      <p className="mt-2">citent le manque de réseau</p>
      <Source>{talents.constat.source}</Source>
    </div>
  ),
};

export const VagueDeLAccueil = {
  name: 'Vague · accueil',
  render: () => (
    <div className="relative h-[420px] overflow-hidden bg-sombre">
      <VagueAccueil />
    </div>
  ),
};

export const VagueDesPages = {
  name: 'Vague · pages intérieures',
  render: () => (
    <div className="relative h-48 overflow-hidden bg-sombre">
      <VagueDouce />
    </div>
  ),
};

export const EnTeteAvecPhoto = {
  name: 'EnTetePage · avec photo',
  render: (args) => <EnTetePage {...args} />,
  args: { surtitre: talents.hero.surtitre, titre: talents.hero.titre, texte: talents.hero.texte, image: talents.hero.image },
};

export const EnTeteSansPhoto = {
  name: 'EnTetePage · sans photo',
  render: (args) => <EnTetePage {...args} />,
  args: { surtitre: 'Informations légales', titre: 'Mentions légales', texte: 'Dernière mise à jour : 15 octobre 2026.' },
  parameters: { sansPhotos: true },
};

export const EnTeteAvecBoutons = {
  name: 'EnTetePage · avec source et boutons',
  render: () => (
    <EnTetePage surtitre={independants.hero.surtitre} titre={independants.hero.titre} texte={independants.hero.texte} image={independants.hero.image} source="Source : enquête LIGGEEY auprès de 200 personnes (2026).">
      <Bouton href="/plateforme/inscription">Créer mon profil</Bouton>
      <Bouton href="/contact" variante="clair">
        Nous contacter
      </Bouton>
    </EnTetePage>
  ),
};

export const BandeAppelFinal = {
  name: 'AppelFinal',
  render: () => (
    <AppelFinal titre={talents.final.titre}>
      <Bouton href="/plateforme/inscription">Créer mon compte</Bouton>
      <Bouton href="/tarifs" variante="clair">
        Voir les tarifs
      </Bouton>
    </AppelFinal>
  ),
};

export const BlocAccompagnement = {
  name: 'BlocAide (bureau et WhatsApp)',
  render: (args) => <BlocAide {...args} />,
  args: {
    titre: 'Besoin d’un coup de main ?',
    texte: 'Notre équipe vous accompagne sur WhatsApp ou au bureau d’accueil de Dakar.',
  },
};

export default {
  title: 'Composants/Site/Mise en page',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Structure des pages : Section, TitreSection et Source (components/ui/Section.jsx), vagues (components/ui/Vague.jsx), EnTetePage, AppelFinal et BlocAide (components/blocs).',
      },
    },
  },
};
