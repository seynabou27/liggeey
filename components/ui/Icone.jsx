import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Calculator,
  Camera,
  ClipboardCheck,
  Eye,
  FileCheck2,
  GraduationCap,
  Hammer,
  HardHat,
  Headphones,
  HeartHandshake,
  Laptop,
  ListChecks,
  Lock,
  Scissors,
  ShieldCheck,
  Smartphone,
  Store,
  Target,
  Truck,
  User,
  UtensilsCrossed,
} from 'lucide-react';

/**
 * Les fichiers de contenu désignent les icônes par leur nom (« BadgeCheck »…).
 * Ajouter ici toute nouvelle icône Lucide utilisée dans content/.
 */
export const ICONES = {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  Calculator,
  Camera,
  ClipboardCheck,
  Eye,
  FileCheck2,
  GraduationCap,
  Hammer,
  HardHat,
  Headphones,
  HeartHandshake,
  Laptop,
  ListChecks,
  Lock,
  Scissors,
  ShieldCheck,
  Smartphone,
  Store,
  Target,
  Truck,
  User,
  UtensilsCrossed,
};

export default function Icone({ nom, className = 'h-6 w-6' }) {
  const Composant = ICONES[nom] ?? BadgeCheck;
  return <Composant className={className} aria-hidden="true" focusable="false" />;
}
