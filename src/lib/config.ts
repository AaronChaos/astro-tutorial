/**
 * Site-wide config constants.
 * Change SIGNUP_URL here once; it updates every CTA on the site.
 */
export const SITE_NAME = 'Kindred';
export const SITE_TAGLINE = 'Adult dating, done with respect.';

// The 3rd-party partner/affiliate signup URL.
// Swap this in one place and every "Join" button redirects.
export const SIGNUP_URL = 'https://partner.example.com/?ref=kindred';

// Standard rel attributes for outbound affiliate links.
// `sponsored` satisfies Google's paid-link disclosure rules.
export const SIGNUP_REL = 'nofollow sponsored noopener';
export const SIGNUP_TARGET = '_blank';
