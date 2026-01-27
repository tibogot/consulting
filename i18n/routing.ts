import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['fr', 'en', 'nl'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Pathnames with translated routes
  pathnames: {
    '/': '/',
    
    // Services
    '/services': {
      fr: '/services',
      en: '/services',
      nl: '/diensten',
    },
    '/services/search-selection': {
      fr: '/services/recherche-selection',
      en: '/services/search-selection',
      nl: '/diensten/zoeken-selectie',
    },
    '/services/consulting': {
      fr: '/services/conseil',
      en: '/services/consulting',
      nl: '/diensten/advies',
    },
    '/services/managed': {
      fr: '/services/geres',
      en: '/services/managed',
      nl: '/diensten/beheerd',
    },

    // Clamp test page
    '/clamptest': {
      fr: '/clamptest',
      en: '/clamptest',
      nl: '/clamptest',
    },
    
    // Hubs
    '/hubs': {
      fr: '/hubs',
      en: '/hubs',
      nl: '/hubs',
    },
    '/hubs/technology': {
      fr: '/hubs/technologie',
      en: '/hubs/technology',
      nl: '/hubs/technologie',
    },
    '/hubs/engineering': {
      fr: '/hubs/ingenierie',
      en: '/hubs/engineering',
      nl: '/hubs/ingenieurs',
    },
    '/hubs/business-operations': {
      fr: '/hubs/affaires-operations',
      en: '/hubs/business-operations',
      nl: '/hubs/bedrijfsvoering',
    },
    
    // About
    '/about': {
      fr: '/a-propos',
      en: '/about',
      nl: '/over-ons',
    },
    '/about/us': {
      fr: '/a-propos/nous',
      en: '/about/us',
      nl: '/over-ons/ons',
    },
    '/about/mission': {
      fr: '/a-propos/mission',
      en: '/about/mission',
      nl: '/over-ons/missie',
    },
    '/about/team': {
      fr: '/a-propos/equipe',
      en: '/about/team',
      nl: '/over-ons/team',
    },
    
    // Careers
    '/careers': {
      fr: '/carrieres',
      en: '/careers',
      nl: '/carrieres',
    },
    '/careers/find-job': {
      fr: '/carrieres/trouver-emploi',
      en: '/careers/find-job',
      nl: '/carrieres/vacatures',
    },
    '/careers/work-at-sparagus': {
      fr: '/carrieres/travailler-chez-sparagus',
      en: '/careers/work-at-sparagus',
      nl: '/carrieres/werken-bij-sparagus',
    },
    '/recruitment': {
      fr: '/recrutement',
      en: '/recruitment',
      nl: '/werving',
    },
    
    // Blog
    '/blog': {
      fr: '/blog',
      en: '/blog',
      nl: '/blog',
    },
    
    // Case Studies
    '/case-studies': {
      fr: '/etudes-de-cas',
      en: '/case-studies',
      nl: '/casestudies',
    },
    
    // Contact
    '/contact': {
      fr: '/contact',
      en: '/contact',
      nl: '/contact',
    },
    
    // Legal
    '/legal': {
      fr: '/legal',
      en: '/legal',
      nl: '/juridisch',
    },
    
    // Cookies
    '/cookies': {
      fr: '/cookies',
      en: '/cookies',
      nl: '/cookies',
    },

    // Gradients (demo page)
    '/gradients': {
      fr: '/gradients',
      en: '/gradients',
      nl: '/gradients',
    },
    
    // Demo routes
    '/gta-scroll-demo': {
      fr: '/gta-scroll-demo',
      en: '/gta-scroll-demo',
      nl: '/gta-scroll-demo',
    },
    '/gta-scroll-reverse-demo': {
      fr: '/gta-scroll-reverse-demo',
      en: '/gta-scroll-reverse-demo',
      nl: '/gta-scroll-reverse-demo',
    },
    '/gta-scroll-reverse-gradient-demo': {
      fr: '/gta-scroll-reverse-gradient-demo',
      en: '/gta-scroll-reverse-gradient-demo',
      nl: '/gta-scroll-reverse-gradient-demo',
    },
    '/scrolltrigger-dash-demo': {
      fr: '/scrolltrigger-dash-demo',
      en: '/scrolltrigger-dash-demo',
      nl: '/scrolltrigger-dash-demo',
    },
    '/scrolltrigger-dash-v2-demo': {
      fr: '/scrolltrigger-dash-v2-demo',
      en: '/scrolltrigger-dash-v2-demo',
      nl: '/scrolltrigger-dash-v2-demo',
    },
    '/gta-scroll-reverse-gradient-demo-v2': {
      fr: '/gta-scroll-reverse-gradient-demo-v2',
      en: '/gta-scroll-reverse-gradient-demo-v2',
      nl: '/gta-scroll-reverse-gradient-demo-v2',
    },
    '/gta-scroll-reverse-gradient-demo-v3': {
      fr: '/gta-scroll-reverse-gradient-demo-v3',
      en: '/gta-scroll-reverse-gradient-demo-v3',
      nl: '/gta-scroll-reverse-gradient-demo-v3',
    },
    '/animated-copy-demo': {
      fr: '/animated-copy-demo',
      en: '/animated-copy-demo',
      nl: '/animated-copy-demo',
    },
    '/bennett-clive-demo': {
      fr: '/bennett-clive-demo',
      en: '/bennett-clive-demo',
      nl: '/bennett-clive-demo',
    },
    '/textanimshowcase': {
      fr: '/textanimshowcase',
      en: '/textanimshowcase',
      nl: '/textanimshowcase',
    },
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

