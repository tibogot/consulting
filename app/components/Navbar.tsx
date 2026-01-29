"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  ComponentProps,
} from "react";
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
      className="h-4 w-4 text-black"
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
      className={`overflow-hidden transition-all duration-500 ease-in-out ${
        isOpen
          ? "max-h-[800px] translate-y-0 opacity-100"
          : "max-h-0 -translate-y-2 opacity-0"
      }`}
    >
      {/* Invisible bridge to maintain hover state - connects button to dropdown */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "h-4 opacity-0" : "h-0 opacity-0"
        }`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
      <div className="pt-0 pb-0">
        <div
          className="flex min-h-96 flex-col pb-6 md:flex-row"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {/* Left Image Section */}
          <div className="relative h-64 w-full flex-shrink-0 overflow-hidden rounded-lg p-3 md:h-96 md:w-64 md:p-4 lg:w-80 xl:w-96">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <img
                src={image}
                alt={title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              <div className="absolute bottom-3 left-3 z-10 text-sm text-white md:bottom-4 md:left-4 md:text-base">
                {title}
              </div>
              {titleHref && (
                <Link
                  href={titleHref}
                  onClick={onLinkClick}
                  className="absolute right-3 bottom-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-200 md:right-4 md:bottom-4 md:h-8 md:w-8"
                >
                  <ArrowIcon />
                </Link>
              )}
            </div>
          </div>
          {/* Right Columns Section */}
          <div className="flex gap-4 p-3 md:gap-6 md:p-4 lg:gap-8 lg:p-6">
            {[firstColumn, secondColumn].map((column, colIndex) => (
              <div
                key={colIndex}
                className="min-w-[140px] space-y-4 md:min-w-[160px] md:space-y-6 lg:min-w-[180px]"
              >
                {column.map((item) => (
                  <Link
                    key={item.href as string}
                    href={item.href}
                    onClick={onLinkClick}
                    className={`block text-xs transition-colors md:text-sm ${
                      pathname === item.href
                        ? "text-white"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    <div className="mb-1 md:mb-2">{item.label}</div>
                    <p className="text-xs text-white/60 md:text-sm">
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
  const contentRef = useRef<HTMLDivElement>(null);

  // Blur any focused elements when menu closes
  useEffect(() => {
    if (!isOpen && contentRef.current) {
      const focusedElement = contentRef.current.querySelector(":focus");
      if (focusedElement instanceof HTMLElement) {
        focusedElement.blur();
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    onToggle();
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className={`flex w-full items-center justify-between text-lg transition-colors ${
          isActive ? "text-white" : "text-white/90 hover:text-white/60"
        }`}
      >
        <span>{title}</span>
        <ChevronDown
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <div
        ref={contentRef}
        className={`ml-4 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen
            ? "mt-2 max-h-[400px] translate-y-0 opacity-100"
            : "pointer-events-none mt-0 max-h-0 -translate-y-1 opacity-0"
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
        className={`flex cursor-pointer items-center gap-1 text-xs whitespace-nowrap transition-colors md:text-sm ${
          isActive ? "text-white" : "text-white/90 hover:text-white/60"
        }`}
      >
        {label}
        <ChevronDown
          className={`h-3 w-3 flex-shrink-0 transition-transform md:h-4 md:w-4 ${isHovered ? "rotate-180" : ""}`}
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
  const tBlog = useTranslations("blog");
  const tCaseStudies = useTranslations("caseStudies");
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
  const ressources = useHoverWithDelay();
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
    ressources.closeImmediately();
    language.closeImmediately();
    careers.onMouseEnter();
  }, [services, hubs, about, careers, ressources, language]);

  const handleRessourcesEnter = useCallback(() => {
    services.closeImmediately();
    hubs.closeImmediately();
    about.closeImmediately();
    careers.closeImmediately();
    language.closeImmediately();
    ressources.onMouseEnter();
  }, [services, hubs, about, careers, ressources, language]);

  const handleLanguageEnter = useCallback(() => {
    services.closeImmediately();
    hubs.closeImmediately();
    about.closeImmediately();
    careers.closeImmediately();
    ressources.closeImmediately();
    language.onMouseEnter();
  }, [services, hubs, about, careers, ressources, language]);

  // Close all dropdowns immediately when pathname changes (navigation occurs)
  useEffect(() => {
    services.closeImmediately();
    hubs.closeImmediately();
    about.closeImmediately();
    careers.closeImmediately();
    ressources.closeImmediately();
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
    ressources: {
      image: "/images/cards/charlesdeluvio.jpg",
      titleHref: "/blog" as const,
      items: [
        {
          href: "/blog" as const,
          label: t("ressourcesSubmenu.blog"),
          description: tBlog("subtitle"),
        },
        {
          href: "/case-studies" as const,
          label: t("ressourcesSubmenu.caseStudies"),
          description: tCaseStudies("description"),
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
    ressources.isHovered ||
    language.isHovered;

  const toggleMobileMenu = (menu: string) => {
    setMobileOpenMenu((current) => (current === menu ? null : menu));
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    setMobileOpenMenu(null);
  };

  return (
    <nav className="fixed top-8 right-4 left-4 z-50 max-w-5xl rounded-lg border-b border-white/10 bg-gradient-to-b from-black/10 via-black/10 to-black/5 font-pp-neue-montreal backdrop-blur-xl transition-all duration-300 md:left-1/2 md:w-[90%] md:-translate-x-1/2 lg:w-[80%]">
      <div className="relative px-3 sm:px-4 md:px-5 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            className="flex h-full flex-shrink-0 items-center"
          >
            <img
              src="/images/logosvg.svg"
              alt="Sparagus Logo"
              className="h-8 w-auto"
              width={120}
              height={32}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden min-w-0 flex-1 items-center justify-center space-x-3 md:flex md:space-x-4 lg:space-x-6 xl:space-x-8">
            {/* Services Dropdown */}
            <div className="relative flex-shrink-0">
              <NavDropdownButton
                label={t("services")}
                isHovered={services.isHovered}
                isActive={pathname.startsWith("/services")}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={services.onMouseLeave}
              />
            </div>

            {/* Hubs Dropdown */}
            <div className="relative flex-shrink-0">
              <NavDropdownButton
                label={t("hubs")}
                isHovered={hubs.isHovered}
                isActive={pathname.startsWith("/hubs")}
                onMouseEnter={handleHubsEnter}
                onMouseLeave={hubs.onMouseLeave}
              />
            </div>

            {/* About Dropdown */}
            <div className="relative flex-shrink-0">
              <NavDropdownButton
                label={t("about")}
                isHovered={about.isHovered}
                isActive={pathname.startsWith("/about")}
                onMouseEnter={handleAboutEnter}
                onMouseLeave={about.onMouseLeave}
              />
            </div>

            {/* Careers Dropdown */}
            <div className="relative flex-shrink-0">
              <NavDropdownButton
                label={t("careers")}
                isHovered={careers.isHovered}
                isActive={pathname.startsWith("/careers")}
                onMouseEnter={handleCareersEnter}
                onMouseLeave={careers.onMouseLeave}
              />
            </div>

            {/* Ressources Dropdown */}
            <div className="relative flex-shrink-0">
              <NavDropdownButton
                label={t("blog")}
                isHovered={ressources.isHovered}
                isActive={
                  pathname.startsWith("/blog") ||
                  pathname.startsWith("/case-studies")
                }
                onMouseEnter={handleRessourcesEnter}
                onMouseLeave={ressources.onMouseLeave}
              />
            </div>
          </div>

          {/* Language Switcher, Contact & Mobile Menu Button */}
          <div className="flex flex-shrink-0 items-center space-x-2 md:space-x-3 lg:space-x-4">
            {/* Language Switcher Dropdown */}
            <div
              className="relative hidden flex-shrink-0 md:block"
              onMouseEnter={handleLanguageEnter}
              onMouseLeave={language.onMouseLeave}
            >
              <button
                className={`flex cursor-pointer items-center gap-1 text-sm whitespace-nowrap transition-colors ${
                  language.isHovered
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {languages.find((lang) => lang.code === locale)?.label || "EN"}
                <ChevronDown
                  className={`h-4 w-4 flex-shrink-0 transition-transform ${
                    language.isHovered ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Contact Link */}
            <Link
              href="/contact"
              className={`hidden flex-shrink-0 rounded-[1px] bg-[var(--primary)] px-3 py-2 font-pp-neue-montreal text-xs whitespace-nowrap text-white transition-colors hover:bg-[#6a02cc] md:block md:px-4 md:text-sm lg:px-6 ${
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
              className="relative flex h-6 w-6 flex-col items-center justify-center p-2 text-white/90 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              <span
                className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "translate-y-0 rotate-45" : "-translate-y-2"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
                }`}
              />
              <span
                className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-in-out ${
                  isMenuOpen ? "translate-y-0 -rotate-45" : "translate-y-2"
                }`}
              />
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

          {/* Ressources Dropdown */}
          <DropdownMenu
            items={menuConfigs.ressources.items}
            image={menuConfigs.ressources.image}
            title={t("blog")}
            titleHref={menuConfigs.ressources.titleHref}
            isOpen={ressources.isHovered}
            onMouseEnter={handleRessourcesEnter}
            onMouseLeave={ressources.onMouseLeave}
            onLinkClick={ressources.closeImmediately}
            pathname={pathname}
          />

          {/* Language Dropdown */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              language.isHovered
                ? "max-h-[200px] translate-y-0 opacity-100"
                : "max-h-0 -translate-y-2 opacity-0"
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
          className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
            isMenuOpen
              ? "max-h-[900px] translate-y-0 border-t border-white/10 opacity-100"
              : "pointer-events-none max-h-0 -translate-y-2 border-t border-transparent opacity-0"
          }`}
          aria-hidden={!isMenuOpen}
        >
          <div className="py-4 pb-6">
            <div className="flex flex-col space-y-4">
              <MobileAccordion
                title={t("services")}
                items={menuConfigs.services.items.map((i) => ({
                  href: i.href,
                  label: i.label,
                }))}
                isOpen={mobileOpenMenu === "services"}
                onToggle={() => toggleMobileMenu("services")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/services")}
              />

              <MobileAccordion
                title={t("hubs")}
                items={menuConfigs.hubs.items.map((i) => ({
                  href: i.href,
                  label: i.label,
                }))}
                isOpen={mobileOpenMenu === "hubs"}
                onToggle={() => toggleMobileMenu("hubs")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/hubs")}
              />

              <MobileAccordion
                title={t("about")}
                items={menuConfigs.about.items.map((i) => ({
                  href: i.href,
                  label: i.label,
                }))}
                isOpen={mobileOpenMenu === "about"}
                onToggle={() => toggleMobileMenu("about")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/about")}
              />

              <MobileAccordion
                title={t("careers")}
                items={menuConfigs.careers.items.map((i) => ({
                  href: i.href,
                  label: i.label,
                }))}
                isOpen={mobileOpenMenu === "careers"}
                onToggle={() => toggleMobileMenu("careers")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={pathname.startsWith("/careers")}
              />

              <MobileAccordion
                title={t("blog")}
                items={menuConfigs.ressources.items.map((i) => ({
                  href: i.href,
                  label: i.label,
                }))}
                isOpen={mobileOpenMenu === "ressources"}
                onToggle={() => toggleMobileMenu("ressources")}
                onLinkClick={closeMobileMenu}
                pathname={pathname}
                isActive={
                  pathname.startsWith("/blog") ||
                  pathname.startsWith("/case-studies")
                }
              />

              <MobileAccordion
                title="Language"
                items={languages.map((l) => ({
                  href: pathname,
                  label: l.label,
                  code: l.code,
                }))}
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
                className={`inline-block rounded-[1px] bg-[var(--primary)] px-6 py-2 font-pp-neue-montreal text-lg text-white transition-colors hover:bg-[#6a02cc] ${
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
