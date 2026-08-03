import type { CollectionConfig } from 'payload'

import { PROPERTIES } from '../fields/property'
import { ROLES, isAdmin, isAdminFieldAccess } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    // Only admins manage the user list; anyone authenticated can read their own record
    // (Payload's default self-read behavior on the auth collection covers that).
    create: isAdmin,
    delete: isAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ROLES.map((value) => ({ label: value, value })),
      defaultValue: ['editor'],
      required: true,
      saveToJWT: true,
      access: {
        update: isAdminFieldAccess,
      },
    },
    {
      // Which properties an "editor" role user may manage — admins and staff/hiring_manager
      // roles ignore this (staff/hiring_manager scope is group-wide, per Jobs/Applications).
      name: 'properties',
      type: 'select',
      hasMany: true,
      options: PROPERTIES.map((value) => ({ label: value, value })),
      saveToJWT: true,
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.roles?.includes('editor')),
      },
      access: {
        update: isAdminFieldAccess,
      },
    },
  ],
  versions: false,
}
