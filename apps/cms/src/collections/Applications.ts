import type { CollectionConfig, FieldAccess } from 'payload'

import { isStaffOrHiringManager } from '../access/roles'

type UserWithRoles = { roles?: string[] }

const isStaffOrHiringManagerField: FieldAccess = ({ req: { user } }) => {
  const roles = (user as UserWithRoles | null | undefined)?.roles
  return Boolean(roles?.includes('admin') || roles?.includes('staff') || roles?.includes('hiring_manager'))
}

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'applicantName',
    defaultColumns: ['applicantName', 'job', 'status', 'createdAt'],
  },
  access: {
    // Anyone can apply (public create); only staff/hiring_manager can see or manage
    // applications — an applicant never gets read access to their own or others' records
    // via the API, matching spec section 7's RBAC requirement (a non-staff user gets 403).
    create: () => true,
    read: isStaffOrHiringManager,
    update: isStaffOrHiringManager,
    delete: isStaffOrHiringManager,
  },
  fields: [
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
    },
    {
      name: 'applicantName',
      type: 'text',
      required: true,
    },
    {
      name: 'applicantEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'coverLetter',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'submitted', value: 'submitted' },
        { label: 'reviewing', value: 'reviewing' },
        { label: 'interview', value: 'interview' },
        { label: 'rejected', value: 'rejected' },
        { label: 'hired', value: 'hired' },
      ],
      defaultValue: 'submitted',
      required: true,
      access: {
        // Applicants create via the public form and never touch this field directly;
        // only staff/hiring_manager can move it through the pipeline.
        update: isStaffOrHiringManagerField,
      },
    },
  ],
}
