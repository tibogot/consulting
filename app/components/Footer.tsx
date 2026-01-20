'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('nav');
  const tServices = useTranslations('services');
  const tHubs = useTranslations('hubs');
  const tAbout = useTranslations('about');
  const tCareers = useTranslations('careers');

  const footerLinks = {
    services: [
      { href: '/services/search-selection' as const, label: t('servicesSubmenu.searchSelection') },
      { href: '/services/consulting' as const, label: t('servicesSubmenu.consulting') },
      { href: '/services/managed' as const, label: t('servicesSubmenu.managed') },
    ],
    hubs: [
      { href: '/hubs/technology' as const, label: tHubs('technology.title') },
      { href: '/hubs/engineering' as const, label: tHubs('engineering.title') },
      { href: '/hubs/business-operations' as const, label: tHubs('businessOperations.title') },
    ],
    about: [
      { href: '/about/us' as const, label: tAbout('us.title') },
      { href: '/about/mission' as const, label: tAbout('mission.title') },
      { href: '/about/team' as const, label: tAbout('team.title') },
    ],
    careers: [
      { href: '/careers/find-job' as const, label: tCareers('findJob.title') },
      { href: '/careers/work-at-sparagus' as const, label: tCareers('workAtSparagus.title') },
    ],
  };

  return (
    <footer className="relative bg-black text-white mt-auto z-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-7 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="block mb-4">
              <img
                src="/Sparagus - Icon White.svg"
                alt="Sparagus Logo"
                className="h-16 md:h-20 w-auto"
                width={80}
                height={80}
              />
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Des solutions d'expertes au service de votre succès.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              {t('services')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubs */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              {t('hubs')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.hubs.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              {t('about')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Careers */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              {t('careers')}
            </h3>
            <ul className="space-y-2">
              {footerLinks.careers.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog & Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              {t('blog')}
            </h3>
            <ul className="space-y-2 mb-6">
              <li>
                <Link
                  href={"/blog" as const}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {t('blog')}
                </Link>
              </li>
            </ul>
            <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider">
              {t('contact')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={"/contact" as const}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Sparagus | Tous droits réservés
            </p>
            <div className="flex gap-6">
              <Link
                href={"/legal" as const}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t('legal')}
              </Link>
              <Link
                href={"/cookies" as const}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                {t('cookies')}
              </Link>
            </div>
          </div>
          {/* Debug Links */}
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            <Link
              href={"/gta-scroll-demo" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              GTA Demo
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/gta-scroll-reverse-demo" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              GTA Reverse
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/gta-scroll-reverse-gradient-demo" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              GTA Gradient
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/scrolltrigger-dash-demo" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              ScrollTrigger Dash
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/scrolltrigger-dash-v2-demo" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              ScrollTrigger Dash V2
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/gta-scroll-reverse-gradient-demo-v2" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              GTA Gradient V2
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/gta-scroll-reverse-gradient-demo-v3" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              GTA Gradient V3
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/gradients" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              Gradients
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/animated-copy-demo" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              AnimatedCopy Demo
            </Link>
            <span className="text-gray-600 text-[10px]">|</span>
            <Link
              href={"/clamptest" as const}
              className="text-gray-600 hover:text-gray-400 text-[10px] transition-colors"
            >
              ClampTest
            </Link>
          </div>
        </div>
      </div>
      {/* Footer Logo - Full Width */}
      <div className="w-full px-4 md:px-8">
        <img
          src="/Sparagus - Footer logo.svg"
          alt="Sparagus Footer Logo"
          className="w-full h-auto"
          width={800}
          height={200}
        />
      </div>
    </footer>
  );
}

