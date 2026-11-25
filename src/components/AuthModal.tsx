import React, { useState } from "react";
import { Lock, X } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "../data/plans";
import type { PlanPrice, UserProfile } from "../types";

interface AuthModalProps {
  isOpen: boolean;
  defaultPlanPrice?: PlanPrice;
  onClose: () => void;
  onAuthenticated: (token: string, user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  defaultPlanPrice = 349,
  onClose,
  onAuthenticated,
}) => {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [planPrice, setPlanPrice] = useState<PlanPrice>(defaultPlanPrice);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint =
        mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const payload =
        mode === "register"
          ? { name, company, email, password, planPrice }
          : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setError(
          "Workspace login requires the Node/Express server (static hosting preview has no backend API)."
        );
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        return;
      }
      onAuthenticated(data.token, data.user);
      onClose();
    } catch {
      setError("Network error while contacting authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 min-h-[40px] min-w-[40px] flex items-center justify-center"
          aria-label="Close authentication modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-blue-800">
            <Lock className="h-3.5 w-3.5" />
            <span>Scrypt Hashed · Session Token Verification</span>
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900">
            {mode === "register"
              ? "Create your Bennisaas Solutions LLC workspace"
              : "Sign in to Bennisaas Solutions LLC"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            {mode === "register"
              ? "Provision your encrypted client vault, API connectors, and reporting workspace."
              : "Access your saved integrations, encrypted credentials, and automated reports."}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`rounded-md py-2 text-xs font-semibold transition-colors ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`rounded-md py-2 text-xs font-semibold transition-colors ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "register" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Northbridge Logistics"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-700">
              Password (min. 8 characters)
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                SME Subscription Tier
              </label>
              <select
                value={planPrice}
                onChange={(e) => setPlanPrice(Number(e.target.value) as PlanPrice)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-800 focus:outline-none"
              >
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <option key={plan.price} value={plan.price}>
                    ${plan.price}/mo — {plan.name} ({plan.audience})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900 disabled:opacity-60 transition-colors min-h-[44px]"
          >
            {loading
              ? "Verifying..."
              : mode === "register"
              ? "Create Workspace Account"
              : "Sign In to Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
};
