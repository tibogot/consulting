"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
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

  const navigation = [
    { href: "/blog" as const, label: t("blog") },
    { href: "/contact" as const, label: t("contact") },
  ];

  const languages = [
    { code: "fr", label: "FR" },
    { code: "en", label: "EN" },
    { code: "nl", label: "NL" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-linear-to-b from-black/10 via-black/10 to-black/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center h-full">
            <img
              src="/images/logosvg.svg"
              alt="Sparagus Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesHovered(true)}
              onMouseLeave={() => setIsServicesHovered(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
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
                <div className="absolute top-full left-0 pt-2 w-56">
                  <div className="bg-linear-to-b from-black/20 via-black/20 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg py-2 z-50">
                    {servicesSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === item.href
                            ? "text-white bg-white/10"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hubs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsHubsHovered(true)}
              onMouseLeave={() => setIsHubsHovered(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
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
                <div className="absolute top-full left-0 pt-2 w-56">
                  <div className="bg-linear-to-b from-black/20 via-black/20 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg py-2 z-50">
                    {hubsSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === item.href
                            ? "text-white bg-white/10"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsAboutHovered(true)}
              onMouseLeave={() => setIsAboutHovered(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
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
                <div className="absolute top-full left-0 pt-2 w-56">
                  <div className="bg-linear-to-b from-black/20 via-black/20 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg py-2 z-50">
                    {aboutSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === item.href
                            ? "text-white bg-white/10"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Careers Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCareersHovered(true)}
              onMouseLeave={() => setIsCareersHovered(false)}
            >
              <button
                className={`text-sm font-medium transition-colors flex items-center gap-1 cursor-pointer ${
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
                <div className="absolute top-full left-0 pt-2 w-56">
                  <div className="bg-linear-to-b from-black/20 via-black/20 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg py-2 z-50">
                    {careersSubmenu.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 text-sm transition-colors ${
                          pathname === item.href
                            ? "text-white bg-white/10"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Other Navigation Items */}
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              {languages.map((lang) => (
                <Link
                  key={lang.code}
                  href={pathname}
                  locale={lang.code as "fr" | "en" | "nl"}
                  className={`px-2 py-1 text-sm font-medium transition-colors ${
                    locale === lang.code
                      ? "text-white underline"
                      : "text-white/70 hover:text-white/90"
                  }`}
                >
                  {lang.label}
                </Link>
              ))}
            </div>

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
                  className={`text-base font-medium transition-colors ${
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
                  className={`text-base font-medium transition-colors ${
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
                  className={`text-base font-medium transition-colors ${
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
                  className={`text-base font-medium transition-colors ${
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
                  className={`text-base font-medium transition-colors ${
                    pathname === item.href
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
