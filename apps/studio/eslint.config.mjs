// Flat-config ESLint setup (same pattern as apps/cms) — replaces the
// deprecated `next lint`, which is removed in Next 16 and incompatible
// with ESLint 10's CLI API.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: ['.next/'],
  },
]

export default eslintConfig
