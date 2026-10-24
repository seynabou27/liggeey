import { Facebook, Globe, Instagram, Linkedin, Youtube } from 'lucide-react';

/* lucide-react n’a pas TikTok ni X : tracés au même style (trait de 2, 24 × 24). */
function TikTok(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5" />
    </svg>
  );
}

function X(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l11.7 16H20L8.3 4z" />
      <path d="M4 20l6.8-6.8M13.2 10.8L20 4" />
    </svg>
  );
}

/** Icônes par nom de réseau, tel qu’écrit dans lib/site.js (contact.reseaux). */
const ICONES_RESEAUX = { LinkedIn: Linkedin, Facebook, Instagram, TikTok, YouTube: Youtube, X };

export default function IconeReseau({ nom, className = 'h-[18px] w-[18px]' }) {
  const Composant = ICONES_RESEAUX[nom] ?? Globe;
  return <Composant className={className} aria-hidden="true" focusable="false" />;
}
