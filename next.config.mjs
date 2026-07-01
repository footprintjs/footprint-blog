import { BASE } from './site.config.js';
import path from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // static export for GitHub Pages
  basePath: BASE,              // served under footprintjs.github.io/blog
  trailingSlash: true,         // export folders with index.html (Pages-friendly)
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ['storydeck'], // storydeck ships JSX source; Next compiles it
  webpack: (config, { isServer }) => {
    // storydeck is linked via file: and ships its own React (a dev/test dep). Dedupe React in the
    // CLIENT bundle (where hooks run) so there's a single instance; leave the SERVER build alone so
    // React's server-only exports (React.cache, etc.) keep working. resolve.symlinks:false lets the
    // linked package resolve its runtime deps (markdown-it) from within the link.
    config.resolve.symlinks = false;
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve('./node_modules/react'),
        'react-dom': path.resolve('./node_modules/react-dom'),
      };
    }
    return config;
  },
};
export default nextConfig;
