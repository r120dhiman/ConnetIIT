import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIITEmail(email: string): boolean {
  const iitDomains = [
    '@iitb.ac.in',
    '@iitd.ac.in',
    '@iiti.ac.in',
    '@iitk.ac.in',
    '@iitkgp.ac.in',
    '@iitm.ac.in',
    '@iitp.ac.in',
    '@iitr.ac.in',
    '@iitism.ac.in',
    '@itbhu.ac.in',
    '@iitbhu.ac.in'
  ];
  return iitDomains.some(domain => email.endsWith(domain));
}