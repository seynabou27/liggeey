/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images servies en AVIF / WebP : bien plus légères en 4G.
  images: { formats: ['image/avif', 'image/webp'] },
  poweredByHeader: false,
  // Les pages vérifient la présence des photos dans public/images (lib/images.js).
  // On les inclut dans les fonctions serveur pour que la vérification marche aussi
  // lors des mises à jour automatiques (revalidation) en production.
  outputFileTracingIncludes: { '/**': ['./public/images/**/*'] },
};

export default nextConfig;
