/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration unifiée pour un seul serveur Next.js
  experimental: {
    // Permettre le serving de fichiers statiques depuis src/
    appDir: true,
  },
  
  typescript: {
    tsconfigPath: './tsconfig.json', // Utiliser tsconfig unifié
  },
  
  eslint: {
    dirs: ['app', 'src'], // Lint des deux dossiers
  },

  // Configuration pour servir le frontend React depuis Next.js
  async rewrites() {
    return [
      // Rediriger les routes frontend vers la SPA
      {
        source: '/((?!api|_next|_static|favicon.ico).*)',
        destination: '/spa',
      },
    ]
  },

  // Headers pour les assets statiques
  async headers() {
    return [
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Configuration Webpack pour supporter React frontend
  webpack: (config, { dev, isServer }) => {
    // Configuration pour les alias
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src'),
    }

    // Support des CSS modules pour shadcn/ui
    if (!isServer) {
      config.module.rules.push({
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      })
    }

    return config
  },

  // Variables d'environnement publiques
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000',
  },
}

const path = require('path')

module.exports = nextConfig