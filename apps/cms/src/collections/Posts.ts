import type { CollectionConfig } from 'payload'

import { propertyField } from '../fields/property'
import { isAdminOrEditorForProperty, readPublishedOrEditorScoped } from '../access/roles'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'property', 'publishedAt', '_status'],
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
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
