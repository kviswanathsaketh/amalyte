import type { Access, FieldAccess, Where } from 'payload'

// Role model for the CMS Users collection (spec section 6.3 — access control mapping
// onto the Org->Tenant->Person RBAC model). Kept CMS-local: these are editorial roles,
// not the same as the product-suite roles modeled in Keycloak/Entra.
export const ROLES = ['admin', 'editor', 'staff', 'hiring_manager'] as const

type UserWithRoles = {
  roles?: string[]
  properties?: string[]
}

const hasRole = (user: UserWithRoles | null | undefined, role: string) =>
  Boolean(user?.roles?.includes(role))

export const isAdmin: Access = ({ req: { user } }) => hasRole(user as UserWithRoles, 'admin')

export const isAdminFieldAccess: FieldAccess = ({ req: { user } }) =>
  hasRole(user as UserWithRoles, 'admin')

// Admins manage everything; editors are scoped to the properties assigned to them
// on their user record (properties field, see Users.ts).
export const isAdminOrEditorForProperty: Access = ({ req: { user } }) => {
  const typedUser = user as UserWithRoles | null | undefined
  if (hasRole(typedUser, 'admin')) return true
  if (!hasRole(typedUser, 'editor')) return false
  const properties = typedUser?.properties
  if (!properties || properties.length === 0) return false
  const where: Where = { property: { in: properties } }
  return where
}

export const isStaffOrHiringManager: Access = ({ req: { user } }) => {
  const typedUser = user as UserWithRoles | null | undefined
  return (
    hasRole(typedUser, 'admin') ||
    hasRole(typedUser, 'staff') ||
    hasRole(typedUser, 'hiring_manager')
  )
}

// Public read of published content; authenticated editorial users see everything
// they're scoped to (draft included) so they can review before publish.
export const readPublishedOrEditorScoped: Access = (args) => {
  const { req } = args
  const { user } = req
  const typedUser = user as UserWithRoles | null | undefined
  const publishedOnly: Where = { _status: { equals: 'published' } }
  if (!typedUser) return publishedOnly
  if (hasRole(typedUser, 'admin')) return true
  if (hasRole(typedUser, 'editor')) {
    const properties = typedUser.properties
    if (properties && properties.length > 0) {
      const scoped: Where = { property: { in: properties } }
      return scoped
    }
  }
  return publishedOnly
}
