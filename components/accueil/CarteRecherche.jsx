'use client';

import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { accueil } from '@/content/fr/accueil';
import { contrats, experiences, niveaux, secteurs, villes } from '@/content/referentiels';

function Liste({ nom, label, options, defaut, className = '' }) {
  return (
    <div className={`flex-col gap-2 ${className || 'flex'}`}>
      <label htmlFor={`recherche-${nom}`} className="text-xs font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          id={`recherche-${nom}`}
          name={nom}
          defaultValue=""
          className="h-14 w-full appearance-none rounded-md border border-base bg-surface pl-3.5 pr-10 text-sm text-principal focus:border-marque focus:outline-none focus:ring-2 focus:ring-focus/40"
        >
          <option value="">{defaut}</option>
          {options.map((o) => (
            <option key={o.id ?? o} value={o.id ?? o}>
              {o.nom ?? o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-discret" aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * Carte de recherche du bandeau d’accueil.
 * Elle filtre les offres en vitrine (paramètres d’URL lus par VitrineOffres)
 * puis fait défiler jusqu’à la section #offres. Sur mobile : mot-clé, secteur, ville.
 */
export default function CarteRecherche() {
  const router = useRouter();
  const t = accueil.recherche;

  function rechercher(evenement) {
    evenement.preventDefault();
    const params = new URLSearchParams();
    for (const [cle, valeur] of new FormData(evenement.currentTarget)) {
      const v = String(valeur).trim();
      if (v) params.set(cle, v);
    }
    const q = params.toString();
    router.push(q ? `/?${q}` : '/', { scroll: false });
    requestAnimationFrame(() => {
      const cible = document.getElementById('offres');
      if (cible) window.scrollTo({ top: cible.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  }

  return (
    <form role="search" aria-labelledby="titre-recherche" onSubmit={rechercher} className="relative self-start rounded-lg bg-surface p-6 text-principal shadow-carte sm:p-8">
      <h2 id="titre-recherche" className="text-[25px] font-semibold leading-[1.3] sm:text-[34px]">
        {t.titre}
        <br />
        <span className="text-marque-titre">{t.marque}</span>
      </h2>

      <div className="relative mt-5">
        <label htmlFor="recherche-q" className="sr-only">
          {t.motCle}
        </label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-discret" aria-hidden="true" />
        <input
          id="recherche-q"
          name="q"
          type="search"
          placeholder={t.motCle}
          className="h-14 w-full rounded-md border border-base pl-11 pr-3 text-[15px] placeholder:text-discret focus:border-marque focus:outline-none focus:ring-2 focus:ring-focus/40"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Liste nom="secteur" label={t.secteur} defaut={t.tous} options={secteurs} />
        <Liste nom="contrat" label={t.contrat} defaut={t.tous} options={contrats} className="hidden sm:flex" />
        <Liste nom="ville" label={t.ville} defaut={t.tous} options={villes} />
        <Liste nom="experience" label={t.experience} defaut={t.tous} options={experiences} className="hidden sm:flex" />
      </div>
      <Liste nom="niveau" label={t.niveau} defaut={t.tousNiveaux} options={niveaux} className="mt-4 hidden sm:flex" />

      <button type="submit" className="mt-6 inline-flex h-[55px] w-full items-center justify-center rounded bg-marque text-base font-medium text-sur-marque transition-colors hover:bg-marque-survol">
        {t.bouton}
      </button>
    </form>
  );
}
