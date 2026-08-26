/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  images: {
    // The pressed flowers are the only raster images on the site.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2592000,
  },

  async headers() {
    return [
      {
        // Hand-lettered artwork and pressed flowers never change once shipped.
        source: "/:dir(letters|petals)/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
