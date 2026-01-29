"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isHubsHovered, setIsHubsHovered] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isCareersHovered, setIsCareersHovered] = useState(false);
  const [isRessourcesHovered, setIsRessourcesHovered] = useState(false);
  const [isLanguageHovered, setIsLanguageHovered] = useState(false);

  // Timeout refs for delayed closing
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hubsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const careersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ressourcesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const languageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleServicesMouseEnter = () => {
    if (servicesTimeoutRef.current) {
      clearTimeout(servicesTimeoutRef.current);
      servicesTimeoutRef.current = null;
    }
    setIsServicesHovered(true);
  };

  const handleServicesMouseLeave = () => {
    servicesTimeoutRef.current = setTimeout(() => {
      setIsServicesHovered(false);
    }, 200);
  };

  const handleHubsMouseEnter = () => {
    if (hubsTimeoutRef.current) {
      clearTimeout(hubsTimeoutRef.current);
      hubsTimeoutRef.current = null;
    }
    setIsHubsHovered(true);
  };

  const handleHubsMouseLeave = () => {
    hubsTimeoutRef.current = setTimeout(() => {
      setIsHubsHovered(false);
    }, 200);
  };

  const handleAboutMouseEnter = () => {
    if (aboutTimeoutRef.current) {
      clearTimeout(aboutTimeoutRef.current);
      aboutTimeoutRef.current = null;
    }
    setIsAboutHovered(true);
  };

  const handleAboutMouseLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setIsAboutHovered(false);
    }, 200);
  };

  const handleCareersMouseEnter = () => {
    if (careersTimeoutRef.current) {
      clearTimeout(careersTimeoutRef.current);
      careersTimeoutRef.current = null;
    }
    setIsCareersHovered(true);
  };

  const handleCareersMouseLeave = () => {
    careersTimeoutRef.current = setTimeout(() => {
      setIsCareersHovered(false);
    }, 200);
  };

  const handleLanguageMouseEnter = () => {
    if (languageTimeoutRef.current) {
      clearTimeout(languageTimeoutRef.current);
      languageTimeoutRef.current = null;
    }
    setIsLanguageHovered(true);
  };

  const handleLanguageMouseLeave = () => {
    languageTimeoutRef.current = setTimeout(() => {
      setIsLanguageHovered(false);
    }, 200);
  };

  const handleRessourcesMouseEnter = () => {
    if (ressourcesTimeoutRef.current) {
      clearTimeout(ressourcesTimeoutRef.current);
      ressourcesTimeoutRef.current = null;
    }
    setIsRessourcesHovered(true);
  };

  const handleRessourcesMouseLeave = () => {
    ressourcesTimeoutRef.current = setTimeout(() => {
      setIsRessourcesHovered(false);
    }, 200);
  };

  const servicesSubmenu = [
    {
      href: "/services/search-selection" as const,
      label: t("servicesSubmenu.searchSelection"),
    },
    {
      href: "/services/consulting" as const,
      label: t("servicesSubmenu.consulting"),
    },
    { href: "/services/managed" as const, label: t("servicesSubmenu.managed") },
  ];

  const hubsSubmenu = [
    { href: "/hubs/technology" as const, label: t("hubsSubmenu.technology") },
    { href: "/hubs/engineering" as const, label: t("hubsSubmenu.engineering") },
    {
      href: "/hubs/business-operations" as const,
      label: t("hubsSubmenu.businessOperations"),
    },
  ];

  const aboutSubmenu = [
    { href: "/about/us" as const, label: t("aboutSubmenu.us") },
    { href: "/about/mission" as const, label: t("aboutSubmenu.mission") },
    { href: "/about/team" as const, label: t("aboutSubmenu.team") },
  ];

  const careersSubmenu = [
    { href: "/careers/find-job" as const, label: t("careersSubmenu.findJob") },
    {
      href: "/careers/work-at-sparagus" as const,
      label: t("careersSubmenu.workAtSparagus"),
    },
  ];

  const ressourcesSubmenu = [
    { href: "/blog" as const, label: t("ressourcesSubmenu.blog") },
    {
      href: "/case-studies" as const,
      label: t("ressourcesSubmenu.caseStudies"),
    },
  ];

  const languages = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "nl", label: "NL" },
  ];

  // Check if any submenu is open - if so, remove backdrop-blur from navbar to fix nested backdrop-filter issue
  const isAnySubmenuOpen =
    isServicesHovered ||
    isHubsHovered ||
    isAboutHovered ||
    isCareersHovered ||
    isRessourcesHovered ||
    isLanguageHovered;

  return (
    <nav
      className={`fixed top-8 left-1/2 z-50 w-[80%] max-w-5xl -translate-x-1/2 bg-gradient-to-b from-black/10 via-black/10 to-black/5 ${
        isAnySubmenuOpen ? "" : "backdrop-blur-xl"
      } rounded-lg border-b border-white/10 font-pp-neue-montreal`}
    >
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex h-full items-center">
            <img
              src="/images/logosvg.svg"
              alt="Sparagus Logo"
              className="h-8 w-auto"
              width={120}
              height={32}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                className={`flex cursor-pointer items-center gap-1 text-sm transition-colors ${
                  pathname.startsWith("/services")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("services")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isServicesHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isServicesHovered && (
                <div
                  className="fixed top-24 left-1/2 z-50 -translate-x-1/2"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <div className="flex overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-black/20 via-black/15 to-black/10 shadow-lg backdrop-blur-xl">
                    {/* Left Image Section */}
                    <div className="relative h-64 w-48 flex-shrink-0 bg-gray-800">
                      <div className="absolute bottom-4 left-4 text-white">
                        {t("services")}
                      </div>
                      <Link
                        href="/services"
                        className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-200"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex gap-8 p-4">
                      <div className="min-w-[180px] space-y-2">
                        {servicesSubmenu
                          .slice(0, Math.ceil(servicesSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                      <div className="min-w-[180px] space-y-2">
                        {servicesSubmenu
                          .slice(Math.ceil(servicesSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Hubs Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleHubsMouseEnter}
              onMouseLeave={handleHubsMouseLeave}
            >
              <button
                className={`flex cursor-pointer items-center gap-1 text-sm transition-colors ${
                  pathname.startsWith("/hubs")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("hubs")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isHubsHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isHubsHovered && (
                <div
                  className="fixed top-24 left-1/2 z-50 -translate-x-1/2"
                  onMouseEnter={handleHubsMouseEnter}
                  onMouseLeave={handleHubsMouseLeave}
                >
                  <div className="flex overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-black/20 via-black/15 to-black/10 shadow-lg backdrop-blur-xl">
                    {/* Left Image Section */}
                    <div className="relative h-64 w-48 flex-shrink-0 bg-gray-800">
                      <div className="absolute bottom-4 left-4 text-white">
                        {t("hubs")}
                      </div>
                      <Link
                        href="/hubs"
                        className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-200"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex gap-8 p-4">
                      <div className="min-w-[180px] space-y-2">
                        {hubsSubmenu
                          .slice(0, Math.ceil(hubsSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                      <div className="min-w-[180px] space-y-2">
                        {hubsSubmenu
                          .slice(Math.ceil(hubsSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleAboutMouseEnter}
              onMouseLeave={handleAboutMouseLeave}
            >
              <button
                className={`flex cursor-pointer items-center gap-1 text-sm transition-colors ${
                  pathname.startsWith("/about")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("about")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isAboutHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isAboutHovered && (
                <div
                  className="fixed top-24 left-1/2 z-50 -translate-x-1/2"
                  onMouseEnter={handleAboutMouseEnter}
                  onMouseLeave={handleAboutMouseLeave}
                >
                  <div className="flex overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-black/20 via-black/15 to-black/10 shadow-lg backdrop-blur-xl">
                    {/* Left Image Section */}
                    <div className="relative h-64 w-48 flex-shrink-0 bg-gray-800">
                      <div className="absolute bottom-4 left-4 text-white">
                        {t("about")}
                      </div>
                      <Link
                        href="/about"
                        className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-200"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex gap-8 p-4">
                      <div className="min-w-[180px] space-y-2">
                        {aboutSubmenu
                          .slice(0, Math.ceil(aboutSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                      <div className="min-w-[180px] space-y-2">
                        {aboutSubmenu
                          .slice(Math.ceil(aboutSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Careers Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleCareersMouseEnter}
              onMouseLeave={handleCareersMouseLeave}
            >
              <button
                className={`flex cursor-pointer items-center gap-1 text-sm transition-colors ${
                  pathname.startsWith("/careers")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("careers")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isCareersHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCareersHovered && (
                <div
                  className="fixed top-24 left-1/2 z-50 -translate-x-1/2"
                  onMouseEnter={handleCareersMouseEnter}
                  onMouseLeave={handleCareersMouseLeave}
                >
                  <div className="flex overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-black/20 via-black/15 to-black/10 shadow-lg backdrop-blur-xl">
                    {/* Left Image Section */}
                    <div className="relative h-64 w-48 flex-shrink-0 bg-gray-800">
                      <div className="absolute bottom-4 left-4 text-white">
                        {t("careers")}
                      </div>
                      <Link
                        href="/careers"
                        className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-200"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex gap-8 p-4">
                      <div className="min-w-[180px] space-y-2">
                        {careersSubmenu
                          .slice(0, Math.ceil(careersSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                      <div className="min-w-[180px] space-y-2">
                        {careersSubmenu
                          .slice(Math.ceil(careersSubmenu.length / 2))
                          .map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`block text-sm transition-colors ${
                                pathname === item.href
                                  ? "text-white"
                                  : "text-white/90 hover:text-white"
                              }`}
                            >
                              {item.label}
                            </Link>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ressources Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleRessourcesMouseEnter}
              onMouseLeave={handleRessourcesMouseLeave}
            >
              <button
                className={`flex cursor-pointer items-center gap-1 text-sm transition-colors ${
                  pathname.startsWith("/blog") ||
                  pathname.startsWith("/case-studies")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("blog")}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isRessourcesHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isRessourcesHovered && (
                <div
                  className="fixed top-24 left-1/2 z-50 -translate-x-1/2"
                  onMouseEnter={handleRessourcesMouseEnter}
                  onMouseLeave={handleRessourcesMouseLeave}
                >
                  <div className="flex overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-black/20 via-black/15 to-black/10 shadow-lg backdrop-blur-xl">
                    {/* Left Image Section */}
                    <div className="relative h-64 w-48 flex-shrink-0 bg-gray-800">
                      <div className="absolute bottom-4 left-4 text-white">
                        {t("blog")}
                      </div>
                      <Link
                        href="/blog"
                        className="absolute right-4 bottom-4 flex h-8 w-8 items-center justify-center rounded-full bg-white transition-colors hover:bg-gray-200"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex gap-8 p-4">
                      <div className="min-w-[180px] space-y-2">
                        {ressourcesSubmenu.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block text-sm transition-colors ${
                              pathname === item.href
                                ? "text-white"
                                : "text-white/90 hover:text-white"
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Language Switcher, Contact & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleLanguageMouseEnter}
              onMouseLeave={handleLanguageMouseLeave}
            >
              <button
                className={`flex cursor-pointer items-center gap-1 text-sm transition-colors ${
                  isLanguageHovered
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {languages.find((lang) => lang.code === locale)?.label || "EN"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isLanguageHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLanguageHovered && (
                <div
                  className="fixed top-24 left-1/2 z-50 -translate-x-1/2"
                  onMouseEnter={handleLanguageMouseEnter}
                  onMouseLeave={handleLanguageMouseLeave}
                >
                  <div className="flex overflow-hidden rounded-lg border border-white/10 bg-gradient-to-b from-black/20 via-black/15 to-black/10 shadow-lg backdrop-blur-xl">
                    {/* Left Image Section */}
                    <div className="relative h-64 w-48 flex-shrink-0 bg-gray-800">
                      <div className="absolute bottom-4 left-4 text-white">
                        Language
                      </div>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex gap-8 p-4">
                      <div className="min-w-[180px] space-y-2">
                        {languages.map((lang) => (
                          <Link
                            key={lang.code}
                            href={pathname}
                            locale={lang.code as "fr" | "en" | "nl"}
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
              )}
            </div>

            {/* Contact Link */}
            <Link
              href="/contact"
              className={`rounded bg-[#8202FF] px-4 py-2 font-pp-neue-montreal text-sm text-white transition-colors hover:bg-[#6a02cc] ${
                pathname === "/contact" ? "bg-[#6a02cc]" : ""
              }`}
            >
              {t("contact")}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white/90 hover:text-white md:hidden"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-white/10 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {/* Services with Submenu in Mobile */}
              <div>
                <Link
                  href="/services"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base transition-colors ${
                    pathname.startsWith("/services")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {t("services")}
                </Link>
                <div className="mt-2 ml-4 space-y-2">
                  {servicesSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm transition-colors ${
                        pathname === item.href
                          ? "text-white"
                          : "text-white/80 hover:text-white/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Hubs with Submenu in Mobile */}
              <div>
                <Link
                  href="/hubs"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base transition-colors ${
                    pathname.startsWith("/hubs")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {t("hubs")}
                </Link>
                <div className="mt-2 ml-4 space-y-2">
                  {hubsSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm transition-colors ${
                        pathname === item.href
                          ? "text-white"
                          : "text-white/80 hover:text-white/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* About with Submenu in Mobile */}
              <div>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base transition-colors ${
                    pathname.startsWith("/about")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {t("about")}
                </Link>
                <div className="mt-2 ml-4 space-y-2">
                  {aboutSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm transition-colors ${
                        pathname === item.href
                          ? "text-white"
                          : "text-white/80 hover:text-white/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Careers with Submenu in Mobile */}
              <div>
                <Link
                  href="/careers"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base transition-colors ${
                    pathname.startsWith("/careers")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {t("careers")}
                </Link>
                <div className="mt-2 ml-4 space-y-2">
                  {careersSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm transition-colors ${
                        pathname === item.href
                          ? "text-white"
                          : "text-white/80 hover:text-white/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Ressources with Submenu in Mobile */}
              <div>
                <Link
                  href="/blog"
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base transition-colors ${
                    pathname.startsWith("/blog") ||
                    pathname.startsWith("/case-studies")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {t("blog")}
                </Link>
                <div className="mt-2 ml-4 space-y-2">
                  {ressourcesSubmenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm transition-colors ${
                        pathname === item.href
                          ? "text-white"
                          : "text-white/80 hover:text-white/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Language with Submenu in Mobile */}
              <div>
                <div className="text-base text-white/90">Language</div>
                <div className="mt-2 ml-4 space-y-2">
                  {languages.map((lang) => (
                    <Link
                      key={lang.code}
                      href={pathname}
                      locale={lang.code as "fr" | "en" | "nl"}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm transition-colors ${
                        locale === lang.code
                          ? "text-white"
                          : "text-white/80 hover:text-white/60"
                      }`}
                    >
                      {lang.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`inline-block rounded bg-[#8202FF] px-4 py-2 font-pp-neue-montreal text-base text-white transition-colors hover:bg-[#6a02cc] ${
                  pathname === "/contact" ? "bg-[#6a02cc]" : ""
                }`}
              >
                {t("contact")}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
