import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIITEmail(email: string): boolean {
  return email.endsWith('@itbhu.ac.in');
}