import { tarifs } from '@/content/fr/tarifs';

/** Services à la carte : nom, description, prix et unité. */
export default function TableauServices() {
  const t = tarifs.services;
  return (
    <div>
      <h2 className="text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">{t.titre}</h2>
      <dl className="mt-6 divide-y divide-base border-y border-base">
        {t.items.map((s) => (
          <div key={s.nom} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div>
              <dt className="text-lg font-semibold">{s.nom}</dt>
              <dd className="text-secondaire">{s.texte}</dd>
            </div>
            <dd className="shrink-0 text-lg font-semibold">
              {s.prix} <span className="font-normal text-secondaire">{s.unite}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
