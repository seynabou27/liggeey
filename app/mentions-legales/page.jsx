import { legal } from '@/content/fr/legal';
import PageLegale from '@/components/legal/PageLegale';

const page = legal.pages['mentions-legales'];
export const metadata = { title: page.titre, description: page.description, alternates: { canonical: '/mentions-legales' } };

export default function MentionsLegales() {
  return <PageLegale cle="mentions-legales" />;
}
