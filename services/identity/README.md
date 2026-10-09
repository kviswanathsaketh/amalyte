# identity service — Keycloak

Content-property SSO for the five `amalyte.com` sites (spec §3.5). One realm,
one account across parent / studio / tech / learn / labs. Product-suite IAM
(`amalyte.org`, Entra External ID) is a separate track — spec §3.4 / Phase 1.5.

## Stack

- **Keycloak 26.3** (Docker) — OIDC/OAuth 2.1 provider, future `id.amalyte.com`
- **Postgres 16** (bundled container) — Keycloak's own datastore; can later be
  repointed to Azure `amalyte-pg-dev` via `KC_DB_URL`
- Realm-as-code: `realm/amalyte-realm.json`, imported on first boot

## Quickstart

```bash
cp .env.example .env   # set KC_ADMIN_PASSWORD / KC_DB_PASSWORD
docker compose up -d
```

Admin console: http://localhost:8080/admin (bootstrap admin from `.env`).

Verify the base realm (Sprint 1 acceptance — realm + client + valid JWT):

```bash
# 1. Realm + OIDC discovery reachable
curl -s http://localhost:8080/realms/amalyte/.well-known/openid-configuration | jq .issuer

# 2. Login flow returns a valid JWT (dev-only direct-grant client)
curl -s -X POST http://localhost:8080/realms/amalyte/protocol/openid-connect/token \
  -d grant_type=password -d client_id=auth-cli-test \
  -d username=demo.visitor@amalyte.test -d password='ChangeMe!2026' | jq .access_token
```

## Realm contents (`amalyte`)

- **Roles** — all 8 from spec §3.5: `visitor` (default on registration),
  `lead`, `client`, `learner`, `instructor`, `partner`, `investor`, `staff`
- **Clients**
  - `parent-web` — public, authorization code + PKCE (S256) only, test client
    for the Sprint 1 login-flow check; per-property clients come when apps
    wire up `packages/auth`
  - `auth-cli-test` — **dev only**, direct access grants for curl-based token
    checks; must be disabled in any deployed environment
- **Security settings** (spec §3.8): 15-min access tokens, refresh-token
  rotation (`revokeRefreshToken`, max reuse 0), brute-force protection
  (5 failures → escalating lockout), 12-char password policy, TOTP policy,
  WebAuthn/passkey policies preconfigured (`amalyte.com` rpId)
- **Browser flow** — `amalyte browser`: cookie/IdP-redirect alternatives,
  username+password, then role-conditional OTP so `staff`, `instructor`,
  `partner`, `investor` must complete TOTP MFA once they have an OTP
  credential configured (mandatory-MFA baseline, §3.8)
- **Demo user** — `demo.visitor@amalyte.test` / `ChangeMe!2026`, role
  `visitor` (dev only)

## Deployment target

Oracle free-tier AMD VM (1GB RAM — heap capped at 512m in compose, spec
§11.1), behind TLS as `id.amalyte.com`. Production run switches the command to
`start --optimized --hostname=https://id.amalyte.com` and requires:

- `sslRequired: external` already set — terminate TLS at the VM's reverse proxy
- SMTP configured + `verifyEmail: true` (deferred — no mail server yet)
- `auth-cli-test` client and `demo.visitor` user removed
- Realm edits after first boot need a fresh DB volume or a manual re-import
  (`kcadm`), since `--import-realm` only applies on an empty realm

## Deferred / not yet done

- Oracle VM provisioning + DNS for `id.amalyte.com` — gated on the Oracle
  Cloud account (user-only step, tracker Sprint 0)
- SMTP + email verification
- Passkey-first login flow (policies are set; the passwordless browser flow
  is not yet wired)
- Cross-subdomain silent SSO check (UC-02) once apps integrate `packages/auth`
