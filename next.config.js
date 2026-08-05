/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        'pg-native': false,
      };
    }
    return config;
  }
}

module.exports = nextConfig
