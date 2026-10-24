import { ressources } from '@/content/fr/aide';
import { getArticles } from '@/lib/articles';
import { Section } from '@/components/ui/Section';
import EnTetePage from '@/components/blocs/EnTetePage';
import ListeArticles from '@/components/ressources/ListeArticles';
import BandeNewsletter from '@/components/blocs/BandeNewsletter';

export const metadata = { title: ressources.meta.titre, description: ressources.meta.description, alternates: { canonical: '/ressources' } };

export default function PageRessources() {
  // On n’envoie au navigateur que ce qui sert à la liste (pas le texte complet).
  const articles = getArticles().map(({ slug, titre, resume, public: cible, auteur, date, minutes }) => ({ slug, titre, resume, public: cible, auteur, date, minutes }));
  const t = ressources;

  return (
    <>
      <EnTetePage surtitre={t.hero.surtitre} titre={t.hero.titre} texte={t.hero.texte} />
      <Section>
        <ListeArticles articles={articles} />
      </Section>
      <BandeNewsletter />
    </>
  );
}
