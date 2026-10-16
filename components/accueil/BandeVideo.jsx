'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { accueil } from '@/content/fr/accueil';

/** Lien YouTube → adresse d'intégration sans cookies, lancée automatiquement. */
function adresseYouTube(src) {
  const m = src.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0` : null;
}

/**
 * Bande vidéo (comme le modèle) : grande photo, bouton de lecture au centre.
 * La vidéo s'ouvre dans une fenêtre et n'est chargée qu'au clic (économie de données mobiles).
 * Tant que `accueil.video.src` est vide, le bouton indique « Vidéo bientôt disponible ».
 * @param {{ avecPhoto: boolean }} props  photo présente dans /public ?
 */
export default function BandeVideo({ avecPhoto }) {
  const t = accueil.video;
  const ref = useRef(null);
  const [lecture, setLecture] = useState(false);
  const youtube = t.src ? adresseYouTube(t.src) : null;

  const ouvrir = () => {
    setLecture(true);
    ref.current?.showModal();
  };

  return (
    <section aria-labelledby="titre-video" className="relative overflow-hidden bg-ardoise">
      {avecPhoto && <Image src={t.image} alt="" fill sizes="100vw" className="object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ardoise/85 via-ardoise/40 to-ardoise/20" aria-hidden="true" />

      <div className="container relative flex min-h-[340px] flex-col items-center justify-center gap-5 py-20 text-center text-white md:min-h-[560px]">
        <button
          type="button"
          onClick={ouvrir}
          disabled={!t.src}
          aria-haspopup="dialog"
          aria-label={t.src ? t.lire : `${t.titre} : ${t.bientot}`}
          className="group relative grid h-20 w-20 place-items-center rounded-full bg-white text-orange-texte shadow-carte transition-transform hover:scale-105 disabled:cursor-default disabled:hover:scale-100 md:h-24 md:w-24"
        >
          {/* Halo qui pulse autour du bouton (désactivé si l'on a demandé à réduire les mouvements) */}
          {t.src && <span className="absolute inset-0 animate-ping rounded-full bg-white/40 motion-reduce:hidden" aria-hidden="true" />}
          <Play className="relative ml-1 h-8 w-8 fill-current md:h-9 md:w-9" aria-hidden="true" />
        </button>
        <div className="flex flex-col items-center gap-2">
          <h2 id="titre-video" className="text-[22px] font-semibold leading-[1.27] md:text-[32px] md:leading-[1.2]">
            {t.titre}
          </h2>
          <p className="max-w-xl text-[15px] leading-[1.7] text-white/90">{t.texte}</p>
          {!t.src && <p className="mt-1 rounded-full bg-white/15 px-4 py-1 text-[13px] font-medium backdrop-blur">{t.bientot}</p>}
        </div>
      </div>

      <dialog
        ref={ref}
        aria-label={t.titre}
        onClose={() => setLecture(false)}
        onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
        className="m-auto w-[calc(100%-24px)] max-w-4xl overflow-visible bg-transparent p-0 backdrop:bg-ardoise/85 backdrop:backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={t.fermer}
          className="absolute -top-14 right-0 grid h-11 w-11 place-items-center rounded-full bg-white text-ardoise hover:bg-gris-fond"
          autoFocus
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-black shadow-carte">
          {lecture && youtube && (
            <iframe src={youtube} title={t.titre} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 h-full w-full" />
          )}
          {lecture && !youtube && t.src && <video src={t.src} controls autoPlay preload="none" className="absolute inset-0 h-full w-full" />}
        </div>
      </dialog>
    </section>
  );
}
