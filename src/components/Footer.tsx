import React from "react";
import { MapPin, Phone } from "lucide-react";
import type { TranslationBundle } from "../i18n/translations";
import type { AppPage, LocaleCode } from "../types";
import { Logo } from "./Logo";

interface FooterProps {
  t: TranslationBundle;
  locale: LocaleCode;
  onChangeLocale: (locale: LocaleCode) => void;
  onNavigatePage: (page: AppPage) => void;
}

export const Footer: React.FC<FooterProps> = ({
  t,
  locale,
  onChangeLocale,
  onNavigatePage,
}) => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Brand Summary */}
          <div className="md:col-span-4">
            <Logo variant="footer" />
            <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-600">
              {t.footer.summary}
            </p>
          </div>

          {/* Customer Support Contact Number */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-slate-900">
              {t.footer.supportHeading}
            </h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              <a
                href="tel:+918449423404"
                className="inline-flex items-center gap-2 font-mono font-medium text-slate-900 hover:text-blue-800 transition-colors"
              >
                <Phone className="h-4 w-4 text-blue-800 shrink-0" />
                <span>+91 844 9423 404</span>
              </a>
              <p className="text-xs text-slate-500">
                Mon–Sat · SME Onboarding &amp; API Support
              </p>
            </div>
          </div>

          {/* Corporate Address */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold text-slate-900">
              {t.footer.headquartersHeading}
            </h3>
            <address className="mt-3 flex items-start gap-2 not-italic text-xs leading-relaxed text-slate-600">
              <MapPin className="mt-0.5 h-4 w-4 text-blue-800 shrink-0" />
              <span>30 N Gould St, STE R, Sheridan, WY 82801, USA</span>
            </address>
          </div>

          {/* Language & Page Links */}
          <div className="md:col-span-2">
            <h3 className="text-xs font-semibold text-slate-900">
              {t.footer.languageHeading}
            </h3>
            <select
              aria-label="Footer language selector"
              value={locale}
              onChange={(e) => onChangeLocale(e.target.value as LocaleCode)}
              className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-blue-800 focus:outline-none"
            >
              <option value="en">English (EN)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="hi">हिन्दी (HI)</option>
            </select>

            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => onNavigatePage("about")}
                className="text-left hover:text-slate-900"
              >
                {t.nav.aboutUs}
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage("solutions")}
                className="text-left hover:text-slate-900"
              >
                {t.nav.solutions}
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage("case-studies")}
                className="text-left hover:text-slate-900"
              >
                {t.nav.caseStudies}
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage("pricing")}
                className="text-left hover:text-slate-900"
              >
                {t.nav.pricing}
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage("careers")}
                className="text-left hover:text-slate-900"
              >
                {t.nav.careers}
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage("contact")}
                className="text-left hover:text-slate-900"
              >
                {t.nav.contactUs}
              </button>
              <button
                type="button"
                onClick={() => onNavigatePage("workspace")}
                className="text-left hover:text-slate-900 col-span-2"
              >
                {t.nav.workspace}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6 text-xs text-slate-500">
          <p>{t.footer.copyright}</p>
          <p className="font-mono">{t.footer.securityNote}</p>
        </div>
      </div>
    </footer>
  );
};
