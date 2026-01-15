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

  // Timeout refs for delayed closing
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hubsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const careersTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const navigation = [{ href: "/blog" as const, label: t("blog") }];

  const languages = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "nl", label: "NL" },
  ];

  // Check if any submenu is open - if so, remove backdrop-blur from navbar to fix nested backdrop-filter issue
  const isAnySubmenuOpen =
    isServicesHovered || isHubsHovered || isAboutHovered || isCareersHovered;

  return (
    <nav
      className={`fixed top-8 left-1/2 -translate-x-1/2 w-[80%] max-w-5xl z-50 bg-gradient-to-b from-white/10 to-white/5 ${
        isAnySubmenuOpen ? "" : "backdrop-blur-xl backdrop-saturate-150"
      } border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-lg font-pp-neue-montreal`}
    >
      <div className="px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center h-full">
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
            <div
              className="relative"
              onMouseEnter={handleServicesMouseEnter}
              onMouseLeave={handleServicesMouseLeave}
            >
              <button
                className={`text-sm  transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname.startsWith("/services")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("services")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isServicesHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isServicesHovered && (
                <div
                  className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-lg border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex">
                    {/* Left Image Section */}
                    <div className="w-48 h-64 bg-gray-800 relative flex-shrink-0">
                      <div className="absolute bottom-4 left-4 text-white ">
                        {t("services")}
                      </div>
                      <Link
                        href="/services"
                        className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-4 gap-8">
                      <div className="space-y-2 min-w-[180px]">
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
                      <div className="space-y-2 min-w-[180px]">
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
                className={`text-sm transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname.startsWith("/hubs")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("hubs")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isHubsHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isHubsHovered && (
                <div
                  className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleHubsMouseEnter}
                  onMouseLeave={handleHubsMouseLeave}
                >
                  <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-lg border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex">
                    {/* Left Image Section */}
                    <div className="w-48 h-64 bg-gray-800 relative flex-shrink-0">
                      <div className="absolute bottom-4 left-4 text-white ">
                        {t("hubs")}
                      </div>
                      <Link
                        href="/hubs"
                        className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-4 gap-8">
                      <div className="space-y-2 min-w-[180px]">
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
                      <div className="space-y-2 min-w-[180px]">
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
                className={`text-sm transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname.startsWith("/about")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("about")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isAboutHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isAboutHovered && (
                <div
                  className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleAboutMouseEnter}
                  onMouseLeave={handleAboutMouseLeave}
                >
                  <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-lg border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex">
                    {/* Left Image Section */}
                    <div className="w-48 h-64 bg-gray-800 relative flex-shrink-0">
                      <div className="absolute bottom-4 left-4 text-white ">
                        {t("about")}
                      </div>
                      <Link
                        href="/about"
                        className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-4 gap-8">
                      <div className="space-y-2 min-w-[180px]">
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
                      <div className="space-y-2 min-w-[180px]">
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
                className={`text-sm transition-colors flex items-center gap-1 cursor-pointer ${
                  pathname.startsWith("/careers")
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {t("careers")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isCareersHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCareersHovered && (
                <div
                  className="fixed top-24 left-1/2 -translate-x-1/2 z-50"
                  onMouseEnter={handleCareersMouseEnter}
                  onMouseLeave={handleCareersMouseLeave}
                >
                  <div className="bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl backdrop-saturate-150 rounded-lg border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden flex">
                    {/* Left Image Section */}
                    <div className="w-48 h-64 bg-gray-800 relative flex-shrink-0">
                      <div className="absolute bottom-4 left-4 text-white ">
                        {t("careers")}
                      </div>
                      <Link
                        href="/careers"
                        className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
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
                      </Link>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-4 gap-8">
                      <div className="space-y-2 min-w-[180px]">
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
                      <div className="space-y-2 min-w-[180px]">
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

            {/* Other Navigation Items */}
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  pathname === item.href
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher, Contact & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              {languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={pathname}
                  locale={lang.code as "fr" | "en" | "nl"}
                  className={`px-2 py-1 text-sm transition-colors ${
                    locale === lang.code
                      ? "text-white underline"
                      : "text-white/70 hover:text-white/90"
                  }`}
                >
                  {lang.label}
                </Link>
              ))}
            </div>

            {/* Contact Link */}
            <Link
              href="/contact"
              className={`px-4 py-2 bg-[#8202FF] text-white text-sm font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors rounded ${
                pathname === "/contact" ? "bg-[#6a02cc]" : ""
              }`}
            >
              {t("contact")}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
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
                <div className="ml-4 mt-2 space-y-2">
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
                <div className="ml-4 mt-2 space-y-2">
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
                <div className="ml-4 mt-2 space-y-2">
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
                <div className="ml-4 mt-2 space-y-2">
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

              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base transition-colors ${
                    pathname === item.href
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 bg-[#8202FF] text-white text-base font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors rounded inline-block ${
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
