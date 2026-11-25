import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import type { TranslationBundle } from "../i18n/translations";
import type { AppPage, UserProfile } from "../types";
import { Logo } from "./Logo";

interface HeaderProps {
  t: TranslationBundle;
  activePage: AppPage;
  user: UserProfile | null;
  onNavigatePage: (page: AppPage) => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  t,
  activePage,
  user,
  onNavigatePage,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: AppPage) => {
    setMobileMenuOpen(false);
    onNavigatePage(page);
  };

  const navLinks: Array<{ label: string; page: AppPage }> = [
    { label: t.nav.home, page: "home" },
    { label: t.nav.aboutUs, page: "about" },
    { label: t.nav.solutions, page: "solutions" },
    { label: t.nav.caseStudies, page: "case-studies" },
    { label: t.nav.pricing, page: "pricing" },
    { label: t.nav.careers, page: "careers" },
    { label: t.nav.contactUs, page: "contact" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 lg:gap-6 xl:gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick("home")}
          className="flex items-center min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-800 rounded-md"
          aria-label="Bennisaas Solutions LLC Home"
        >
          <Logo variant="header" />
        </button>

        {/* Zone 2: 7 Clean Single-Line Nav Links visible on all laptops */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-2.5 lg:gap-4 xl:gap-6 text-[12px] lg:text-[13px] xl:text-sm font-medium text-slate-600"
        >
          {navLinks.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.page}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => handleNavClick(item.page)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors ${
                  isActive
                    ? "text-blue-800 underline underline-offset-8 decoration-2 decoration-blue-800"
                    : "hover:text-slate-900 hover:underline underline-offset-8 decoration-slate-300"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={
              activePage !== "workspace"
                ? () => handleNavClick("workspace")
                : onOpenAuth
            }
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-blue-800 px-3 lg:px-3.5 xl:px-4 py-2 text-xs font-semibold text-white hover:bg-blue-900 transition-colors whitespace-nowrap shrink-0 min-h-[38px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            {activePage !== "workspace"
              ? t.nav.openWorkspace
              : user
              ? user.name.split(" ")[0]
              : t.nav.signIn}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-slate-200 p-2.5 text-slate-700 hover:bg-slate-100 min-h-[44px] min-w-[44px]"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => handleNavClick(item.page)}
                  className={`flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-left ${
                    isActive
                      ? "bg-blue-50 text-blue-800 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (activePage !== "workspace") {
                  handleNavClick("workspace");
                } else {
                  onOpenAuth();
                }
              }}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-blue-800 px-4 text-sm font-semibold text-white hover:bg-blue-900"
            >
              {activePage !== "workspace"
                ? t.nav.openWorkspace
                : user
                ? user.name
                : t.nav.signIn}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
