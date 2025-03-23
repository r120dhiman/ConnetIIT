import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isIITEmail(email: string): boolean {
  const iitDomains = [
    "@iitbbs.ac.in",   // IIT Bhubaneswar
    "@iitm.ac.in",     // IIT Madras
    "@iiti.ac.in",     // IIT Indore
    "@iitk.ac.in",     // IIT Kanpur
    "@iitj.ac.in",     // IIT Jodhpur
    "@iitkgp.ac.in",   // IIT Kharagpur
    "@kgpian.iitkgp.ac.in", // Alternative for IIT Kharagpur
    "@iith.ac.in",     // IIT Hyderabad
    "@iitb.ac.in",     // IIT Bombay
    "@iitp.ac.in",     // IIT Patna
    "@iitd.ac.in",     // IIT Delhi
    "@iitrpr.ac.in",   // IIT Ropar
    "@iitmandi.ac.in", // IIT Mandi
    "@iitr.ac.in",     // IIT Roorkee
    "@iitbhu.ac.in",   // IIT (BHU) Varanasi
    "@itbhu.ac.in",   // IIT (BHU) Varanas
    "@iitjammu.ac.in", // IIT Jammu
    "@iitpkd.ac.in",   // IIT Palakkad
    "@iittp.ac.in",    // IIT Tirupati
    "@iitgoa.ac.in",   // IIT Goa
    "@iitbhilai.ac.in",// IIT Bhilai
    "@iitdh.ac.in",    // IIT Dharwad
    "@iitgn.ac.in",    // IIT Gandhinagar
    "@iitg.ac.in",      // IIT Guwahati
    "@iitg.ernet.in",      // IIT Guwahati
  ];
  return iitDomains.some(domain => email.endsWith(domain));
}