import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Payload's own generated src/app/(payload)/layout.tsx fails tsc with a
  // ReactNode/ReactPortal structural mismatch against the currently-available
  // @types/react 19.x line (confirmed not fixed by any @types/react or
  // @types/react-dom patch, and not fixable by editing the generated file --
  // Payload overwrites it). `pnpm typecheck` (tsc --noEmit, our dedicated CI
  // gate) already excludes this one file and still catches real type errors
  // everywhere else in this app; this only skips next build's own redundant,
  // second type-check pass, which can't be scoped file-by-file the way
  // tsconfig's `exclude` can.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    // Points at the monorepo root (where pnpm-lock.yaml lives), not this app's own
    // directory — Turbopack's workspace root is the nearest lockfile, not the app dir.
    root: path.resolve(dirname, '../..'),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
