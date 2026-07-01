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
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
