const FONDS = {
  blanc: 'bg-surface',
  gris: 'bg-doux',
  clair: 'bg-marque-doux',
  sombre: 'bg-sombre text-sur-sombre',
};

/** Section de page avec conteneur centré et espacements réguliers. */
export function Section({ id, fond = 'blanc', etroit = false, className = '', children, ...props }) {
  return (
    <section id={id} className={`py-20 ${FONDS[fond]} ${className}`} {...props}>
      <div className={`container ${etroit ? 'max-w-4xl' : ''}`}>{children}</div>
    </section>
  );
}

/** Titre de section : surtitre, h2 et phrase d'introduction. */
export function TitreSection({ surtitre, titre, texte, centre = false, clair = false, id, className = '' }) {
  return (
    <div className={`mb-10 flex flex-col gap-2 ${centre ? 'items-center text-center' : ''} ${className}`}>
      {surtitre && <p className={`surtitre ${clair ? '!text-marque-vif' : ''}`}>{surtitre}</p>}
      <h2 id={id} className="max-w-3xl text-balance text-[22px] font-semibold leading-[1.27] md:text-[35px] md:leading-[1.2]">
        {titre}
      </h2>
      {texte && (
        <p className={`max-w-2xl text-pretty text-[15px] leading-[1.7] ${clair ? 'text-white/90' : 'text-secondaire'}`}>{texte}</p>
      )}
    </div>
  );
}

/** Mention de source sous un chiffre. */
export function Source({ children, clair = false }) {
  return <p className={`text-sm ${clair ? 'text-white/80' : 'text-secondaire'}`}>{children}</p>;
}
