const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    externalDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    unoptimized: false,
  },
};

export default nextConfig;
