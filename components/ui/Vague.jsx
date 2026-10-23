/**
 * Découpe en vague, reprise du modèle validé : le bas de la photo remonte vers la droite.
 * La couleur de fond de la page (token fond-page) est dessinée par-dessus la photo ; le contenu est placé au-dessus.
 */
export function VagueAccueil() {
  return (
    <>
      {/* Ordinateur : tracé sur toute la hauteur du bandeau */}
      <svg
        viewBox="0 0 1200 672"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[calc(100%+2px)] w-full xl:block"
      >
        <path d="M0 601 C40 640 100 660 200 657 C420 650 700 520 1200 238 L1200 672 L0 672 Z" style={{ fill: 'rgb(var(--fond-page))' }} />
      </svg>
      {/* Mobile et tablette : bande basse, sous la carte de recherche */}
      <svg
        viewBox="0 0 360 200"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-[202px] w-full xl:hidden"
      >
        <path d="M0 160 C12 180 30 188 70 187 C160 184 250 150 360 80 L360 200 L0 200 Z" style={{ fill: 'rgb(var(--fond-page))' }} />
      </svg>
    </>
  );
}

/** Vague plus discrète pour le haut des pages intérieures. */
export function VagueDouce() {
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-12 w-full md:h-20"
    >
      <path d="M0 58 C220 82 640 76 1200 0 L1200 80 L0 80 Z" style={{ fill: 'rgb(var(--fond-page))' }} />
    </svg>
  );
}
