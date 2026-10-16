import { Calendar, Clock, MapPin } from 'lucide-react';
import { jobDating } from '@/content/fr/services';
import { dateLongue, datePastille, fcfa, heure } from '@/lib/format';
import Bouton from '@/components/ui/Bouton';
import PartageWhatsApp from '@/components/blocs/PartageWhatsApp';

/** Carte d'un Job Dating : date, horaires, lieu, prix, inscription et partage. */
export default function CarteEvenement({ evenement, lienDetails = false }) {
  const t = jobDating.prochain;
  const pastille = datePastille(evenement.date);

  return (
    <article className="flex flex-col gap-6 rounded-lg border-[3px] border-ardoise bg-white p-6 md:flex-row md:items-start md:p-8">
      <div className="grid h-24 w-24 shrink-0 place-items-center rounded-lg bg-orange-clair text-center font-semibold leading-tight" aria-hidden="true">
        <span>
          <span className="block text-3xl">{pastille.jour}</span>
          <span className="block">{pastille.mois}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <h2 className="text-2xl font-semibold">{evenement.titre}</h2>
        <ul className="flex flex-col gap-1.5 text-gris-fonce">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span className="first-letter:uppercase">{dateLongue(evenement.date)}</span>
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {heure(evenement.debut)} – {heure(evenement.fin)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {evenement.lieu} · {evenement.precisionLieu}
          </li>
        </ul>
        <p className="flex flex-wrap gap-2">
          <span className="rounded-full bg-ardoise px-3 py-1 text-sm font-semibold text-white">
            {t.participation} : {fcfa(evenement.prix)}
          </span>
          <span className="rounded-full border border-bordure px-3 py-1 text-sm font-medium">{evenement.public}</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <Bouton href={`/job-dating/${evenement.slug}#inscription`}>{t.inscrire}</Bouton>
          {lienDetails && (
            <Bouton href={`/job-dating/${evenement.slug}`} variante="secondaire">
              {t.details}
            </Bouton>
          )}
          <PartageWhatsApp evenement={evenement} />
        </div>
      </div>
    </article>
  );
}
