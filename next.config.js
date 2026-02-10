const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  generateBuildId: async () => {
    // Custom build ID to bypass nanoid ESM/CJS issue with Node.js 24
    return crypto.randomBytes(16).toString('hex');
  },
};

module.exports = nextConfig;
