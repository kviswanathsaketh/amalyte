import type { CollectionConfig } from 'payload'

import { propertyField } from '../fields/property'
import { isAdminOrEditorForProperty, readPublishedOrEditorScoped } from '../access/roles'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'property', 'slug', '_status'],
  },
  versions: {
    drafts: true,
  },
  access: {
    create: isAdminOrEditorForProperty,
    read: readPublishedOrEditorScoped,
    update: isAdminOrEditorForProperty,
    delete: isAdminOrEditorForProperty,
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
      admin: {
        position: 'sidebar',
      },
    },
    propertyField,
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
