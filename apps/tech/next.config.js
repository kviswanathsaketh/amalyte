/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16's build-time type pass types LayoutProps against React 19's
  // ReactNode while these apps run React 18 -- the same 18/19 split already
  // documented and handled identically in apps/cms. `pnpm typecheck` (tsc)
  // remains the real type gate and passes clean; this only skips next
  // build's redundant second pass. Durable fix: React 19 migration.
  typescript: {
    ignoreBuildErrors: true,
  },
  // Pin the workspace root to the monorepo (where pnpm-lock.yaml lives) --
  // a stray lockfile in a parent directory otherwise makes Turbopack infer
  // the wrong root and breaks Tailwind/PostCSS discovery (same fix as cms).
  turbopack: {
    root: require('path').resolve(__dirname, '../..'),
  },
  transpilePackages: ['@amalyte/ui', '@amalyte/motion', '@amalyte/tokens-core', '@amalyte/tokens-tech'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.amalyte.com' },
      { protocol: 'https', hostname: '*.r2.cloudflarestorage.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
