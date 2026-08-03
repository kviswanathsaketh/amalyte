# @amalyte/cms — PENDING (typed client)

The actual Payload CMS instance (collections, config, admin panel) lives in `apps/cms`,
not here — Payload 3 requires running inside its own Next.js app (spec section 6.3).
This package is reserved for a typed fetch client + re-exported generated types
(`apps/cms/src/payload-types.ts`) that the 5 property apps will consume to query the
CMS's REST/GraphQL API. Not yet built.
