import { Suspense } from 'react';
import { accueil } from '@/content/fr/accueil';
import { getOffresVitrine } from '@/lib/offres';
import { getProchainEvenement } from '@/lib/evenements';
import { imageExiste } from '@/lib/images';
import { lienConnexion } from '@/lib/liens';
import { Section, TitreSection } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import BandeauAccueil from '@/components/accueil/BandeauAccueil';
import VitrineOffres from '@/components/accueil/VitrineOffres';
import { GrilleOffres } from '@/components/accueil/CarteOffre';
import CommentCaMarche from '@/components/accueil/CommentCaMarche';
import BandeVideo from '@/components/accueil/BandeVideo';
import { AVenir, BandeConstat, BandeParcours, Engagements, GrilleSecteurs } from '@/components/accueil/Sections';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

// Offres et prochain Job Dating rafraîchis toutes les heures.
export const revalidate = 3600;

export const metadata = {
  title: { absolute: accueil.meta.titre },
  description: accueil.meta.description,
};

/** Accueil : enchaînement du modèle validé (étape 4, wireframes 2a et 2b). */
export default async function Accueil() {
  const offres = await getOffresVitrine();
  const evenement = getProchainEvenement();
  const t = accueil.offres;

  return (
    <>
      <BandeauAccueil />
      <BandeParcours />

      <Section id="offres" aria-labelledby="titre-offres">
        <TitreSection id="titre-offres" centre titre={t.titre} texte={t.texte} />
        {/* Les filtres viennent de l'adresse (?q=…&secteur=…) : rendu client sous Suspense */}
        <Suspense fallback={offres.length > 0 ? <GrilleOffres offres={offres} /> : null}>
          <VitrineOffres offres={offres} />
        </Suspense>
        <div className="mt-10 flex justify-center">
          <Bouton href={lienConnexion()} variante="secondaire">
            {t.toutes}
          </Bouton>
        </div>
      </Section>

      <GrilleSecteurs />
      <CommentCaMarche avecCapture={imageExiste(accueil.etapes.capture)} />
      <BandeConstat />
      {/* Bande vidéo masquée tant que la vidéo de présentation n'existe pas (accueil.video.src) */}
      {accueil.video.src && <BandeVideo avecPhoto={imageExiste(accueil.video.image)} />}
      <Engagements />
      <AVenir evenement={evenement} />
      <BandeNewsletter />
    </>
  );
}
