import { Clock, Mail, MapPin, MessageCircle, Navigation } from 'lucide-react';
import { contact } from '@/content/fr/aide';
import { site } from '@/lib/site';
import { lienItineraire, lienWhatsApp } from '@/lib/liens';
import { Section } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import CarteBureau from '@/components/blocs/CarteBureau';
import FormulaireContact from '@/components/formulaires/FormulaireContact';

export const metadata = { title: contact.meta.titre, description: contact.meta.description, alternates: { canonical: '/contact' } };

/** Une carte « moyen de contact » : icône, titre, phrase, coordonnée et action (en bas, alignées d'une carte à l'autre). */
function MoyenContact({ icone: IconeMoyen, titre, texte, children }) {
  return (
    <li className="flex flex-col gap-3 rounded-lg border border-base bg-surface p-6 transition-shadow hover:shadow-carte">
      <span className="grid h-12 w-12 place-items-center rounded-lg bg-marque-doux text-marque-fort" aria-hidden="true">
        <IconeMoyen className="h-6 w-6" />
      </span>
      <h2 className="text-xl font-semibold">{titre}</h2>
      <p className="text-[15px] text-secondaire">{texte}</p>
      {children}
    </li>
  );
}

/** /contact?motif=partenariat préremplit le motif du formulaire. */
export default async function PageContact({ searchParams }) {
  const { motif = '' } = await searchParams;
  const t = contact;

  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} image={t.hero.image}>
        <Bouton href={lienWhatsApp()} variante="whatsapp" nouvelOnglet>
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {t.moyens.ecrire}
        </Bouton>
        <Bouton href="#formulaire" variante="clair">
          {t.hero.message}
        </Bouton>
      </EnTetePage>

      <Section>
        <ul className="grid gap-5 md:grid-cols-3">
          <MoyenContact icone={MessageCircle} titre={t.moyens.whatsapp} texte={t.moyens.textes.whatsapp}>
            <p className="font-semibold">{site.contact.whatsappAffiche}</p>
            <Bouton href={lienWhatsApp()} variante="whatsapp" nouvelOnglet className="mt-auto self-start">
              {t.moyens.ecrire}
            </Bouton>
          </MoyenContact>
          <MoyenContact icone={MapPin} titre={t.moyens.bureau} texte={t.moyens.textes.bureau}>
            <p className="font-semibold">
              {site.bureau.adresse}, {site.bureau.ville}
            </p>
            <p className="flex items-start gap-2 text-sm text-secondaire">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {site.bureau.horairesCourts}
            </p>
            <Bouton href={lienItineraire()} variante="secondaire" nouvelOnglet className="mt-auto self-start">
              <Navigation className="h-4 w-4" aria-hidden="true" />
              {t.moyens.itineraire}
            </Bouton>
          </MoyenContact>
          <MoyenContact icone={Mail} titre={t.moyens.email} texte={t.moyens.textes.email}>
            <p className="font-semibold">{site.contact.email}</p>
            <Bouton href={`mailto:${site.contact.email}`} variante="secondaire" className="mt-auto self-start">
              {t.moyens.envoyerEmail}
            </Bouton>
          </MoyenContact>
        </ul>
      </Section>

      <Section id="formulaire" fond="gris" className="scroll-mt-[72px]">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="mb-8 text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.formulaire.titre}</h2>
            <FormulaireContact motifInitial={motif} />
          </div>
          <div id="bureau">
            <h2 className="mb-8 text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.moyens.bureau}</h2>
            <CarteBureau />
          </div>
        </div>
      </Section>
    </>
  );
}
