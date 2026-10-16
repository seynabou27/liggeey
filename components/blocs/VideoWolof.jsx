'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { independants } from '@/content/fr/independants';

/** Transforme un lien YouTube en adresse d'intégration sans cookies. */
function adresseYouTube(src) {
  const m = src.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1` : null;
}

/**
 * Vidéo courte en wolof, lue seulement au clic (économie de données mobiles).
 * Tant que `src` est vide, la carte indique « Vidéo bientôt disponible ».
 */
export default function VideoWolof({ video }) {
  const [lecture, setLecture] = useState(false);
  const youtube = video.src ? adresseYouTube(video.src) : null;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-bordure bg-white p-4">
      <div className="relative aspect-video overflow-hidden rounded-md bg-ardoise">
        {lecture && youtube && (
          <iframe src={youtube} title={video.titre} allow="autoplay; encrypted-media" allowFullScreen className="absolute inset-0 h-full w-full" />
        )}
        {lecture && !youtube && <video src={video.src} controls autoPlay preload="none" className="absolute inset-0 h-full w-full" />}
        {!lecture && (
          <button
            type="button"
            disabled={!video.src}
            onClick={() => setLecture(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white disabled:cursor-default"
            aria-label={video.src ? `Lire la vidéo : ${video.titre}` : `${video.titre} : ${independants.wolof.bientot}`}
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-orange text-ardoise">
              <Play className="h-6 w-6" aria-hidden="true" />
            </span>
            {!video.src && <span className="text-sm">{independants.wolof.bientot}</span>}
          </button>
        )}
      </div>
      <h3 className="font-semibold">{video.titre}</h3>
      <p className="text-sm text-gris-fonce">{video.duree}</p>
    </article>
  );
}
