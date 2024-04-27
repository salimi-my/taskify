import { twMerge } from 'tailwind-merge';
import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat('en-GB', {
    day: opts.day ?? 'numeric',
    month: opts.month ?? 'long',
    year: opts.year ?? 'numeric',
    ...opts
  }).format(new Date(date));
}
