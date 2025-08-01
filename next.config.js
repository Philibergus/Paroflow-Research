/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.backend.json',
  },
  eslint: {
    dirs: ['app'], // Only lint the app directory, not src
  },
  webpack: (config, { dev, isServer }) => {
    // Completely ignore src directory in webpack compilation
    config.module.rules.push({
      test: /\.(tsx?|jsx?)$/,
      include: /src/,
      use: 'ignore-loader',
    });

    // Exclude src from entry points
    const entries = config.entry;
    if (typeof entries === 'function') {
      config.entry = async () => {
        const originalEntries = await entries();
        // Filter out any entries that reference src
        Object.keys(originalEntries).forEach(key => {
          if (typeof originalEntries[key] === 'string' && originalEntries[key].includes('/src/')) {
            delete originalEntries[key];
          } else if (Array.isArray(originalEntries[key])) {
            originalEntries[key] = originalEntries[key].filter(entry => !entry.includes('/src/'));
          }
        });
        return originalEntries;
      };
    }

    return config;
  },
};

export default nextConfig;