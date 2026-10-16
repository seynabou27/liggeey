import { legal } from '@/content/fr/legal';
import PageLegale from '@/components/legal/PageLegale';

const page = legal.pages.confidentialite;
export const metadata = { title: page.titre, description: page.description, alternates: { canonical: '/confidentialite' } };

export default function Confidentialite() {
  return <PageLegale cle="confidentialite" />;
}
