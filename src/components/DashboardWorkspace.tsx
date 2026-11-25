import React, { useState } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  CheckCircle2,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  Megaphone,
  Plug,
  Plus,
  Send,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import {
  PREVIEW_CAMPAIGNS,
  PREVIEW_CONNECTORS,
  PREVIEW_REPORTS,
  PREVIEW_TRIGGERS,
  PREVIEW_VAULT,
  SUBSCRIPTION_PLANS,
} from "../data/plans";
import type { TranslationBundle } from "../i18n/translations";
import type {
  AiAnalysisResult,
  ApiConnector,
  EmailTrigger,
  EncryptedVaultItem,
  LeadCampaign,
  LocaleCode,
  PerformanceReport,
  PlanPrice,
  UserProfile,
} from "../types";
import { ChannelAttributionChart, RevenueThroughputChart } from "./Charts";

type WorkspaceTab = "overview" | "connectors" | "reports" | "leads" | "vault";

interface DashboardWorkspaceProps {
  t: TranslationBundle;
  locale: LocaleCode;
  onChangeLocale: (locale: LocaleCode) => void;
  user: UserProfile | null;
  authToken: string | null;
  connectors: ApiConnector[];
  triggers: EmailTrigger[];
  reports: PerformanceReport[];
  vaultItems: EncryptedVaultItem[];
  campaigns: LeadCampaign[];
  loadingWorkspace: boolean;
  onRequireAuth: () => void;
  onSignOut: () => void;
  onRefreshWorkspace: () => Promise<void>;
  onUpdatePlan: (planPrice: PlanPrice) => Promise<void>;
}

export const DashboardWorkspace: React.FC<DashboardWorkspaceProps> = ({
  t,
  locale,
  onChangeLocale,
  user,
  authToken,
  connectors,
  triggers,
  reports,
  vaultItems,
  campaigns,
  loadingWorkspace,
  onRequireAuth,
  onSignOut,
  onRefreshWorkspace,
  onUpdatePlan,
}) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
  const [statusBanner, setStatusBanner] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // AI Data Analysis state
  const [analysisFocus, setAnalysisFocus] = useState(
    "Stripe revenue reconciliation vs HubSpot deal velocity"
  );
  const [analysisNotes, setAnalysisNotes] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiAnalysisResult | null>(null);

  // Report creation state
  const [reportFilter, setReportFilter] = useState("");
  const [newReportTitle, setNewReportTitle] = useState("");
  const [newReportDim, setNewReportDim] = useState("Salesforce + Stripe");
  const [newReportCadence, setNewReportCadence] = useState<
    "Daily" | "Weekly" | "Monthly"
  >("Weekly");

  // Trigger creation state
  const [newTriggerName, setNewTriggerName] = useState("");
  const [newTriggerCondition, setNewTriggerCondition] = useState("");
  const [newTriggerEmail, setNewTriggerEmail] = useState("");

  // Lead campaign generator state
  const [targetAudience, setTargetAudience] = useState(
    "Operations Directors at 30–150 person B2B SaaS firms"
  );
  const [offerGoal, setOfferGoal] = useState(
    "Book qualified workflow automation & reporting consultations"
  );
  const [campaignChannel, setCampaignChannel] = useState(
    "LinkedIn + Automated Email Sequence"
  );
  const [generatingCampaign, setGeneratingCampaign] = useState(false);

  // Vault state
  const [vaultLabel, setVaultLabel] = useState("");
  const [vaultCategory, setVaultCategory] = useState<
    "CRM Token" | "Payment Key" | "Client PII"
  >("CRM Token");
  const [vaultSecret, setVaultSecret] = useState("");
  const [decryptedMap, setDecryptedMap] = useState<Record<string, string>>({});

  // Effective dataset (live authenticated state or rich preview state)
  const displayConnectors = user ? connectors : PREVIEW_CONNECTORS;
  const displayTriggers = user ? triggers : PREVIEW_TRIGGERS;
  const displayReports = user ? reports : PREVIEW_REPORTS;
  const displayVault = user ? vaultItems : PREVIEW_VAULT;
  const displayCampaigns = user ? campaigns : PREVIEW_CAMPAIGNS;

  const activePlan =
    SUBSCRIPTION_PLANS.find((p) => p.price === (user?.planPrice ?? 449)) ??
    SUBSCRIPTION_PLANS[2];

  const requireSignedIn = (): boolean => {
    if (!authToken || !user) {
      onRequireAuth();
      return false;
    }
    return true;
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireSignedIn()) return;
    setStatusBanner(null);
    setAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          focusArea: analysisFocus,
          datasetNotes: analysisNotes,
          language: t.localeLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusBanner({
          type: "error",
          message: data.error || "Unable to complete AI analysis.",
        });
        return;
      }
      setAiAnalysis(data.analysis);
    } catch {
      setStatusBanner({
        type: "error",
        message: "Network error reaching AI analysis endpoint.",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleToggleConnector = async (conn: ApiConnector) => {
    if (!requireSignedIn()) return;
    setStatusBanner(null);
    const nextStatus = conn.status === "connected" ? "disconnected" : "connected";
    const res = await fetch(`/api/workspace/connectors/${conn.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ status: nextStatus }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusBanner({ type: "error", message: data.error });
      return;
    }
    await onRefreshWorkspace();
    setStatusBanner({
      type: "success",
      message: `${conn.name} updated to ${nextStatus}.`,
    });
  };

  const handleCreateTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireSignedIn()) return;
    const res = await fetch("/api/workspace/triggers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        name: newTriggerName,
        eventCondition: newTriggerCondition,
        recipientEmail: newTriggerEmail || user?.email,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusBanner({ type: "error", message: data.error });
      return;
    }
    setNewTriggerName("");
    setNewTriggerCondition("");
    setNewTriggerEmail("");
    await onRefreshWorkspace();
    setStatusBanner({
      type: "success",
      message: "Email notification trigger created.",
    });
  };

  const handleTestTrigger = async (trigger: EmailTrigger) => {
    if (!requireSignedIn()) return;
    const res = await fetch(`/api/workspace/triggers/${trigger.id}/test`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      await onRefreshWorkspace();
      setStatusBanner({
        type: "success",
        message: `Test alert dispatched to ${trigger.recipientEmail}.`,
      });
    }
  };

  const handleToggleTrigger = async (trigger: EmailTrigger) => {
    if (!requireSignedIn()) return;
    const res = await fetch(`/api/workspace/triggers/${trigger.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ enabled: !trigger.enabled }),
    });
    if (res.ok) {
      await onRefreshWorkspace();
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireSignedIn()) return;
    const res = await fetch("/api/workspace/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: newReportTitle,
        dimension: newReportDim,
        cadence: newReportCadence,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusBanner({ type: "error", message: data.error });
      return;
    }
    setNewReportTitle("");
    await onRefreshWorkspace();
    setStatusBanner({ type: "success", message: "Custom automated report saved." });
  };

  const handleDeleteReport = async (id: string) => {
    if (!requireSignedIn()) return;
    const res = await fetch(`/api/workspace/reports/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      await onRefreshWorkspace();
    }
  };

  const handleExportReportsCsv = () => {
    const header = [
      "ID",
      "Title",
      "Dimension",
      "Cadence",
      "Summary",
      "ConversionRatePct",
      "HoursSaved",
    ];
    const rows = displayReports.map((r) => [
      r.id,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.dimension.replace(/"/g, '""')}"`,
      r.cadence,
      `"${r.metricSummary.replace(/"/g, '""')}"`,
      String(r.conversionRate),
      String(r.automatedHoursSaved),
    ]);
    const csv = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bennisaas-solutions-reports.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireSignedIn()) return;
    setStatusBanner(null);
    setGeneratingCampaign(true);
    try {
      const res = await fetch("/api/ai/content-strategy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          targetAudience,
          offerGoal,
          channel: campaignChannel,
          language: t.localeLabel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusBanner({
          type: "error",
          message: data.error || "Unable to generate content strategy.",
        });
        return;
      }
      await onRefreshWorkspace();
      setStatusBanner({
        type: "success",
        message: "Strategic lead-generation campaign created and saved.",
      });
    } catch {
      setStatusBanner({
        type: "error",
        message: "Network error generating content strategy.",
      });
    } finally {
      setGeneratingCampaign(false);
    }
  };

  const handleEncryptVaultItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireSignedIn()) return;
    const res = await fetch("/api/workspace/vault", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        label: vaultLabel,
        category: vaultCategory,
        secretValue: vaultSecret,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusBanner({ type: "error", message: data.error });
      return;
    }
    setVaultLabel("");
    setVaultSecret("");
    await onRefreshWorkspace();
    setStatusBanner({
      type: "success",
      message: "Payload encrypted with AES-256-GCM and stored.",
    });
  };

  const handleToggleDecrypt = async (id: string) => {
    if (!requireSignedIn()) return;
    if (decryptedMap[id]) {
      setDecryptedMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }
    const res = await fetch(`/api/workspace/vault/${id}/decrypt`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await res.json();
    if (!res.ok) {
      setStatusBanner({ type: "error", message: data.error });
      return;
    }
    setDecryptedMap((prev) => ({ ...prev, [id]: data.plaintext }));
  };

  const handleDeleteVaultItem = async (id: string) => {
    if (!requireSignedIn()) return;
    const res = await fetch(`/api/workspace/vault/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      await onRefreshWorkspace();
    }
  };

  const filteredReports = displayReports.filter(
    (r) =>
      r.title.toLowerCase().includes(reportFilter.toLowerCase()) ||
      r.dimension.toLowerCase().includes(reportFilter.toLowerCase())
  );

  const navItems: Array<{
    id: WorkspaceTab;
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: "overview",
      label: t.dashboard.tabs.overview,
      icon: <Activity className="h-4 w-4" />,
    },
    {
      id: "connectors",
      label: t.dashboard.tabs.connectors,
      icon: <Plug className="h-4 w-4" />,
    },
    {
      id: "reports",
      label: t.dashboard.tabs.reports,
      icon: <FileSpreadsheet className="h-4 w-4" />,
    },
    {
      id: "leads",
      label: t.dashboard.tabs.leads,
      icon: <Megaphone className="h-4 w-4" />,
    },
    {
      id: "vault",
      label: t.dashboard.tabs.vault,
      icon: <Lock className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        {/* Sidebar Navigation (240px desktop, scrollable tab strip mobile) */}
        <aside className="border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div className="p-4 lg:p-6">
            <div className="mb-4 hidden lg:block">
              <p className="text-xs font-medium text-slate-500">
                {t.dashboard.activeTier}
              </p>
              <p className="mt-1 font-mono text-sm font-semibold tabular-nums text-slate-900">
                ${activePlan.price}/mo · {activePlan.name}
              </p>
              {user && (
                <p className="mt-0.5 text-xs text-slate-500 truncate">
                  {user.company}
                </p>
              )}
            </div>

            <nav
              aria-label="Workspace sections"
              className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 min-h-[42px] ${
                      isActive
                        ? "bg-blue-800 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {user && (
              <div className="mt-6 hidden border-t border-slate-200 pt-4 lg:block">
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  Switch SME Scale Tier
                </label>
                <select
                  value={user.planPrice}
                  onChange={(e) => onUpdatePlan(Number(e.target.value) as PlanPrice)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs font-medium text-slate-800 focus:border-blue-800 focus:outline-none"
                >
                  {SUBSCRIPTION_PLANS.map((p) => (
                    <option key={p.price} value={p.price}>
                      ${p.price}/mo — {p.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={onSignOut}
                  className="mt-4 flex w-full items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 min-h-[40px]"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t.nav.signOut}</span>
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Workspace Content Viewport */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Top Contextual Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs text-slate-500">
                Bennisaas Solutions LLC Console / {navItems.find((n) => n.id === activeTab)?.label}
              </p>
              <h1 className="mt-0.5 text-xl font-bold text-slate-900">
                {user ? `${user.company} Operations` : "Interactive SME Workspace"}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                <Globe className="h-3.5 w-3.5 text-slate-500" />
                <select
                  aria-label="Workspace language"
                  value={locale}
                  onChange={(e) => onChangeLocale(e.target.value as LocaleCode)}
                  className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                  <option value="fr">FR</option>
                  <option value="de">DE</option>
                  <option value="hi">HI</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleExportReportsCsv}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 min-h-[40px] whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{t.dashboard.exportCsv}</span>
              </button>
            </div>
          </div>

          {/* Preview Notice when unauthenticated */}
          {!user && (
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3.5">
              <p className="text-xs leading-relaxed text-slate-800">
                {t.dashboard.previewNotice}
              </p>
              <button
                type="button"
                onClick={onRequireAuth}
                className="rounded-lg bg-blue-800 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-900 whitespace-nowrap shrink-0 min-h-[40px]"
              >
                {t.dashboard.signInToSave}
              </button>
            </div>
          )}

          {statusBanner && (
            <div
              role="status"
              className={`mb-6 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs font-medium ${
                statusBanner.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-emerald-200 bg-emerald-50 text-emerald-800"
              }`}
            >
              {statusBanner.type === "error" ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              <span>{statusBanner.message}</span>
            </div>
          )}

          {loadingWorkspace ? (
            <div className="space-y-4">
              <div className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white" />
              <div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & INTELLIGENT DATA ANALYSIS */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* 4 KPI Strip */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <p className="text-xs text-slate-500">Connected APIs</p>
                      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
                        {
                          displayConnectors.filter((c) => c.status === "connected")
                            .length
                        }{" "}
                        / {displayConnectors.length}
                      </p>
                      <p className="mt-1 text-xs text-emerald-700 font-medium">
                        Active · Webhook Sync
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <p className="text-xs text-slate-500">Monthly Records Synced</p>
                      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
                        {displayConnectors
                          .reduce((acc, c) => acc + c.recordsSynced, 0)
                          .toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        CRM &amp; Billing Pipelines
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <p className="text-xs text-slate-500">Automated Hours Saved</p>
                      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
                        {displayReports.reduce(
                          (acc, r) => acc + r.automatedHoursSaved,
                          0
                        )}{" "}
                        hrs
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Across {displayReports.length} Scheduled Reports
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                      <p className="text-xs text-slate-500">Vault Encryption</p>
                      <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-slate-900">
                        {displayVault.length} Keys
                      </p>
                      <p className="mt-1 text-xs text-emerald-700 font-medium">
                        Verified · AES-256-GCM
                      </p>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
                      <RevenueThroughputChart />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-5">
                      <ChannelAttributionChart />
                    </div>
                  </div>

                  {/* Intelligent Data Analysis (Gemini Server Route) */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {t.dashboard.analyzeTitle}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Server-side AI operational audit across your connected CRM, payment, and lead datasets.
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleRunAnalysis}
                      className="grid grid-cols-1 gap-4 md:grid-cols-12"
                    >
                      <div className="md:col-span-5">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Analysis Focus
                        </label>
                        <input
                          type="text"
                          required
                          value={analysisFocus}
                          onChange={(e) => setAnalysisFocus(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-5">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Optional Metric Notes / Observations
                        </label>
                        <input
                          type="text"
                          value={analysisNotes}
                          onChange={(e) => setAnalysisNotes(e.target.value)}
                          placeholder="e.g., Q4 enterprise close rate dropped 4% in EMEA"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end md:col-span-2">
                        <button
                          type="submit"
                          disabled={analyzing}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-800 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-900 disabled:opacity-60 min-h-[40px] whitespace-nowrap"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>
                            {analyzing ? "Analyzing..." : t.dashboard.analyzeButton}
                          </span>
                        </button>
                      </div>
                    </form>

                    {aiAnalysis && (
                      <div className="mt-6 grid grid-cols-1 gap-5 border-t border-slate-200 pt-5 lg:grid-cols-12">
                        <div className="lg:col-span-7 space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-slate-500">
                              Executive Summary
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-slate-800">
                              {aiAnalysis.executiveSummary}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-amber-700">
                              Bottleneck Flagged
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              {aiAnalysis.bottleneckDetected}
                            </p>
                          </div>
                        </div>
                        <div className="lg:col-span-5 border-t border-slate-100 pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                          <p className="font-mono text-sm font-bold tabular-nums text-blue-800">
                            +{aiAnalysis.projectedMonthlyHoursSaved} hrs/mo recoverable
                          </p>
                          <ul className="mt-3 space-y-2 text-xs text-slate-700">
                            {aiAnalysis.recommendedActions.map((act, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="font-mono text-slate-400">
                                  0{idx + 1}.
                                </span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: API CONNECTORS & AUTOMATED EMAIL TRIGGERS */}
              {activeTab === "connectors" && (
                <div className="space-y-8">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="text-base font-bold text-slate-900">
                      Third-Party CRM &amp; Payment API Connectors
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Toggle live webhook pipelines and inspect synchronized record counts.
                    </p>

                    <div className="mt-5 overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500">
                            <th className="py-3 pr-4 font-semibold">Integration</th>
                            <th className="py-3 pr-4 font-semibold">Category</th>
                            <th className="py-3 pr-4 font-semibold">Cadence</th>
                            <th className="py-3 pr-4 font-semibold text-right">
                              Records
                            </th>
                            <th className="py-3 pr-4 font-semibold">Status</th>
                            <th className="py-3 text-right font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {displayConnectors.map((conn) => (
                            <tr key={conn.id} className="hover:bg-slate-50">
                              <td className="py-3.5 pr-4">
                                <p className="font-semibold text-slate-900">
                                  {conn.name}
                                </p>
                                <p className="font-mono text-[11px] text-slate-400 truncate max-w-[240px]">
                                  {conn.endpointUrl}
                                </p>
                              </td>
                              <td className="py-3.5 pr-4 text-slate-600">
                                {conn.category}
                              </td>
                              <td className="py-3.5 pr-4 text-slate-600">
                                {conn.syncFrequency}
                              </td>
                              <td className="py-3.5 pr-4 text-right font-mono tabular-nums text-slate-900">
                                {conn.recordsSynced.toLocaleString()}
                              </td>
                              <td className="py-3.5 pr-4">
                                <span
                                  className={`font-medium ${
                                    conn.status === "connected"
                                      ? "text-emerald-700"
                                      : "text-slate-500"
                                  }`}
                                >
                                  {conn.status === "connected"
                                    ? "Connected"
                                    : "Paused"}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleToggleConnector(conn)}
                                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 whitespace-nowrap"
                                >
                                  {conn.status === "connected"
                                    ? "Disconnect"
                                    : "Connect"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Automated Email Notification Triggers */}
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Automated Email Notification Triggers
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Dispatch real-time executive alerts when revenue thresholds or qualified leads trigger.
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleCreateTrigger}
                      className="mt-5 grid grid-cols-1 gap-3 border-b border-slate-200 pb-6 md:grid-cols-12"
                    >
                      <input
                        type="text"
                        required
                        value={newTriggerName}
                        onChange={(e) => setNewTriggerName(e.target.value)}
                        placeholder="Trigger name (e.g., Churn Risk Alert)"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-3"
                      />
                      <input
                        type="text"
                        required
                        value={newTriggerCondition}
                        onChange={(e) => setNewTriggerCondition(e.target.value)}
                        placeholder="Rule condition (e.g., Failed invoice > $500)"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-4"
                      />
                      <input
                        type="email"
                        value={newTriggerEmail}
                        onChange={(e) => setNewTriggerEmail(e.target.value)}
                        placeholder="Recipient email"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-3"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 md:col-span-2 min-h-[38px]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add Rule</span>
                      </button>
                    </form>

                    <div className="mt-4 divide-y divide-slate-100">
                      {displayTriggers.map((trig) => (
                        <div
                          key={trig.id}
                          className="flex flex-wrap items-center justify-between gap-4 py-4"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <Bell className="h-3.5 w-3.5 text-blue-800 shrink-0" />
                              <p className="text-sm font-semibold text-slate-900">
                                {trig.name}
                              </p>
                            </div>
                            <p className="mt-1 text-xs text-slate-600">
                              {trig.eventCondition} · Recipient:{" "}
                              <span className="font-mono text-slate-800">
                                {trig.recipientEmail}
                              </span>
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs tabular-nums text-slate-500">
                              {trig.dispatchCount} sent
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTestTrigger(trig)}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              <Send className="h-3 w-3" />
                              <span>Test Dispatch</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleTrigger(trig)}
                              className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                                trig.enabled
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {trig.enabled ? "Enabled" : "Disabled"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CUSTOM REPORTING */}
              {activeTab === "reports" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="text-base font-bold text-slate-900">
                      Create Custom Automated Report
                    </h3>
                    <form
                      onSubmit={handleCreateReport}
                      className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12"
                    >
                      <input
                        type="text"
                        required
                        value={newReportTitle}
                        onChange={(e) => setNewReportTitle(e.target.value)}
                        placeholder="Report title (e.g., EMEA Paid Lead Conversion)"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-5"
                      />
                      <input
                        type="text"
                        required
                        value={newReportDim}
                        onChange={(e) => setNewReportDim(e.target.value)}
                        placeholder="Connected sources"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-3"
                      />
                      <select
                        value={newReportCadence}
                        onChange={(e) =>
                          setNewReportCadence(
                            e.target.value as "Daily" | "Weekly" | "Monthly"
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-2"
                      >
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg bg-blue-800 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-900 md:col-span-2 min-h-[38px]"
                      >
                        Schedule Report
                      </button>
                    </form>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900">
                        Performance Reports Library
                      </h3>
                      <input
                        type="search"
                        value={reportFilter}
                        onChange={(e) => setReportFilter(e.target.value)}
                        placeholder="Filter reports..."
                        className="w-full sm:w-64 rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-900 focus:border-blue-800 focus:outline-none"
                      />
                    </div>

                    {filteredReports.length === 0 ? (
                      <div className="py-10 text-center text-xs text-slate-500">
                        No reports match your filter. Clear search or schedule a new report above.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500">
                              <th className="py-3 pr-4 font-semibold">Report</th>
                              <th className="py-3 pr-4 font-semibold">Cadence</th>
                              <th className="py-3 pr-4 font-semibold text-right">
                                Conv Rate
                              </th>
                              <th className="py-3 pr-4 font-semibold text-right">
                                Hours Saved
                              </th>
                              <th className="py-3 text-right font-semibold">Remove</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {filteredReports.map((rep) => (
                              <tr key={rep.id} className="hover:bg-slate-50">
                                <td className="py-3.5 pr-4">
                                  <p className="font-semibold text-slate-900">
                                    {rep.title}
                                  </p>
                                  <p className="mt-0.5 text-slate-500">
                                    {rep.dimension} · {rep.metricSummary}
                                  </p>
                                </td>
                                <td className="py-3.5 pr-4 text-slate-700">
                                  {rep.cadence}
                                </td>
                                <td className="py-3.5 pr-4 text-right font-mono tabular-nums text-slate-900">
                                  {rep.conversionRate}%
                                </td>
                                <td className="py-3.5 pr-4 text-right font-mono tabular-nums text-slate-900">
                                  {rep.automatedHoursSaved}h
                                </td>
                                <td className="py-3.5 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteReport(rep.id)}
                                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-700"
                                    aria-label={`Delete ${rep.title}`}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: MARKETING AUTOMATION & STRATEGIC CONTENT CREATION */}
              {activeTab === "leads" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h3 className="text-base font-bold text-slate-900">
                      Strategic Content &amp; Qualified Lead Generator
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Generate B2B editorial briefs and multi-touch email automation sequences tailored to your ICP.
                    </p>

                    <form
                      onSubmit={handleGenerateCampaign}
                      className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-12"
                    >
                      <div className="md:col-span-4">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Target ICP / Audience
                        </label>
                        <input
                          type="text"
                          required
                          value={targetAudience}
                          onChange={(e) => setTargetAudience(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Lead Generation Offer
                        </label>
                        <input
                          type="text"
                          required
                          value={offerGoal}
                          onChange={(e) => setOfferGoal(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-1 block text-xs font-medium text-slate-700">
                          Channel
                        </label>
                        <select
                          value={campaignChannel}
                          onChange={(e) => setCampaignChannel(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none"
                        >
                          <option value="LinkedIn + Email">LinkedIn + Email</option>
                          <option value="SEO Content + Nurture">SEO + Nurture</option>
                          <option value="CRM Reactivation">CRM Reactivation</option>
                        </select>
                      </div>
                      <div className="flex items-end md:col-span-2">
                        <button
                          type="submit"
                          disabled={generatingCampaign}
                          className="w-full rounded-lg bg-blue-800 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-900 disabled:opacity-60 min-h-[38px]"
                        >
                          {generatingCampaign ? "Generating..." : "Create Brief"}
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {displayCampaigns.map((camp) => (
                      <div
                        key={camp.id}
                        className="rounded-xl border border-slate-200 bg-white p-6"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <h4 className="text-base font-bold text-slate-900">
                            {camp.title}
                          </h4>
                          <span className="font-mono text-xs font-semibold tabular-nums text-blue-800">
                            Est. +{camp.projectedQualifiedLeads} qualified leads
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {camp.targetAudience} · {camp.channel}
                        </p>
                        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold text-slate-700">
                              Strategic Content Brief
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                              {camp.contentBrief}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">
                              Automated Sequence · Subject: &ldquo;{camp.emailSubject}&rdquo;
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">
                              {camp.emailSequenceSummary}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: AES-256-GCM ENCRYPTED CLIENT DATA VAULT */}
              {activeTab === "vault" && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <div className="flex items-start gap-3">
                      <Shield className="mt-0.5 h-5 w-5 shrink-0 text-blue-800" />
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          AES-256-GCM Encrypted Client Vault
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-slate-600">
                          Every stored API token, payment webhook secret, or sensitive client identifier is encrypted server-side using a unique 96-bit initialization vector and 128-bit GCM authentication tag.
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleEncryptVaultItem}
                      className="mt-5 grid grid-cols-1 gap-3 border-t border-slate-100 pt-5 md:grid-cols-12"
                    >
                      <input
                        type="text"
                        required
                        value={vaultLabel}
                        onChange={(e) => setVaultLabel(e.target.value)}
                        placeholder="Record label (e.g., HubSpot Production Key)"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-4"
                      />
                      <select
                        value={vaultCategory}
                        onChange={(e) =>
                          setVaultCategory(
                            e.target.value as
                              | "CRM Token"
                              | "Payment Key"
                              | "Client PII"
                          )
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-2"
                      >
                        <option value="CRM Token">CRM Token</option>
                        <option value="Payment Key">Payment Key</option>
                        <option value="Client PII">Client PII</option>
                      </select>
                      <input
                        type="password"
                        required
                        value={vaultSecret}
                        onChange={(e) => setVaultSecret(e.target.value)}
                        placeholder="Sensitive token or client value to encrypt"
                        className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-blue-800 focus:outline-none md:col-span-4"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 md:col-span-2 min-h-[38px]"
                      >
                        <KeyRound className="h-3.5 w-3.5" />
                        <span>Encrypt &amp; Store</span>
                      </button>
                    </form>
                  </div>

                  <div className="space-y-3">
                    {displayVault.map((item) => {
                      const revealed = decryptedMap[item.id];
                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-200 bg-white p-5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {item.label}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-500">
                                {item.category} · Stored:{" "}
                                <span className="font-mono text-slate-800">
                                  {revealed ?? item.maskedPreview}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleDecrypt(item.id)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                              >
                                {revealed ? (
                                  <EyeOff className="h-3.5 w-3.5" />
                                ) : (
                                  <Eye className="h-3.5 w-3.5" />
                                )}
                                <span>{revealed ? "Mask" : "Decrypt"}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteVaultItem(item.id)}
                                className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-700"
                                aria-label={`Delete ${item.label}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-500 sm:grid-cols-3">
                            <p className="truncate">IV: {item.iv}</p>
                            <p className="truncate">Tag: {item.authTag}</p>
                            <p className="truncate">
                              Cipher: {item.ciphertextPreview}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
