"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const tServices = useTranslations("services");
  const tHubs = useTranslations("hubs");
  const tAbout = useTranslations("about");
  const tCareers = useTranslations("careers");
  const locale = useLocale();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesHovered, setIsServicesHovered] = useState(false);
  const [isHubsHovered, setIsHubsHovered] = useState(false);
  const [isAboutHovered, setIsAboutHovered] = useState(false);
  const [isCareersHovered, setIsCareersHovered] = useState(false);
  const [isLanguageHovered, setIsLanguageHovered] = useState(false);
  
  // Mobile submenu states
  const [isServicesMobileOpen, setIsServicesMobileOpen] = useState(false);
  const [isHubsMobileOpen, setIsHubsMobileOpen] = useState(false);
  const [isAboutMobileOpen, setIsAboutMobileOpen] = useState(false);
  const [isCareersMobileOpen, setIsCareersMobileOpen] = useState(false);
  const [isLanguageMobileOpen, setIsLanguageMobileOpen] = useState(false);

  // Timeout refs for delayed closing
  const servicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hubsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const careersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const languageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to measure navbar width
  const navbarRef = useRef<HTMLElement>(null);
  const [navbarWidth, setNavbarWidth] = useState<string>("80%");

  useEffect(() => {
    const updateNavbarWidth = () => {
      if (navbarRef.current) {
        const width = navbarRef.current.offsetWidth;
        setNavbarWidth(`${width}px`);
      }
    };

    updateNavbarWidth();
    window.addEventListener("resize", updateNavbarWidth);
    return () => window.removeEventListener("resize", updateNavbarWidth);
  }, []);

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

  const servicesSubmenu = [
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
  ];

  const hubsSubmenu = [
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
  ];

  const aboutSubmenu = [
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
  ];

  const careersSubmenu = [
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
  ];

  const navigation = [{ href: "/blog" as const, label: t("blog") }];

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
    isLanguageHovered;

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[80%] max-w-5xl z-50 bg-gradient-to-b from-black/10 via-black/10 to-black/5 ${
        isAnySubmenuOpen ? "" : "backdrop-blur-xl"
      } border-b border-white/10 rounded-lg font-pp-neue-montreal`}
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
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
                  style={{ width: navbarWidth }}
                  onMouseEnter={handleServicesMouseEnter}
                  onMouseLeave={handleServicesMouseLeave}
                >
                  <div className="w-full bg-gradient-to-b from-black/20 via-black/15 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg overflow-hidden flex h-96 p-4">
                    {/* Left Image Section */}
                    <div className="w-96 h-full relative flex-shrink-0 p-4">
                      <div className="w-full h-full relative overflow-hidden rounded-lg">
                        <img
                          src="/slide-1.jpg"
                          alt="Services"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white z-10">
                          {t("services")}
                        </div>
                        <Link
                          href="/services"
                          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
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
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-6 gap-8">
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
                            </Link>
                          ))}
                      </div>
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
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
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
                  style={{ width: navbarWidth }}
                  onMouseEnter={handleHubsMouseEnter}
                  onMouseLeave={handleHubsMouseLeave}
                >
                  <div className="w-full bg-gradient-to-b from-black/20 via-black/15 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg overflow-hidden flex h-96 p-4">
                    {/* Left Image Section */}
                    <div className="w-96 h-full relative flex-shrink-0 p-4">
                      <div className="w-full h-full relative overflow-hidden rounded-lg">
                        <img
                          src="/slide-2.jpg"
                          alt="Hubs"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white z-10">
                          {t("hubs")}
                        </div>
                        <Link
                          href="/hubs"
                          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
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
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-6 gap-8">
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
                            </Link>
                          ))}
                      </div>
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
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
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
                  style={{ width: navbarWidth }}
                  onMouseEnter={handleAboutMouseEnter}
                  onMouseLeave={handleAboutMouseLeave}
                >
                  <div className="w-full bg-gradient-to-b from-black/20 via-black/15 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg overflow-hidden flex h-96 p-4">
                    {/* Left Image Section */}
                    <div className="w-96 h-full relative flex-shrink-0 p-4">
                      <div className="w-full h-full relative overflow-hidden rounded-lg">
                        <img
                          src="/img-1.jpg"
                          alt="About"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white z-10">
                          {t("about")}
                        </div>
                        <Link
                          href="/about"
                          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
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
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-6 gap-8">
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
                            </Link>
                          ))}
                      </div>
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
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
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
                  style={{ width: navbarWidth }}
                  onMouseEnter={handleCareersMouseEnter}
                  onMouseLeave={handleCareersMouseLeave}
                >
                  <div className="w-full bg-gradient-to-b from-black/20 via-black/15 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg overflow-hidden flex h-96 p-4">
                    {/* Left Image Section */}
                    <div className="w-96 h-full relative flex-shrink-0 p-4">
                      <div className="w-full h-full relative overflow-hidden rounded-lg">
                        <img
                          src="/img-2.jpg"
                          alt="Careers"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white z-10">
                          {t("careers")}
                        </div>
                        <Link
                          href="/careers"
                          className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
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
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-6 gap-8">
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
                            </Link>
                          ))}
                      </div>
                      <div className="space-y-6 min-w-[180px]">
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
                              <div className="mb-2">
                                {item.label}
                              </div>
                              <p className="text-sm text-white/60 leading-relaxed">
                                {item.description}
                              </p>
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
            {/* Language Switcher Dropdown - Hidden on mobile when menu is closed */}
            <div
              className="relative hidden md:block"
              onMouseEnter={handleLanguageMouseEnter}
              onMouseLeave={handleLanguageMouseLeave}
            >
              <button
                className={`text-sm transition-colors flex items-center gap-1 cursor-pointer ${
                  isLanguageHovered
                    ? "text-white"
                    : "text-white/90 hover:text-white/60"
                }`}
              >
                {languages.find((lang) => lang.code === locale)?.label || "EN"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isLanguageHovered ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isLanguageHovered && (
                <div
                  className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
                  style={{ width: navbarWidth }}
                  onMouseEnter={handleLanguageMouseEnter}
                  onMouseLeave={handleLanguageMouseLeave}
                >
                  <div className="w-full bg-gradient-to-b from-black/20 via-black/15 to-black/10 backdrop-blur-xl rounded-lg border border-white/10 shadow-lg overflow-hidden flex h-96 p-4">
                    {/* Left Image Section */}
                    <div className="w-96 h-full relative flex-shrink-0 p-4">
                      <div className="w-full h-full relative overflow-hidden rounded-lg">
                        <img
                          src="/img-3.jpg"
                          alt="Language"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white z-10">
                          Language
                        </div>
                      </div>
                    </div>
                    {/* Right Two Columns Section */}
                    <div className="flex p-6 gap-8">
                      <div className="space-y-2 min-w-[180px]">
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

            {/* Contact Link - Hidden on mobile when menu is closed */}
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
                <button
                  onClick={() => setIsServicesMobileOpen(!isServicesMobileOpen)}
                  className={`w-full flex items-center justify-between text-lg transition-colors ${
                    pathname.startsWith("/services")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  <span>{t("services")}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isServicesMobileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isServicesMobileOpen && (
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
                )}
              </div>

              {/* Hubs with Submenu in Mobile */}
              <div>
                <button
                  onClick={() => setIsHubsMobileOpen(!isHubsMobileOpen)}
                  className={`w-full flex items-center justify-between text-lg transition-colors ${
                    pathname.startsWith("/hubs")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  <span>{t("hubs")}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isHubsMobileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isHubsMobileOpen && (
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
                )}
              </div>

              {/* About with Submenu in Mobile */}
              <div>
                <button
                  onClick={() => setIsAboutMobileOpen(!isAboutMobileOpen)}
                  className={`w-full flex items-center justify-between text-lg transition-colors ${
                    pathname.startsWith("/about")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  <span>{t("about")}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isAboutMobileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isAboutMobileOpen && (
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
                )}
              </div>

              {/* Careers with Submenu in Mobile */}
              <div>
                <button
                  onClick={() => setIsCareersMobileOpen(!isCareersMobileOpen)}
                  className={`w-full flex items-center justify-between text-lg transition-colors ${
                    pathname.startsWith("/careers")
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  <span>{t("careers")}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isCareersMobileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isCareersMobileOpen && (
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
                )}
              </div>

              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg transition-colors ${
                    pathname === item.href
                      ? "text-white"
                      : "text-white/90 hover:text-white/60"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Language with Submenu in Mobile */}
              <div>
                <button
                  onClick={() => setIsLanguageMobileOpen(!isLanguageMobileOpen)}
                  className="w-full flex items-center justify-between text-lg text-white/90"
                >
                  <span>Language</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      isLanguageMobileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isLanguageMobileOpen && (
                  <div className="ml-4 mt-2 space-y-2">
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
                )}
              </div>

              <Link
                href="/contact"
                onClick={() => setIsMenuOpen(false)}
                className={`px-6 py-2 bg-[var(--primary)] text-white text-lg font-pp-neue-montreal hover:bg-[#6a02cc] transition-colors rounded-[1px] inline-block ${
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
