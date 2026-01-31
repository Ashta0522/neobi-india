/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Fix build ID generation
  generateBuildId: async () => {
    return 'neobi-build-' + Date.now();
  },
};

module.exports = nextConfig;
