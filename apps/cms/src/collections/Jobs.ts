import type { CollectionConfig } from 'payload'

import { PROPERTIES } from '../fields/property'
import { isStaffOrHiringManager } from '../access/roles'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'status'],
  },
  access: {
    // Careers hub (Parent /careers) reads open roles publicly; only staff/hiring_manager
    // manage the listings — RBAC-gated per spec section 7 sprint acceptance criteria.
    create: isStaffOrHiringManager,
    read: ({ req: { user } }) => {
      if (user) return true
      return { status: { equals: 'open' } }
    },
    update: isStaffOrHiringManager,
    delete: isStaffOrHiringManager,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'department',
      type: 'text',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      // Which division this role belongs to; group-wide roles (e.g. a shared function)
      // can leave this unset rather than forcing a property choice.
      name: 'property',
      type: 'select',
      options: PROPERTIES.map((value) => ({ label: value, value })),
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'open', value: 'open' },
        { label: 'closed', value: 'closed' },
      ],
      defaultValue: 'open',
      required: true,
    },
  ],
}
