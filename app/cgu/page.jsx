import { legal } from '@/content/fr/legal';
import PageLegale from '@/components/legal/PageLegale';

const page = legal.pages.cgu;
export const metadata = { title: page.titre, description: page.description, alternates: { canonical: '/cgu' } };

export default function Cgu() {
  return <PageLegale cle="cgu" />;
}
