import type { CollectionConfig, Validate } from 'payload'

import { propertyField } from '../fields/property'
import { isAdminOrEditorForProperty, readPublishedOrEditorScoped } from '../access/roles'

// Results Ledger rule (spec section 4.1) — Studio case studies cannot publish without
// a populated results block. Other properties may leave it empty (CaseStudyShell renders
// a "results pending" placeholder for those), but Studio's is schema-enforced, not just
// a UI guideline.
const requiredForStudioIfPublished: Validate = (value, { data, siblingData }) => {
  const isStudio = (data as { property?: string })?.property === 'studio'
  const isPublished = (data as { _status?: string })?._status === 'published'
  if (isStudio && isPublished && (value === undefined || value === null || value === '')) {
    return 'Studio case studies require this field before publishing (Results Ledger rule).'
  }
  return true
}

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'property', 'client', '_status'],
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
      name: 'client',
      type: 'text',
    },
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'challenge',
      type: 'richText',
      required: true,
    },
    {
      name: 'insight',
      type: 'richText',
      required: true,
    },
    {
      name: 'work',
      type: 'richText',
      required: true,
    },
    {
      name: 'results',
      type: 'group',
      admin: {
        description:
          'Required before publish for Studio (Results Ledger rule). Optional for other properties.',
      },
      fields: [
        { name: 'spend', type: 'text', validate: requiredForStudioIfPublished },
        { name: 'cpl', type: 'text', validate: requiredForStudioIfPublished },
        { name: 'roas', type: 'text', validate: requiredForStudioIfPublished },
        { name: 'reach', type: 'text', validate: requiredForStudioIfPublished },
      ],
    },
  ],
}
