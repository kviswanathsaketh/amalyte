// @payloadcms/next exposes its admin styles via an extension-less package export
// (its package.json "exports" maps "./css" to a real .css file), which TypeScript's
// built-in `declare module '*.css'` wildcard doesn't match since the literal import
// specifier has no .css suffix. This satisfies the side-effect import in the
// Payload-generated (payload) route files without touching those generated files.
declare module '@payloadcms/next/css'
