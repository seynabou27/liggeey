import Link from 'next/link';

const VARIANTES = {
  principal: 'bg-orange text-ardoise hover:bg-orange-survol', // texte ardoise sur orange : contraste 6:1
  secondaire: 'border-2 border-ardoise text-ardoise hover:bg-ardoise hover:text-white',
  clair: 'border-2 border-white text-white hover:bg-white hover:text-ardoise',
  sombre: 'bg-ardoise text-white hover:bg-ardoise-800',
  whatsapp: 'bg-whatsapp text-ardoise hover:brightness-95',
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
