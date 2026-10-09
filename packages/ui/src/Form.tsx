'use client';

// Form primitives — Input, Textarea, Label. Neutral-chrome styled (spec §10.1):
// no property tint on the field itself, accent reserved for the focus state only,
// matching the pill/rounded-lg proportions used by Card and Button elsewhere in
// this package.

import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const FIELD_CLASSES =
  'w-full rounded-md border border-ink-300 bg-paper text-ink-900 text-body px-4 py-3 placeholder:text-ink-500 outline-none transition-all duration-base ease-amalyte focus:border-accent focus:ring-4 focus:ring-accent-soft';

export function Label({
  className,
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`block text-caption text-ink-500 mb-2 ${className ?? ''}`}
      {...props}
    >
      {children}
    </label>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${FIELD_CLASSES} ${className ?? ''}`} {...props} />;
}

export function Textarea({
  className,
  rows = 5,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea rows={rows} className={`${FIELD_CLASSES} resize-y ${className ?? ''}`} {...props} />
  );
}
