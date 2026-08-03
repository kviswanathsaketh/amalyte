import type { Field } from 'payload'

// The 5 Amalyte properties, shared across collections for multi-tenant filtering
// (spec section 7.1 package structure — every content document is scoped to one property).
export const PROPERTIES = ['parent', 'studio', 'tech', 'learn', 'labs'] as const

export const propertyField: Field = {
  name: 'property',
  type: 'select',
  required: true,
  options: PROPERTIES.map((value) => ({ label: value, value })),
  index: true,
  admin: {
    position: 'sidebar',
  },
}
