"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useState, useRef, useEffect, useCallback, ComponentProps } from "react";
import { ChevronDown } from "lucide-react";

type AppPathname = ComponentProps<typeof Link>["href"];

// Custom hook for hover with delayed close
function useHoverWithDelay(delay = 150) {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  }, []);

  const onMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, delay);
  }, [delay]);

  const closeImmediately = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(false);
  }, []);

  return { isHovered, onMouseEnter, onMouseLeave, closeImmediately };
}

// Arrow icon component
function ArrowIcon() {
  return (
    <svg
      className="w-4 h-4 text-black"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

// Dropdown menu item type
type SubmenuItem = {
  href: AppPathname;
  label: string;
  description: string;
};

// Desktop dropdown menu component - inline expansion like mobile
function DropdownMenu({
  items,
  image,
  title,
  titleHref,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onLinkClick,
  pathname,
}: {
  items: SubmenuItem[];
  image: string;
  title: string;
  titleHref?: AppPathname;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onLinkClick: () => void;
  pathname: string;
}) {
  const firstColumn = items.slice(0, Math.ceil(items.length / 2));
  const secondColumn = items.slice(Math.ceil(items.length / 2));

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen
          ? "max-h-[800px] opacity-100 translate-y-0"
          : "max-h-0 opacity-0 -translate-y-2"
      }`}
    >
      {/* Invisible bridge to maintain hover state - connects button to dropdown */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "h-4 opacity-0" : "h-0 opacity-0"
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <div className="pt-0 pb-0">
        <div
          className="flex min-h-96 pb-6"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Left Image Section */}
          <div className="w-96 h-96 relative flex-shrink-0 p-4 overflow-hidden rounded-lg">
            <div className="w-full h-full relative overflow-hidden rounded-lg">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white z-10">
                {title}
              </div>
              {titleHref && (
                <Link
                  href={titleHref}
                  onClick={onLinkClick}
                  className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
                >
                  <ArrowIcon />
                </Link>
              )}
            </div>
          </div>
          {/* Right Columns Section */}
          <div className="flex p-6 gap-8">
            {[firstColumn, secondColumn].map((column, colIndex) => (
              <div key={colIndex} className="space-y-6 min-w-[180px]">
                {column.map((item) => (
                  <Link
                    key={item.href as string}
                    href={item.href}
                    onClick={onLinkClick}
                    className={`block text-sm transition-colors ${
                      pathname === item.href
                        ? "text-white"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    <div className="mb-2">{item.label}</div>
                    <p className="text-sm text-white/60">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mobile accordion component
function MobileAccordion({
  title,
  items,
  isOpen,
  onToggle,
  onLinkClick,
  pathname,
  isActive,
  isLanguage = false,
  locale,
}: {
  title: string;
  items: { href: string; label: string; code?: string }[];
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
  pathname: string;
  isActive: boolean;
  isLanguage?: boolean;
  locale?: string;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between text-lg transition-colors ${
          isActive ? "text-white" : "text-white/90 hover:text-white/60"
        }`}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`ml-4 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[400px] opacity-100 translate-y-0 mt-2"
            : "max-h-0 opacity-0 -translate-y-1 mt-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.href + (item.code || "")}
              href={item.href as AppPathname}
              {...(isLanguage && item.code
                ? { locale: item.code as "fr" | "en" | "nl" }
                : {})}
              onClick={onLinkClick}
              className={`block text-base transition-colors ${
                isLanguage
                  ? locale === item.code
                    ? "text-white"
                    : "text-white/80 hover:text-white/60"
                  : pathname === item.href
                    ? "text-white"
                    : "text-white/80 hover:text-white/60"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// Nav button with dropdown trigger
function NavDropdownButton({
  label,
  isHovered,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  isHovered: boolean;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <button
        className={`text-sm transition-colors flex items-center gap-1 cursor-pointer ${
          isActive ? "text-white" : "text-white/90 hover:text-white/60"
        }`}
      >
        {label}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isHovered ? "rotate-180" : ""}`}
        />
      </button>
    </div>
  );
}

export default function Navbar() {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const tHubs = useTranslations("hubs");
  const tAbout = useTranslations("about");
  const tCareers = useTranslations("careers");
  const locale = useLocale();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mobile submenu states
  const [mobileOpenMenu, setMobileOpenMenu] = useState<string | null>(null);

  // Desktop hover states
  const services = useHoverWithDelay();
  const hubs = useHoverWithDelay();
  const about = useHoverWithDelay();
  const careers = useHoverWithDelay();
  const language = useHoverWithDelay();

  // Wrapper functions to close all other menus when opening a new one
  const handleServicesEnter = useCallback(() => {
    hubs.closeImmediately();
    about.closeImmediately();
    careers.closeImmediately();
    language.closeImmediately();
    services.onMouseEnter();
  }, [services, hubs, about, careers, language]);

  const handleHubsEnter = useCallback(() => {
    services.closeImmediately();
    about.closeImmediately();
    careers.closeImmediately();
    language.closeImmediately();
    hubs.onMouseEnter();
  }, [services, hubs, about, careers, language]);

  const handleAboutEnter = useCallback(() => {
    services.closeImmediately();
    hubs.closeImmediately();
    careers.closeImmediately();
    language.closeImmediately();
    about.onMouseEnter();
  }, [services, hubs, about, careers, language]);

  const handleCareersEnter = useCallback(() => {
    services.closeImmediately();
    hubs.closeImmediately();
    about.closeImmediately();
    language.closeImmediately();
    careers.onMouseEnter();
  }, [services, hubs, about, careers, language]);

  const handleLanguageEnter = useCallback(() => {
    services.closeImmediately();
    hubs.closeImmediately();
    about.closeImmediately();
    careers.closeImmediately();
    language.onMouseEnter();
  }, [services, hubs, about, careers, language]);


  // Close all dropdowns immediately when pathname changes (navigation occurs)
  useEffect(() => {
    services.closeImmediately();
    hubs.closeImmediately();
    about.closeImmediately();
    careers.closeImmediately();
    language.closeImmediately();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Menu configurations
  const menuConfigs = {
    services: {
      image: "/images/cards/clay.jpg",
      titleHref: "/services" as const,
      items: [
        {
          href: "/services/search-selection" as const,
          label: t("servicesSubmenu.searchSelection"),
          description: tServices("searchSelection.description"),
        },
        {
          href: "/services/consulting" as const,
          label: t("servicesSubmenu.consulting"),
          description: tServices("consulting.description"),
        },
        {
          href: "/services/managed" as const,
          label: t("servicesSubmenu.managed"),
          description: tServices("managed.description"),
        },
      ],
    },
    hubs: {
      image: "/images/cards/malte.jpg",
      titleHref: "/hubs" as const,
      items: [
        {
          href: "/hubs/technology" as const,
          label: t("hubsSubmenu.technology"),
          description: tHubs("technology.description"),
        },
        {
          href: "/hubs/engineering" as const,
          label: t("hubsSubmenu.engineering"),
          description: tHubs("engineering.description"),
        },
        {
          href: "/hubs/business-operations" as const,
          label: t("hubsSubmenu.businessOperations"),
          description: tHubs("businessOperations.description"),
        },
      ],
    },
    about: {
      image: "/images/cards/charlesdeluvio.jpg",
      titleHref: "/about" as const,
      items: [
        {
          href: "/about/us" as const,
          label: t("aboutSubmenu.us"),
          description: tAbout("us.description"),
        },
        {
          href: "/about/mission" as const,
          label: t("aboutSubmenu.mission"),
          description: tAbout("mission.description"),
        },
        {
          href: "/about/team" as const,
          label: t("aboutSubmenu.team"),
          description: tAbout("team.description"),
        },
      ],
    },
    careers: {
      image: "/images/cards/zac-wolff.jpg",
      titleHref: "/careers" as const,
      items: [
        {
          href: "/careers/find-job" as const,
          label: t("careersSubmenu.findJob"),
          description: tCareers("findJob.description"),
        },
        {
          href: "/careers/work-at-sparagus" as const,
          label: t("careersSubmenu.workAtSparagus"),
          description: tCareers("workAtSparagus.description"),
        },
      ],
    },
    language: {
      image: "/img-3.jpg",
      items: [
        { href: pathname, label: "FR", code: "fr" },
        { href: pathname, label: "EN", code: "en" },
        { href: pathname, label: "NL", code: "nl" },
      ],
    },
  };

  const languages = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "nl", label: "NL" },
  ];

  const isAnySubmenuOpen =
    services.isHovered ||
    hubs.isHovered ||
    about.isHovered ||
    careers.isHovered ||
    language.isHovered;

  const toggleMobileMenu = (menu: string) => {
    setMobileOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileOpenMenu(null);
  };

  return (
    <nav
      className="fixed top-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[80%] max-w-5xl z-50 bg-gradient-to-b from-black/10 via-black/10 to-black/5 backdrop-blur-xl border-b border-white/10 rounded-lg font-pp-neue-montreal transition-all duration-300"
    >
      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" onClick={closeMobileMenu} className="flex items-center h-full">
            <img
              src="/images/logosvg.svg"
              alt="Sparagus Logo"
              className="h-8 w-auto"
              width={120}
              height={32}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div className="relative">
              <NavDropdownButton
                label={t("services")}
                isHovered={services.isHovered}
                isActive={pathname.startsWith("/services")}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={services.onMouseLeave}
              />
            </div>

            {/* Hubs Dropdown */}
            <div className="relative">
              <NavDropdownButton
                label={t("hubs")}
                isHovered={hubs.isHovered}
                isActive={pathname.startsWith("/hubs")}
                onMouseEnter={handleHubsEnter}
                onMouseLeave={hubs.onMouseLeave}
              />
            </div>

            {/* About Dropdown */}
            <div className="relative">
              <NavDropdownButton
                label={t("about")}
                isHovered={about.isHovered}
                isActive={pathname.startsWith("/about")}
                onMouseEnter={handleAboutEnter}
                onMouseLeave={about.onMouseLeave}
              />
            </div>

            {/* Careers Dropdown */}
            <div className="relative">
              <NavDropdownButton
                label={t("careers")}
                isHovered={careers.isHovered}
                isActive={pathname.startsWith("/careers")}
                onMouseEnter={handleCareersEnter}
                onMouseLeave={careers.onMouseLeave}
              />
            </div>

            {/* Blog Link */}
            <Link
              href="/blog"
              className={`text-sm transition-colors ${
                pathname === "/blog"
                  ? "text-white"
                  : "text-white/90 hover:text-white/60"
              }`}
            >
              {t("blog")}
            </Link>
          </div>

          {/* Language Switcher, Contact & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher Dropdown */}
            <div
              className="relative hidden md:block"
              onMouseEnter={handleLanguageEnter}
              onMouseLeave={language.onMouseLeave}
            >
              <button
                className={`text-sm transition-colors flex items-center gap-1 cursor-pointer ${
                  language.isHovered
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {languages.find((lang) => lang.code === locale)?.label || "EN"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    language.isHovered ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Contact Link */}
            <Link
              href="/contact"
              className={`hidden md:block px-6 py-2 bg-[var(--primary)] text-white text-sm font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors rounded-[1px] ${
                pathname === "/contact" ? "bg-[#6a02cc]" : ""
              }`}
            >
              {t("contact")}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() =>
                setIsMenuOpen((open) => {
                  if (open) setMobileOpenMenu(null);
                  return !open;
                })
              }
              className="md:hidden p-2 text-white/90 hover:text-white"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Dropdown Menus - Inline Expansion (always rendered, animated via CSS) */}
        <div className="hidden md:block">
          {/* Services Dropdown */}
          <DropdownMenu
            items={menuConfigs.services.items}
            image={menuConfigs.services.image}
            title={t("services")}
            titleHref={menuConfigs.services.titleHref}
            isOpen={services.isHovered}
            onMouseEnter={handleServicesEnter}
            onMouseLeave={services.onMouseLeave}
            onLinkClick={services.closeImmediately}
            pathname={pathname}
          />

          {/* Hubs Dropdown */}
          <DropdownMenu
            items={menuConfigs.hubs.items}
            image={menuConfigs.hubs.image}
            title={t("hubs")}
            titleHref={menuConfigs.hubs.titleHref}
            isOpen={hubs.isHovered}
            onMouseEnter={handleHubsEnter}
            onMouseLeave={hubs.onMouseLeave}
            onLinkClick={hubs.closeImmediately}
            pathname={pathname}
          />

          {/* About Dropdown */}
          <DropdownMenu
            items={menuConfigs.about.items}
            image={menuConfigs.about.image}
            title={t("about")}
            titleHref={menuConfigs.about.titleHref}
            isOpen={about.isHovered}
            onMouseEnter={handleAboutEnter}
            onMouseLeave={about.onMouseLeave}
            onLinkClick={about.closeImmediately}
            pathname={pathname}
          />

          {/* Careers Dropdown */}
          <DropdownMenu
            items={menuConfigs.careers.items}
            image={menuConfigs.careers.image}
            title={t("careers")}
            titleHref={menuConfigs.careers.titleHref}
            isOpen={careers.isHovered}
            onMouseEnter={handleCareersEnter}
            onMouseLeave={careers.onMouseLeave}
            onLinkClick={careers.closeImmediately}
            pathname={pathname}
          />

          {/* Language Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              language.isHovered
                ? "max-h-[200px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2"
            }`}
          >
            {/* Invisible bridge to maintain hover state */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                language.isHovered ? "h-4 opacity-0" : "h-0 opacity-0"
              }`}
              onMouseEnter={handleLanguageEnter}
              onMouseLeave={language.onMouseLeave}
            />
            <div className="pt-0 pb-2">
              <div
                className="rounded-lg p-6"
                onMouseEnter={handleLanguageEnter}
                onMouseLeave={language.onMouseLeave}
              >
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={pathname}
                      locale={lang.code as "fr" | "en" | "nl"}
                      onClick={language.closeImmediately}
                      className={`block text-sm transition-colors ${
                        locale === lang.code
                          ? "text-white"
                          : "text-white/90 hover:text-white"
                      }`}
                    >
                      {lang.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation (keep mounted so it can animate) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-[900px] opacity-100 translate-y-0 border-t border-white/10"
              : "max-h-0 opacity-0 -translate-y-2 border-t border-transparent pointer-events-none"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="py-4 pb-6">
            <div className="flex flex-col space-y-4">
              <MobileAccordion
                title={t("services")}
                items={menuConfigs.services.items.map((i) => ({ href: i.href, label: i.label }))}
                isOpen={mobileOpenMenu === "services"}
                onToggle={() => toggleMobileMenu("services")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/services")}
              />

              <MobileAccordion
                title={t("hubs")}
                items={menuConfigs.hubs.items.map((i) => ({ href: i.href, label: i.label }))}
                isOpen={mobileOpenMenu === "hubs"}
                onToggle={() => toggleMobileMenu("hubs")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/hubs")}
              />

              <MobileAccordion
                title={t("about")}
                items={menuConfigs.about.items.map((i) => ({ href: i.href, label: i.label }))}
                isOpen={mobileOpenMenu === "about"}
                onToggle={() => toggleMobileMenu("about")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/about")}
              />

              <MobileAccordion
                title={t("careers")}
                items={menuConfigs.careers.items.map((i) => ({ href: i.href, label: i.label }))}
                isOpen={mobileOpenMenu === "careers"}
                onToggle={() => toggleMobileMenu("careers")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/careers")}
              />

              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className={`text-lg transition-colors ${
                  pathname === "/blog"
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("blog")}
              </Link>

              <MobileAccordion
                title="Language"
                items={languages.map((l) => ({ href: pathname, label: l.label, code: l.code }))}
                isOpen={mobileOpenMenu === "language"}
                onToggle={() => toggleMobileMenu("language")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={false}
                isLanguage={true}
                locale={locale}
              />

              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className={`px-6 py-2 bg-[var(--primary)] text-white text-lg font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors rounded-[1px] inline-block ${
                  pathname === "/contact" ? "bg-[#6a02cc]" : ""
                }`}
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
