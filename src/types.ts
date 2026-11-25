export type LocaleCode = "en" | "es" | "fr" | "de" | "hi";

export type AppPage =
  | "home"
  | "about"
  | "solutions"
  | "case-studies"
  | "pricing"
  | "careers"
  | "contact"
  | "workspace";

export type PlanPrice = 249 | 349 | 449 | 549 | 649;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  planPrice: PlanPrice;
  createdAt: string;
}

export interface ApiConnector {
  id: string;
  name: string;
  category: "CRM" | "Payment" | "Messaging";
  status: "connected" | "disconnected";
  endpointUrl: string;
  syncFrequency: string;
  lastSyncedAt: string;
  recordsSynced: number;
}

export interface EmailTrigger {
  id: string;
  name: string;
  eventCondition: string;
  recipientEmail: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  dispatchCount: number;
}

export interface PerformanceReport {
  id: string;
  title: string;
  dimension: string;
  cadence: "Daily" | "Weekly" | "Monthly";
  metricSummary: string;
  conversionRate: number;
  automatedHoursSaved: number;
  createdAt: string;
}

export interface EncryptedVaultItem {
  id: string;
  label: string;
  category: "CRM Token" | "Payment Key" | "Client PII";
  maskedPreview: string;
  iv: string;
  authTag: string;
  ciphertextPreview: string;
  createdAt: string;
}

export interface LeadCampaign {
  id: string;
  title: string;
  targetAudience: string;
  channel: string;
  projectedQualifiedLeads: number;
  contentBrief: string;
  emailSubject: string;
  emailSequenceSummary: string;
  createdAt: string;
}

export interface AiAnalysisResult {
  executiveSummary: string;
  bottleneckDetected: string;
  projectedMonthlyHoursSaved: number;
  recommendedActions: string[];
}

export interface ClientInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  planPrice: number;
  serviceFocus: string;
  message: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  price: PlanPrice;
  name: string;
  audience: string;
  connectorsLimit: string;
  reportsQuota: string;
  aiRunsQuota: string;
  vaultSeats: string;
  sla: string;
  featured?: boolean;
}
