import { Clock, Mail, MapPin, MessageCircle } from 'lucide-react';
import { contact } from '@/content/fr/aide';
import { site } from '@/lib/site';
import { lienWhatsApp } from '@/lib/liens';
import { Section } from '@/components/ui/Section';
import Bouton from '@/components/ui/Bouton';
import EnTetePage from '@/components/blocs/EnTetePage';
import CarteBureau from '@/components/blocs/CarteBureau';
import FormulaireContact from '@/components/formulaires/FormulaireContact';

export const metadata = { title: contact.meta.titre, description: contact.meta.description, alternates: { canonical: '/contact' } };

/** /contact?motif=partenariat préremplit le motif du formulaire. */
export default async function PageContact({ searchParams }) {
  const { motif = '' } = await searchParams;
  const t = contact;

  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} />

      <Section>
        <ul className="grid gap-5 md:grid-cols-3">
          <li className="flex flex-col gap-3 rounded-lg border border-bordure p-6">
            <MessageCircle className="h-7 w-7 text-orange-texte" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{t.moyens.whatsapp}</h2>
            <p>{site.contact.whatsappAffiche}</p>
            <Bouton href={lienWhatsApp()} variante="whatsapp" nouvelOnglet className="self-start">
              {t.moyens.ecrire}
            </Bouton>
          </li>
          <li className="flex flex-col gap-3 rounded-lg border border-bordure p-6">
            <MapPin className="h-7 w-7 text-orange-texte" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{t.moyens.bureau}</h2>
            <p>
              {site.bureau.adresse}, {site.bureau.ville}
            </p>
            <p className="flex items-start gap-2 text-gris-fonce">
              <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              {site.bureau.horairesCourts}
            </p>
          </li>
          <li className="flex flex-col gap-3 rounded-lg border border-bordure p-6">
            <Mail className="h-7 w-7 text-orange-texte" aria-hidden="true" />
            <h2 className="text-xl font-semibold">{t.moyens.email}</h2>
            <a href={`mailto:${site.contact.email}`} className="lien self-start">
              {site.contact.email}
            </a>
          </li>
        </ul>
      </Section>

      <Section fond="gris">
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
