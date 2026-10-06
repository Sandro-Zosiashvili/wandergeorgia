import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // React Compiler (babel-plugin-react-compiler) is enabled in annotation mode:
  // it only transforms components/hooks that explicitly opt in with a
  // "use memo" directive. babel-plugin-react-compiler@1.0.0's automatic mode
  // mis-compiles some state updates in this Next 16 / React 19.2 combo, so we
  // keep the compiler wired up but opt-in to guarantee correct runtime behaviour.
  reactCompiler: {
    compilationMode: 'annotation',
  },
  sassOptions: {
    // Allow `@use '@/styles/...'` style imports from SCSS modules.
    includePaths: [path.join(process.cwd(), 'src', 'styles')],
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // Admins can paste image URLs from any host in the tour editor, so allow
    // any HTTPS image (next/image still optimizes them). Without this, a tour
    // whose image lives on an unconfigured host crashes the page it renders on.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },

  // Proxy /api/* to the NestJS backend so admin auth is SAME-ORIGIN: the
  // backend's HttpOnly access_token cookie is then set on this site's own
  // domain, which lets proxy.ts read it and keeps SameSite=Lax working in
  // production (a cross-domain cookie would be invisible to middleware).
  // Only /api/* is proxied — /booking is a frontend page, so it's untouched.
  async rewrites() {
    const backend = (process.env.NEXT_PUBLIC_API_URL ?? 'https://wandergeorgia-backend.vercel.app').replace(/\/$/, '');
    return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];
  },
};

export default nextConfig;
