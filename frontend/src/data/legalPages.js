import { PRIVACY_BLOCKS } from './legal/privacyBlocks';
import { TERMS_BLOCKS } from './legal/termsBlocks';
import { REFUND_BLOCKS } from './legal/refundBlocks';

/** Shared site disclaimer paragraphs (popup + /legal/disclaimer). */
export const SITE_DISCLAIMER_PARAS = [
  'The Bar Council of India does not permit advertisement or solicitation by advocates in any form or manner.',
  'By accessing this website, you acknowledge that you are doing so of your own accord and without any solicitation, advertisement or inducement by Radhey Krishna Legal Aid Foundation (“RKLAF”), its trustees, members or representatives.',
  'The contents of this website are provided solely for informational and educational purposes and do not constitute legal advice, solicitation or advertisement. Accessing this website or submitting an enquiry does not create an advocate–client relationship or guarantee legal representation.',
  'RKLAF shall not be responsible or liable for any consequence arising from action taken or omitted based solely on the information contained herein, to the extent permitted by law.',
  'All content published on the website and other materials, is the intellectual property of RKLAF or is used with appropriate permission and shall not be reproduced or used without permission, except as permitted by law.',
  'By continuing to this website, you acknowledge and accept the above.',
];

export const LEGAL_PAGES = {
  privacy: {
    title: 'Privacy Policy',
    eyebrow: 'Legal',
    lastUpdated: '8 September 2026',
    blocks: PRIVACY_BLOCKS,
  },
  terms: {
    title: 'Terms & Conditions',
    eyebrow: 'Legal',
    lastUpdated: '8 September 2026',
    blocks: TERMS_BLOCKS,
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    eyebrow: 'Legal',
    lastUpdated: '8 September 2026',
    blocks: REFUND_BLOCKS,
  },
  disclaimer: {
    title: 'Disclaimer',
    eyebrow: 'Important disclaimer',
    lead: 'Before you continue',
    paras: SITE_DISCLAIMER_PARAS,
  },
};
