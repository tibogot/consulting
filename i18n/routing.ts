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
    
    // Blog
    '/blog': {
      fr: '/blog',
      en: '/blog',
      nl: '/blog',
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
  },
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

