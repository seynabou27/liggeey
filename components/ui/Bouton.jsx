import Link from 'next/link';

const VARIANTES = {
  principal: 'bg-marque text-sur-marque hover:bg-marque-survol active:bg-marque-actif', // texte ardoise sur orange : contraste 6:1
  secondaire: 'border-2 border-principal text-principal hover:bg-sombre hover:text-sur-sombre',
  clair: 'border-2 border-white text-sur-sombre hover:bg-surface hover:text-principal',
  sombre: 'bg-sombre text-sur-sombre hover:bg-sombre-doux',
  whatsapp: 'bg-whatsapp text-sur-marque hover:brightness-95',
};

/**
 * Bouton ou lien en forme de bouton (hauteur minimale 44 px pour le tactile).
 * - sans href : <button>
 * - lien externe (http, mailto, tel) : <a>
 * - lien interne : <Link>
 */
export default function Bouton({
  href,
  variante = 'principal',
  petit = false,
  pleineLargeur = false,
  nouvelOnglet = false,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60',
    petit ? 'px-4 text-sm' : 'px-6 text-[15px]',
    pleineLargeur ? 'w-full' : '',
    VARIANTES[variante],
    className,
  ].join(' ');

  if (!href) {
    return (
      <button type="button" className={classes} {...props}>
        {children}
      </button>
    );
  }
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const cible = nouvelOnglet ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    return (
      <a href={href} className={classes} {...cible} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}
