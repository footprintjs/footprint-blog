import { BASE } from './site.config.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // static export for GitHub Pages
  basePath: BASE,              // served under footprintjs.github.io/blog
  trailingSlash: true,         // export folders with index.html (Pages-friendly)
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
