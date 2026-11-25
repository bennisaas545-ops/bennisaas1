import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  Database,
  Globe,
  Lock,
  MailCheck,
  MapPin,
  Phone,
  Plug,
  ShieldCheck,
} from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../data/plans";
import type { TranslationBundle } from "../i18n/translations";
import type { AppPage, LocaleCode, PlanPrice } from "../types";

const BASE_URL = import.meta.env.BASE_URL || "/";
const HERO_IMG = `${BASE_URL}src/assets/images/hero_ai_workspace_1795336661020.jpg`;
const LEAD_IMG = `${BASE_URL}src/assets/images/service_lead_strategy_1795336661066.jpg`;
const AVATAR_IMG = `${BASE_URL}src/assets/images/avatar_client_ops_1795336660410.jpg`;
const WORKFLOW_GIF = `${BASE_URL}src/assets/images/workflow_live.gif`;
const ANALYTICS_GIF = `${BASE_URL}src/assets/images/analytics_live.gif`;
const MARKETING_GIF = `${BASE_URL}src/assets/images/marketing_lead_live.gif`;

interface PublicPagesProps {
  page: Exclude<AppPage, "workspace">;
  t: TranslationBundle;
  locale: LocaleCode;
  onChangeLocale: (locale: LocaleCode) => void;
  selectedPlanPrice: PlanPrice;
  onSelectPlan: (price: PlanPrice) => void;
  prefilledFocus: string;
  prefilledMessage: string;
  onNavigatePage: (
    page: AppPage,
    options?: { focus?: string; message?: string }
  ) => void;
}

export const PublicPages: React.FC<PublicPagesProps> = ({
  page,
  t,
  locale,
  onChangeLocale,
  selectedPlanPrice,
  onSelectPlan,
  prefilledFocus,
  prefilledMessage,
  onNavigatePage,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [leadImgFailed, setLeadImgFailed] = useState(false);
  const [avatarImgFailed, setAvatarImgFailed] = useState(false);
  const [workflowGifFailed, setWorkflowGifFailed] = useState(false);
  const [analyticsGifFailed, setAnalyticsGifFailed] = useState(false);
  const [marketingGifFailed, setMarketingGifFailed] = useState(false);

  const [caseFilter, setCaseFilter] = useState<string>("all");
  const [careerFilter, setCareerFilter] = useState<string>("all");

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactCompany, setContactCompany] = useState("");
  const [contactPlan, setContactPlan] = useState<PlanPrice>(selectedPlanPrice);
  const [contactFocus, setContactFocus] = useState(
    prefilledFocus || "Workflow Automation & CRM Sync"
  );
  const [contactMessage, setContactMessage] = useState(prefilledMessage || "");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [inquiryRef, setInquiryRef] = useState<string | null>(null);

  useEffect(() => {
    setContactPlan(selectedPlanPrice);
  }, [selectedPlanPrice]);

  useEffect(() => {
    if (prefilledFocus) setContactFocus(prefilledFocus);
    if (prefilledMessage) setContactMessage(prefilledMessage);
  }, [prefilledFocus, prefilledMessage]);

  const handlePlanChoose = (price: PlanPrice) => {
    onSelectPlan(price);
    onNavigatePage("contact", {
      focus: "Workflow Automation & CRM Sync",
      message: `Interested in the $${price}/month SME plan. Looking to integrate our CRM, payment APIs, and automated reporting workflows.`,
    });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          company: contactCompany,
          planPrice: contactPlan,
          serviceFocus: contactFocus,
          message: contactMessage,
        }),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setSubmitError(
          "Static preview detected (backend API unavailable). Please call +91 844 9423 404 or deploy with the Express server to submit online."
        );
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Unable to submit inquiry.");
        return;
      }
      setInquiryRef(data.inquiryId);
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setContactCompany("");
      setContactMessage("");
    } catch {
      setSubmitError("Network error submitting inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const LocaleUtilityBar = (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
      <p className="text-xs font-medium text-slate-600">{t.hero.kicker}</p>
      <div className="flex items-center gap-2">
        <Globe className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
        <label htmlFor="page-locale" className="text-xs text-slate-500">
          {t.hero.languageLabel}
        </label>
        <select
          id="page-locale"
          value={locale}
          onChange={(e) => onChangeLocale(e.target.value as LocaleCode)}
          className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 focus:border-blue-800 focus:outline-none"
        >
          <option value="en">English (EN)</option>
          <option value="es">Español (ES)</option>
          <option value="fr">Français (FR)</option>
          <option value="de">Deutsch (DE)</option>
          <option value="hi">हिन्दी (HI)</option>
        </select>
      </div>
    </div>
  );

  // 1. HOME PAGE
  if (page === "home") {
    const workflowStages = [
      {
        step: "01",
        title: "Ingest & Encrypt",
        detail:
          "Connect Salesforce, HubSpot, Stripe, and Razorpay via verified HTTPS webhooks while isolating client credentials under AES-256-GCM.",
        icon: <Plug className="h-4 w-4 text-blue-800" />,
      },
      {
        step: "02",
        title: "Analyze & Trigger",
        detail:
          "Run AI operational diagnostics on deal velocity and settlement variance, dispatching instant email notifications when thresholds shift.",
        icon: <Bell className="h-4 w-4 text-blue-800" />,
      },
      {
        step: "03",
        title: "Report & Convert",
        detail:
          "Publish automated CSV/executive performance digests and turn CRM win-loss insights into targeted B2B lead-generation campaigns.",
        icon: <BarChart3 className="h-4 w-4 text-blue-800" />,
      },
    ];

    const apiIntegrations = [
      {
        name: "Salesforce CRM",
        scope: "Accounts, Opportunities & Lead Scoring",
        cadence: "15-min bi-directional sync",
      },
      {
        name: "HubSpot Marketing",
        scope: "Contacts, Attribution & Email Workflows",
        cadence: "Real-time webhook stream",
      },
      {
        name: "Stripe Billing",
        scope: "Invoices, MRR Reconciliation & Churn Alerts",
        cadence: "Instant event dispatch",
      },
      {
        name: "Razorpay Enterprise",
        scope: "Multi-currency Settlements & Payout Audits",
        cadence: "Hourly & webhook sync",
      },
      {
        name: "Slack Operations",
        scope: "Revenue Variance & SLA Escalation Channels",
        cadence: "Event-driven notifications",
      },
      {
        name: "Custom REST / SMTP",
        scope: "Private ERP Endpoints & Automated Digests",
        cadence: "Scheduled or on-demand",
      },
    ];

    return (
      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
            {LocaleUtilityBar}

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
              <div className="flex flex-col justify-between lg:col-span-6">
                <div>
                  <h1 className="text-balance text-[clamp(2.25rem,4vw,3.6rem)] font-bold leading-[1.08] tracking-tight text-slate-900">
                    {t.hero.headline}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                    {t.hero.subheadline}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigatePage("workspace")}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900 transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                  >
                    <span>{t.hero.primaryCta}</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigatePage("pricing")}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                  >
                    {t.hero.secondaryCta}
                  </button>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Salesforce · HubSpot · Stripe · Razorpay</span>
                  <span aria-hidden="true">/</span>
                  <span>AES-256-GCM Client Encryption</span>
                  <span aria-hidden="true">/</span>
                  <span>5 Localized Languages</span>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {!heroImgFailed ? (
                    <img
                      src={HERO_IMG}
                      alt="Executive analytics and workflow operations conference studio"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgFailed(true)}
                      className="h-full w-full object-cover aspect-video lg:aspect-auto"
                    />
                  ) : (
                    <div className="flex h-full min-h-[280px] flex-col items-center justify-center bg-slate-900 p-8 text-center text-white">
                      <ShieldCheck className="mb-3 h-8 w-8 text-blue-400" />
                      <p className="text-sm font-semibold">
                        Bennisaas Solutions LLC Operations Studio
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Automated Workflows · Real-Time Data Intelligence
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4-column quantitative proof strip */}
            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-slate-50 p-5">
                <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900">
                  {t.metrics.hoursSavedLabel}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {t.metrics.hoursSavedSub}
                </p>
              </div>
              <div className="bg-slate-50 p-5">
                <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900">
                  {t.metrics.leadLiftLabel}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {t.metrics.leadLiftSub}
                </p>
              </div>
              <div className="bg-slate-50 p-5">
                <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900">
                  {t.metrics.syncAccuracyLabel}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {t.metrics.syncAccuracySub}
                </p>
              </div>
              <div className="bg-slate-50 p-5">
                <p className="font-mono text-2xl font-semibold tabular-nums text-slate-900">
                  {t.metrics.encryptionLabel}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {t.metrics.encryptionSub}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Stage Architecture Overview */}
        <section className="border-b border-slate-200 bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                End-to-end automation from raw API events to executive clarity
              </h2>
              <p className="mt-3 text-base text-slate-600">
                Built specifically for small and mid-sized enterprises seeking predictable operational leverage without maintaining custom glue code.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {!workflowGifFailed ? (
                  <img
                    src={WORKFLOW_GIF}
                    alt="Animated workflow orchestration pipeline syncing CRM, Stripe, AES-256-GCM vault, and automated executive digests"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() => setWorkflowGifFailed(true)}
                    className="w-full aspect-video object-cover bg-slate-50"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-xs font-medium text-slate-600">
                    Live Workflow Orchestration Pipeline Preview
                  </div>
                )}
                <figcaption className="border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Automated API Pipeline</span> — Continuous webhook sync with AES-256-GCM credential protection.
                </figcaption>
              </figure>

              <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {!analyticsGifFailed ? (
                  <img
                    src={ANALYTICS_GIF}
                    alt="Animated real-time revenue and SQL lead telemetry chart with automated reporting alerts"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() => setAnalyticsGifFailed(true)}
                    className="w-full aspect-video object-cover bg-slate-50"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-xs font-medium text-slate-600">
                    Real-Time Revenue &amp; SQL Telemetry Preview
                  </div>
                )}
                <figcaption className="border-t border-slate-200 bg-white px-5 py-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">Intelligent Data Analysis</span> — Live revenue reconciliation, anomaly alerts, and SQL attribution.
                </figcaption>
              </figure>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {workflowStages.map((stage) => (
                <div
                  key={stage.step}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-blue-800">
                      {stage.step}.
                    </span>
                    {stage.icon}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {stage.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Integrated API Ecosystem */}
        <section className="border-b border-slate-200 bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Pre-built connectors for CRM, payments, and operational alerts
                </h2>
                <p className="mt-2 text-sm text-slate-600 sm:text-base">
                  Configure webhook endpoints and automated email triggers in minutes inside your authenticated workspace.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigatePage("solutions")}
                className="text-xs font-semibold text-blue-800 hover:underline underline-offset-4"
              >
                Inspect full platform capabilities →
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {apiIntegrations.map((api) => (
                <div
                  key={api.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                  <h3 className="text-sm font-bold text-slate-900">{api.name}</h3>
                  <p className="mt-1 text-xs text-slate-600">{api.scope}</p>
                  <p className="mt-3 border-t border-slate-200 pt-2.5 font-mono text-[11px] text-slate-500">
                    {api.cadence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Home Page Direct Navigation Directory */}
        <section className="bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <button
                type="button"
                onClick={() => onNavigatePage("solutions")}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 text-left hover:border-blue-800 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-blue-800">
                    {t.nav.solutions}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">
                    Workflow Automation, APIs &amp; Lead Generation
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Explore CRM/payment connectors, custom reporting, encrypted vault storage, and marketing automation.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                  <span>Explore {t.nav.solutions}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigatePage("case-studies")}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 text-left hover:border-blue-800 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-blue-800">
                    {t.nav.caseStudies}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">
                    Verified SME Client Results
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Review measurable close-time reductions, SQL pipeline lift, and reconciliation accuracy across SMEs.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                  <span>View {t.nav.caseStudies}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => onNavigatePage("pricing")}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 text-left hover:border-blue-800 transition-colors"
              >
                <div>
                  <p className="font-mono text-xs font-semibold text-blue-800">
                    {t.nav.pricing}
                  </p>
                  <h2 className="mt-2 text-lg font-bold text-slate-900">
                    SME Plans from $249 to $649/mo
                  </h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Compare five clear monthly subscription tiers scaled for small and mid-sized enterprises.
                  </p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800">
                  <span>Compare {t.nav.pricing}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 2. ABOUT US PAGE
  if (page === "about") {
    const onboardingTimeline = [
      {
        phase: "Week 01",
        title: "API & Encrypted Vault Provisioning",
        summary:
          "Register your SME workspace, store CRM and payment credentials inside the AES-256-GCM vault, and verify webhook signatures.",
      },
      {
        phase: "Week 02",
        title: "Workflow & Email Trigger Mapping",
        summary:
          "Configure revenue variance thresholds, failed invoice alerts, and qualified lead routing rules across Slack and executive email.",
      },
      {
        phase: "Week 03",
        title: "Custom Reporting & Content Engine",
        summary:
          "Launch scheduled weekly reconciliation packs and AI-assisted B2B demand-generation campaigns localized for your target regions.",
      },
      {
        phase: "Ongoing",
        title: "SLA Monitoring & Quarterly Audits",
        summary:
          "Continuous connector health verification, prompt calibration, and direct engineering support via +91 844 9423 404.",
      },
    ];

    const securityControls = [
      {
        control: "AES-256-GCM Authenticated Encryption",
        detail:
          "Every CRM token, payment webhook secret, and sensitive client record uses a unique 96-bit random IV and 128-bit GCM auth tag.",
      },
      {
        control: "Salted Scrypt Password Derivation",
        detail:
          "Account credentials are derived with per-user 16-byte random salts and verified using constant-time comparisons.",
      },
      {
        control: "SSRF-Protected Webhook Endpoints",
        detail:
          "Connector URLs enforce external HTTPS schemes and block private, loopback, and cloud metadata IP ranges.",
      },
      {
        control: "Signed In-Memory Bearer Sessions",
        detail:
          "Authenticated workspace routes validate HMAC-SHA256 tokens held strictly in runtime memory rather than persistent browser storage.",
      },
    ];

    return (
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {LocaleUtilityBar}
            <div className="max-w-3xl">
              <p className="text-xs font-semibold text-blue-800">{t.nav.aboutUs}</p>
              <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t.about.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
                {t.about.subtitle}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {t.about.pillars.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
                >
                  <span className="font-mono text-xs font-semibold text-blue-800">
                    0{idx + 1}.
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    {pillar.title}
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {pillar.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Implementation Timeline */}
        <section className="border-b border-slate-200 bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                How Bennisaas Solutions LLC deploys with your team
              </h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                A structured three-week onboarding methodology tailored for lean operations teams.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {onboardingTimeline.map((item) => (
                <div
                  key={item.phase}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <p className="font-mono text-xs font-semibold text-blue-800">
                    {item.phase}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Architecture */}
        <section className="border-b border-slate-200 bg-white py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Security controls engineered for sensitive enterprise records
              </h2>
              <p className="mt-2 text-sm text-slate-600 sm:text-base">
                Financial reconciliation and CRM pipelines carry regulated customer data; our platform protects every layer by default.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {securityControls.map((sec) => (
                <div
                  key={sec.control}
                  className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6"
                >
                  <Database className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {sec.control}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {sec.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <h2 className="text-2xl font-bold text-slate-900">
                  Corporate Governance &amp; Global Client Support
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                  Bennisaas Solutions LLC operates out of Sheridan, Wyoming with responsive technical support (+91 844 9423 404). Speak directly with our integration architects or launch the live console to test encrypted vault storage and AI data analysis.
                </p>
                <div className="mt-6 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => onNavigatePage("workspace")}
                    className="rounded-lg bg-blue-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-900 min-h-[42px]"
                  >
                    {t.nav.openWorkspace}
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigatePage("contact")}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-900 hover:bg-slate-50 min-h-[42px]"
                  >
                    {t.nav.contactUs}
                  </button>
                </div>
              </div>
              <div className="space-y-4 border-t border-slate-200 pt-6 lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    {t.footer.headquartersHeading}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    30 N Gould St, STE R, Sheridan, WY 82801, USA
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    {t.footer.supportHeading}
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium text-slate-900">
                    +91 844 9423 404
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Cryptographic Standard
                  </p>
                  <p className="mt-1 font-mono text-sm font-medium text-slate-900">
                    AES-256-GCM · Scrypt Key Derivation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 3. SOLUTIONS PAGE
  if (page === "solutions") {
    const detailedModules = [
      {
        category: "CRM & Payment API Connectors",
        items: [
          "Bi-directional Salesforce and HubSpot contact, deal, and attribution syncing",
          "Stripe and Razorpay payment settlement webhooks with automated anomaly flags",
          "Automatic retry queues and cryptographic verification on inbound events",
        ],
      },
      {
        category: "Automated Reporting & Email Triggers",
        items: [
          "Custom daily, weekly, and monthly operational snapshots exportable as CSV",
          "Threshold-based email alerts for MRR drops, failed invoices, and high-score SQLs",
          "Multi-language executive report generation across EN, ES, FR, DE, and HI",
        ],
      },
      {
        category: "Marketing Automation & Strategic Content",
        items: [
          "AI-assisted editorial briefs aligned to real CRM win-loss objection patterns",
          "Multi-touch outbound email nurture sequences with lead qualification scoring",
          "Channel attribution analytics linking organic search and outbound pipeline",
        ],
      },
    ];

    return (
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {LocaleUtilityBar}
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-blue-800">
                  {t.nav.solutions}
                </p>
                <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {t.services.sectionTitle}
                </h1>
                <p className="mt-3 text-base text-slate-600">
                  {t.services.sectionSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigatePage("workspace")}
                className="rounded-lg bg-blue-800 px-5 py-3 text-xs font-semibold text-white hover:bg-blue-900 whitespace-nowrap min-h-[44px]"
              >
                {t.nav.openWorkspace}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {t.services.items.map((item) => (
                <div
                  key={item.number}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
                >
                  <div>
                    <span className="font-mono text-xs font-semibold text-blue-800">
                      {item.number}.
                    </span>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">
                      {item.title}
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                  <p className="mt-6 border-t border-slate-200 pt-4 font-mono text-xs font-medium text-slate-700">
                    {item.outcome}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Functional Breakdown */}
        <section className="border-b border-slate-200 bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-balance text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Technical capabilities included across every SME deployment
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {!workflowGifFailed ? (
                  <img
                    src={WORKFLOW_GIF}
                    alt="Animated workflow orchestration showing CRM and payment connectors streaming into AI diagnostics"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() => setWorkflowGifFailed(true)}
                    className="w-full aspect-video object-cover bg-slate-50"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-xs font-medium text-slate-600">
                    Workflow Orchestration Engine
                  </div>
                )}
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                {!analyticsGifFailed ? (
                  <img
                    src={ANALYTICS_GIF}
                    alt="Animated real-time analytics and custom executive reporting telemetry chart"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={() => setAnalyticsGifFailed(true)}
                    className="w-full aspect-video object-cover bg-slate-50"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-xs font-medium text-slate-600">
                    Automated Analytics &amp; Reporting
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {detailedModules.map((mod) => (
                <div
                  key={mod.category}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-base font-bold text-slate-900">
                    {mod.category}
                  </h3>
                  <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-600">
                    {mod.items.map((line, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-800" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketing Automation & Lead Generation Spotlight */}
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 rounded-xl border border-slate-200 bg-white p-6 sm:p-10 lg:grid-cols-12 lg:items-stretch">
              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {!marketingGifFailed ? (
                    <img
                      src={MARKETING_GIF}
                      alt="Animated marketing automation funnel moving leads from strategic content briefs to booked demos"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => setMarketingGifFailed(true)}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-xs font-medium text-slate-600">
                      Animated Lead Qualification Funnel
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {!leadImgFailed ? (
                    <img
                      src={LEAD_IMG}
                      alt="Strategic content briefs and conversion analytics tablet on desk"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => setLeadImgFailed(true)}
                      className="h-full w-full object-cover aspect-[16/9]"
                    />
                  ) : (
                    <div className="flex h-full min-h-[160px] items-center justify-center bg-slate-100 p-6 text-xs font-medium text-slate-600">
                      Marketing Automation &amp; Content Strategy Briefs
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col justify-between lg:col-span-7">
                <div>
                  <p className="text-xs font-medium text-blue-800">
                    Marketing Automation · Strategic Content Creation · Lead Qualification
                  </p>
                  <h2 className="mt-2 text-balance text-xl font-bold text-slate-900 sm:text-2xl">
                    {t.services.leadSpotlightTitle}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                    {t.services.leadSpotlightBody}
                  </p>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <blockquote className="text-sm leading-relaxed text-slate-800">
                    &ldquo;{t.services.testimonialQuote}&rdquo;
                  </blockquote>
                  <div className="mt-4 flex items-center gap-3">
                    {!avatarImgFailed ? (
                      <img
                        src={AVATAR_IMG}
                        alt={t.services.testimonialAuthor}
                        referrerPolicy="no-referrer"
                        onError={() => setAvatarImgFailed(true)}
                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        MC
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {t.services.testimonialAuthor}
                      </p>
                      <p className="text-xs text-slate-500">
                        {t.services.testimonialRole}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 4. CASE STUDIES PAGE
  if (page === "case-studies") {
    const extraCaseStudy = {
      client: "Mercer & Holt Advisory",
      industry: "B2B Accounting & Tax · 45 Staff",
      metric: "-62% invoice follow-up time · +41% client retainers",
      summary:
        "Connected Stripe recurring retainers to Salesforce case pipelines with automated overdue payment email triggers and weekly partner dashboards.",
    };
    const allCases = [...t.caseStudies.items, extraCaseStudy];

    const filteredCases = allCases.filter((cs) => {
      if (caseFilter === "all") return true;
      return cs.industry.toLowerCase().includes(caseFilter);
    });

    const benchmarkRows = [
      {
        metric: "Monthly Finance & Ops Reporting",
        before: "48 hrs manual CSV compilation",
        after: "2 hrs automated review",
        delta: "-95.8% labor",
      },
      {
        metric: "Payment-to-CRM Reconciliation",
        before: "94.2% manual batch match",
        after: "99.94% real-time webhook",
        delta: "+5.74% accuracy",
      },
      {
        metric: "Inbound Lead Response & Scoring",
        before: "14 hrs average triage delay",
        after: "Under 60 sec automated trigger",
        delta: "+138% SQLs",
      },
      {
        metric: "Sensitive API Key Governance",
        before: "Shared spreadsheets & env files",
        after: "AES-256-GCM encrypted vault",
        delta: "100% audited",
      },
    ];

    return (
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {LocaleUtilityBar}
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-blue-800">
                  {t.nav.caseStudies}
                </p>
                <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {t.caseStudies.title}
                </h1>
                <p className="mt-3 text-base text-slate-600">
                  {t.caseStudies.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
                {[
                  { id: "all", label: "All Industries" },
                  { id: "95", label: "Logistics" },
                  { id: "60", label: "Financial" },
                  { id: "140", label: "Distribution" },
                  { id: "45", label: "Advisory" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCaseFilter(tab.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      caseFilter === tab.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredCases.map((cs) => (
                <div
                  key={cs.client}
                  className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-6 sm:p-8"
                >
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {cs.industry}
                    </p>
                    <h2 className="mt-2 text-xl font-bold text-slate-900">
                      {cs.client}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                      {cs.summary}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-200 pt-4">
                    <p className="font-mono text-xs font-semibold tabular-nums text-blue-800">
                      {cs.metric}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cross-Deployment Benchmark Table */}
        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 lg:col-span-7">
                <h2 className="text-xl font-bold text-slate-900">
                  Before &amp; After SME Operational Benchmarks
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Measured across 90-day post-deployment audits for 25–150 staff enterprises.
                </p>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="py-3 pr-4 font-semibold">Operational Area</th>
                        <th className="py-3 pr-4 font-semibold">Legacy Baseline</th>
                        <th className="py-3 pr-4 font-semibold">With Bennisaas Solutions LLC</th>
                        <th className="py-3 text-right font-semibold">Verified Delta</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {benchmarkRows.map((row) => (
                        <tr key={row.metric} className="hover:bg-slate-50">
                          <td className="py-3.5 pr-4 font-semibold text-slate-900">
                            {row.metric}
                          </td>
                          <td className="py-3.5 pr-4 text-slate-500">{row.before}</td>
                          <td className="py-3.5 pr-4 text-slate-800">{row.after}</td>
                          <td className="py-3.5 text-right font-mono font-semibold tabular-nums text-blue-800">
                            {row.delta}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-5 lg:col-span-5">
                <div>
                  <p className="text-xs font-semibold text-blue-800">
                    Live Telemetry Preview
                  </p>
                  <h3 className="mt-1 text-base font-bold text-slate-900">
                    Continuous Client KPI Tracking
                  </h3>
                </div>
                <div className="my-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {!analyticsGifFailed ? (
                    <img
                      src={ANALYTICS_GIF}
                      alt="Animated revenue and lead qualification performance benchmarks chart"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => setAnalyticsGifFailed(true)}
                      className="w-full aspect-video object-cover"
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-slate-100 p-6 text-xs font-medium text-slate-600">
                      Client Performance Benchmarks Chart
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Every client workspace tracks close-time savings, payment reconciliation rate, and qualified demo velocity automatically.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-900 p-6 sm:p-8 text-white">
              <div>
                <h2 className="text-lg font-bold">
                  Ready to benchmark your CRM and billing workflows?
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  Launch the live console or request an SME architecture review.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => onNavigatePage("workspace")}
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 min-h-[42px]"
                >
                  {t.nav.openWorkspace}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigatePage("contact")}
                  className="rounded-lg border border-slate-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 min-h-[42px]"
                >
                  {t.nav.contactUs}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 5. PRICING PAGE ($249, $349, $449, $549, $649)
  if (page === "pricing") {
    const faqs = [
      {
        q: "Can we scale from $249/mo up to $649/mo without migrating data?",
        a: "Yes. Every tier runs on the same encrypted workspace schema—upgrading immediately expands API connector limits, vault seats, and monthly AI runs.",
      },
      {
        q: "Which payment and CRM systems are supported out of the box?",
        a: "All plans support Salesforce, HubSpot, Stripe, Razorpay, Slack, and custom external HTTPS webhook/SMTP connectors.",
      },
      {
        q: "Are multi-language localization and AES-256-GCM encryption included in Starter ($249)?",
        a: "Yes. All five tiers include English, Spanish, French, German, and Hindi localization plus server-side AES-256-GCM vault protection.",
      },
      {
        q: "How quickly can our team go live after choosing a plan?",
        a: "Starter and Growth workspaces provision immediately upon account creation, with guided API onboarding completed within 5 business days.",
      },
    ];

    return (
      <main className="bg-white">
        <section className="border-b border-slate-200 py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {LocaleUtilityBar}
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-blue-800">{t.nav.pricing}</p>
              <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t.pricing.sectionTitle}
              </h1>
              <p className="mt-3 text-base text-slate-600">
                {t.pricing.sectionSubtitle}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isSelected = selectedPlanPrice === plan.price;
                return (
                  <div
                    key={plan.price}
                    className={`flex flex-col justify-between rounded-xl border p-6 transition-colors ${
                      isSelected
                        ? "border-blue-800 bg-slate-50"
                        : plan.featured
                        ? "border-slate-900 bg-white"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h2 className="text-base font-bold text-slate-900">
                          {plan.name}
                        </h2>
                        {plan.featured && (
                          <span className="text-[11px] font-semibold text-blue-800">
                            Most Selected
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500 min-h-[32px]">
                        {plan.audience}
                      </p>

                      <div className="mt-5 flex items-baseline gap-1 border-b border-slate-100 pb-5">
                        <span className="font-mono text-3xl font-bold tabular-nums text-slate-900">
                          ${plan.price}
                        </span>
                        <span className="text-xs text-slate-500">
                          {t.pricing.perMonth}
                        </span>
                      </div>

                      <dl className="mt-5 space-y-3 text-xs">
                        <div>
                          <dt className="text-slate-400">{t.pricing.colConnectors}</dt>
                          <dd className="mt-0.5 font-medium text-slate-800">
                            {plan.connectorsLimit}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">{t.pricing.colReports}</dt>
                          <dd className="mt-0.5 font-medium text-slate-800">
                            {plan.reportsQuota}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">{t.pricing.colAiRuns}</dt>
                          <dd className="mt-0.5 font-medium text-slate-800">
                            {plan.aiRunsQuota}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">{t.pricing.colVault}</dt>
                          <dd className="mt-0.5 font-medium text-slate-800">
                            {plan.vaultSeats}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-slate-400">{t.pricing.colSla}</dt>
                          <dd className="mt-0.5 font-medium text-slate-800">
                            {plan.sla}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePlanChoose(plan.price)}
                      className={`mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors min-h-[42px] whitespace-nowrap ${
                        isSelected
                          ? "bg-blue-800 text-white hover:bg-blue-900"
                          : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                      <span>
                        {isSelected ? t.pricing.currentPlan : t.pricing.selectPlan}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Full Plan Comparison Matrix & FAQ */}
        <section className="bg-slate-50 py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">
                SME Plan Allocation Matrix
              </h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 pr-4 font-semibold">Capability</th>
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <th key={p.price} className="py-3 px-3 font-mono font-semibold text-slate-900">
                          ${p.price}/mo
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-700">{t.pricing.colConnectors}</td>
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <td key={p.price} className="py-3 px-3 text-slate-800">{p.connectorsLimit}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-700">{t.pricing.colReports}</td>
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <td key={p.price} className="py-3 px-3 text-slate-800">{p.reportsQuota}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-700">{t.pricing.colAiRuns}</td>
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <td key={p.price} className="py-3 px-3 text-slate-800">{p.aiRunsQuota}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-700">{t.pricing.colVault}</td>
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <td key={p.price} className="py-3 px-3 text-slate-800">{p.vaultSeats}</td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-slate-700">{t.pricing.colSla}</td>
                      {SUBSCRIPTION_PLANS.map((p) => (
                        <td key={p.price} className="py-3 px-3 text-slate-800">{p.sla}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {faqs.map((faq) => (
                  <div
                    key={faq.q}
                    className="rounded-xl border border-slate-200 bg-white p-6"
                  >
                    <h3 className="text-sm font-bold text-slate-900">{faq.q}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 6. CAREERS PAGE
  if (page === "careers") {
    const extraRole = {
      title: "Solutions Implementation Specialist",
      location: "Remote (APAC / EMEA / US)",
      type: "Full-Time · Client Operations",
      summary:
        "Guide SME finance and sales teams through Salesforce, HubSpot, Stripe, and Razorpay onboarding and custom report setup.",
    };
    const allRoles = [...t.careers.roles, extraRole];

    const filteredRoles = allRoles.filter((role) => {
      if (careerFilter === "all") return true;
      return role.type.toLowerCase().includes(careerFilter);
    });

    const teamPrinciples = [
      {
        title: "Small Senior Pods",
        detail:
          "Engineers work directly with SME operations leaders—no layers of unnecessary bureaucracy between product and customer impact.",
      },
      {
        title: "Security & Reliability Ownership",
        detail:
          "Every engineer owns end-to-end delivery from TypeScript validation and webhook resilience to AES-256-GCM credential protection.",
      },
      {
        title: "Asynchronous Global Collaboration",
        detail:
          "Written technical briefs, clear RFCs, and flexible remote hours across US and international time zones.",
      },
    ];

    return (
      <main className="bg-slate-50">
        <section className="border-b border-slate-200 bg-white py-12 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {LocaleUtilityBar}
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold text-blue-800">
                  {t.nav.careers}
                </p>
                <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {t.careers.title}
                </h1>
                <p className="mt-3 text-base text-slate-600">
                  {t.careers.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-1">
                {[
                  { id: "all", label: "All Teams" },
                  { id: "engineering", label: "Engineering" },
                  { id: "ai", label: "Client AI" },
                  { id: "growth", label: "Growth" },
                  { id: "operations", label: "Operations" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCareerFilter(tab.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      careerFilter === tab.id
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50">
              {filteredRoles.map((role) => (
                <div
                  key={role.title}
                  className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8"
                >
                  <div className="max-w-2xl">
                    <p className="text-xs font-medium text-slate-500">
                      {role.location} · {role.type}
                    </p>
                    <h2 className="mt-1 text-lg font-bold text-slate-900">
                      {role.title}
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-600">
                      {role.summary}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onNavigatePage("contact", {
                        focus: "Careers & Engineering Inquiry",
                        message: `Applying for ${role.title} (${role.location}).`,
                      })
                    }
                    className="inline-flex items-center justify-center rounded-lg bg-blue-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-900 whitespace-nowrap shrink-0 min-h-[42px]"
                  >
                    {t.careers.applyButton}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900">
              How Our Team Works
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
              {teamPrinciples.map((tp) => (
                <div
                  key={tp.title}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="text-sm font-bold text-slate-900">{tp.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {tp.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  // 7. CONTACT US PAGE
  return (
    <main className="bg-slate-50">
      <section className="py-12 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {LocaleUtilityBar}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold text-blue-800">
                {t.nav.contactUs}
              </p>
              <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {t.contact.sectionTitle}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {t.contact.sectionSubtitle}
              </p>

              <div className="mt-8 space-y-5 border-t border-slate-200 pt-6 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" />
                  <div>
                    <p className="font-semibold text-slate-900">
                      Encrypted Client Submission
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Inquiry records and API architecture notes are stored under server-side AES-256-GCM controls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-200 pt-4">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {t.footer.supportHeading}
                    </p>
                    <a
                      href="tel:+918449423404"
                      className="mt-0.5 inline-block font-mono text-sm font-medium text-slate-800 hover:text-blue-800"
                    >
                      +91 844 9423 404
                    </a>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Mon–Sat · Direct Architecture &amp; Billing Line
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-slate-200 pt-4">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-800" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900">
                      {t.footer.headquartersHeading}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-600">
                      30 N Gould St, STE R, Sheridan, WY 82801, USA
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <p className="text-xs font-semibold text-slate-900">
                    What happens after you submit
                  </p>
                  <ol className="mt-2.5 space-y-2 text-xs text-slate-600">
                    <li>01. Instant encrypted reference ID generated for tracking.</li>
                    <li>02. Solutions architect reviews your CRM &amp; payment stack.</li>
                    <li>03. Tailored rollout schedule delivered within 1 business day.</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
                {inquiryRef ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <MailCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {t.contact.successTitle}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {t.contact.successBody}{" "}
                      <span className="font-mono font-semibold text-slate-900">
                        {inquiryRef}
                      </span>
                      .
                    </p>
                    <button
                      type="button"
                      onClick={() => setInquiryRef(null)}
                      className="mt-6 rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 min-h-[42px]"
                    >
                      {t.contact.sendAnother}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {submitError && (
                      <div
                        role="alert"
                        className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800"
                      >
                        {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-1 block text-xs font-medium text-slate-700"
                        >
                          {t.contact.nameLabel}
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="Elena Rostova"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-1 block text-xs font-medium text-slate-700"
                        >
                          {t.contact.emailLabel}
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="elena@company.com"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-phone"
                          className="mb-1 block text-xs font-medium text-slate-700"
                        >
                          {t.contact.phoneLabel}
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          required
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="+1 307 555 0142"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-company"
                          className="mb-1 block text-xs font-medium text-slate-700"
                        >
                          {t.contact.companyLabel}
                        </label>
                        <input
                          id="contact-company"
                          type="text"
                          value={contactCompany}
                          onChange={(e) => setContactCompany(e.target.value)}
                          placeholder="Northbridge Logistics"
                          className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-tier"
                          className="mb-1 block text-xs font-medium text-slate-700"
                        >
                          {t.contact.tierLabel}
                        </label>
                        <select
                          id="contact-tier"
                          value={contactPlan}
                          onChange={(e) =>
                            setContactPlan(Number(e.target.value) as PlanPrice)
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        >
                          {SUBSCRIPTION_PLANS.map((plan) => (
                            <option key={plan.price} value={plan.price}>
                              ${plan.price}/mo — {plan.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="contact-focus"
                          className="mb-1 block text-xs font-medium text-slate-700"
                        >
                          {t.contact.focusLabel}
                        </label>
                        <select
                          id="contact-focus"
                          value={contactFocus}
                          onChange={(e) => setContactFocus(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        >
                          <option value="Workflow Automation & CRM Sync">
                            Workflow Automation &amp; CRM Sync
                          </option>
                          <option value="Intelligent Data Analysis & Reporting">
                            Intelligent Data Analysis &amp; Reporting
                          </option>
                          <option value="Marketing Automation & Lead Generation">
                            Marketing Automation &amp; Lead Generation
                          </option>
                          <option value="Payment API & Email Triggers">
                            Payment API &amp; Email Triggers
                          </option>
                          <option value="Careers & Engineering Inquiry">
                            Careers &amp; Engineering Inquiry
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-1 block text-xs font-medium text-slate-700"
                      >
                        {t.contact.messageLabel}
                      </label>
                      <textarea
                        id="contact-message"
                        rows={4}
                        required
                        minLength={10}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Describe your CRM, payment gateway, reporting cadence, or career application..."
                        className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-blue-800 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60 transition-colors min-h-[44px]"
                    >
                      {submitting ? t.contact.submitting : t.contact.submitButton}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
