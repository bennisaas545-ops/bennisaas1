import { useCallback, useEffect, useState } from "react";
import { AuthModal } from "./components/AuthModal";
import { DashboardWorkspace } from "./components/DashboardWorkspace";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { PublicPages } from "./components/PublicPages";
import { TRANSLATIONS } from "./i18n/translations";
import type {
  ApiConnector,
  AppPage,
  EmailTrigger,
  EncryptedVaultItem,
  LeadCampaign,
  LocaleCode,
  PerformanceReport,
  PlanPrice,
  UserProfile,
} from "./types";

const PAGE_PATHS: Record<AppPage, string> = {
  home: "/",
  about: "/about",
  solutions: "/solutions",
  "case-studies": "/case-studies",
  pricing: "/pricing",
  careers: "/careers",
  contact: "/contact",
  workspace: "/workspace",
};

function getPageFromPathname(pathname: string): AppPage {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const found = (Object.entries(PAGE_PATHS) as Array<[AppPage, string]>).find(
    ([, path]) => path === normalized
  );
  return found ? found[0] : "home";
}

export default function App() {
  const [locale, setLocale] = useState<LocaleCode>("en");
  const [activePage, setActivePage] = useState<AppPage>(() =>
    getPageFromPathname(window.location.pathname)
  );
  const [selectedPlanPrice, setSelectedPlanPrice] = useState<PlanPrice>(449);
  const [prefilledFocus, setPrefilledFocus] = useState("");
  const [prefilledMessage, setPrefilledMessage] = useState("");

  // In-memory auth session only (never localStorage or sessionStorage)
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Workspace live data for authenticated user
  const [connectors, setConnectors] = useState<ApiConnector[]>([]);
  const [triggers, setTriggers] = useState<EmailTrigger[]>([]);
  const [reports, setReports] = useState<PerformanceReport[]>([]);
  const [vaultItems, setVaultItems] = useState<EncryptedVaultItem[]>([]);
  const [campaigns, setCampaigns] = useState<LeadCampaign[]>([]);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);

  const t = TRANSLATIONS[locale];

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getPageFromPathname(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const pageTitles: Record<AppPage, string> = {
      home: "Bennisaas Solutions LLC – AI Workflow Automation & Analytics",
      about: `${t.nav.aboutUs} – Bennisaas Solutions LLC`,
      solutions: `${t.nav.solutions} – Bennisaas Solutions LLC`,
      "case-studies": `${t.nav.caseStudies} – Bennisaas Solutions LLC`,
      pricing: `${t.nav.pricing} – Bennisaas Solutions LLC`,
      careers: `${t.nav.careers} – Bennisaas Solutions LLC`,
      contact: `${t.nav.contactUs} – Bennisaas Solutions LLC`,
      workspace: `${t.nav.workspace} – Bennisaas Solutions LLC`,
    };
    document.title = pageTitles[activePage];
  }, [activePage, t]);

  const fetchWorkspace = useCallback(async (token: string) => {
    setLoadingWorkspace(true);
    try {
      const res = await fetch("/api/workspace", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setConnectors(data.connectors ?? []);
      setTriggers(data.triggers ?? []);
      setReports(data.reports ?? []);
      setVaultItems(data.vaultItems ?? []);
      setCampaigns(data.campaigns ?? []);
    } finally {
      setLoadingWorkspace(false);
    }
  }, []);

  const handleNavigatePage = (
    page: AppPage,
    options?: { focus?: string; message?: string }
  ) => {
    if (options?.focus !== undefined) setPrefilledFocus(options.focus);
    if (options?.message !== undefined) setPrefilledMessage(options.message);

    setActivePage(page);
    const nextPath = PAGE_PATHS[page];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuthenticated = async (
    token: string,
    authenticatedUser: UserProfile
  ) => {
    setAuthToken(token);
    setUser(authenticatedUser);
    setSelectedPlanPrice(authenticatedUser.planPrice);
    await fetchWorkspace(token);
    handleNavigatePage("workspace");
  };

  const handleSignOut = () => {
    setAuthToken(null);
    setUser(null);
    setConnectors([]);
    setTriggers([]);
    setReports([]);
    setVaultItems([]);
    setCampaigns([]);
  };

  const handleRefreshWorkspace = async () => {
    if (authToken) {
      await fetchWorkspace(authToken);
    }
  };

  const handleUpdatePlan = async (planPrice: PlanPrice) => {
    setSelectedPlanPrice(planPrice);
    if (!authToken) return;
    const res = await fetch("/api/workspace/plan", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ planPrice }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        t={t}
        activePage={activePage}
        user={user}
        onNavigatePage={handleNavigatePage}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <div className="flex-1">
        {activePage === "workspace" ? (
          <DashboardWorkspace
            t={t}
            locale={locale}
            onChangeLocale={setLocale}
            user={user}
            authToken={authToken}
            connectors={connectors}
            triggers={triggers}
            reports={reports}
            vaultItems={vaultItems}
            campaigns={campaigns}
            loadingWorkspace={loadingWorkspace}
            onRequireAuth={() => setAuthModalOpen(true)}
            onSignOut={handleSignOut}
            onRefreshWorkspace={handleRefreshWorkspace}
            onUpdatePlan={handleUpdatePlan}
          />
        ) : (
          <PublicPages
            page={activePage}
            t={t}
            locale={locale}
            onChangeLocale={setLocale}
            selectedPlanPrice={selectedPlanPrice}
            onSelectPlan={(price) => setSelectedPlanPrice(price)}
            prefilledFocus={prefilledFocus}
            prefilledMessage={prefilledMessage}
            onNavigatePage={handleNavigatePage}
          />
        )}
      </div>

      <Footer
        t={t}
        locale={locale}
        onChangeLocale={setLocale}
        onNavigatePage={handleNavigatePage}
      />

      <AuthModal
        isOpen={authModalOpen}
        defaultPlanPrice={selectedPlanPrice}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
}
