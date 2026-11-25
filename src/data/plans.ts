import type {
  ApiConnector,
  EmailTrigger,
  EncryptedVaultItem,
  LeadCampaign,
  PerformanceReport,
  SubscriptionPlan,
} from "../types";

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    price: 249,
    name: "Starter",
    audience: "For early-stage teams (1–10 staff)",
    connectorsLimit: "3 CRM & Payment APIs",
    reportsQuota: "15 automated reports / mo",
    aiRunsQuota: "50 AI analyses & briefs / mo",
    vaultSeats: "2 encrypted vault seats",
    sla: "Next-business-day support",
  },
  {
    price: 349,
    name: "Growth",
    audience: "For small businesses (10–35 staff)",
    connectorsLimit: "6 CRM & Payment APIs",
    reportsQuota: "45 automated reports / mo",
    aiRunsQuota: "150 AI analyses & briefs / mo",
    vaultSeats: "5 encrypted vault seats",
    sla: "8-hour priority response",
  },
  {
    price: 449,
    name: "Scale",
    audience: "For mid-sized enterprises (35–100 staff)",
    connectorsLimit: "12 CRM, Payment & ERP APIs",
    reportsQuota: "Unlimited scheduled reports",
    aiRunsQuota: "400 AI analyses & briefs / mo",
    vaultSeats: "15 encrypted vault seats",
    sla: "4-hour SLA · Webhook audit",
    featured: true,
  },
  {
    price: 549,
    name: "Operations Pro",
    audience: "For multi-department SMEs (100–250 staff)",
    connectorsLimit: "25 bi-directional APIs",
    reportsQuota: "Unlimited custom & executive packs",
    aiRunsQuota: "1,000 AI analyses & briefs / mo",
    vaultSeats: "40 encrypted vault seats",
    sla: "2-hour SLA · Dedicated onboarding",
  },
  {
    price: 649,
    name: "Enterprise Suite",
    audience: "For high-compliance mid-market (250+ staff)",
    connectorsLimit: "Unlimited custom REST & webhook APIs",
    reportsQuota: "Unlimited multi-region reporting",
    aiRunsQuota: "Unlimited AI workflows & content",
    vaultSeats: "Unlimited AES-256-GCM seats",
    sla: "1-hour 24/7 SLA · Custom retention",
  },
];

export const PREVIEW_CONNECTORS: ApiConnector[] = [
  {
    id: "conn_salesforce",
    name: "Salesforce CRM",
    category: "CRM",
    status: "connected",
    endpointUrl: "https://api.salesforce.com/services/data/v61.0",
    syncFrequency: "Every 15 min",
    lastSyncedAt: "2026-11-22T08:12:00.000Z",
    recordsSynced: 14280,
  },
  {
    id: "conn_hubspot",
    name: "HubSpot Marketing",
    category: "CRM",
    status: "connected",
    endpointUrl: "https://api.hubapi.com/crm/v3/objects/contacts",
    syncFrequency: "Real-time webhook",
    lastSyncedAt: "2026-11-22T08:15:00.000Z",
    recordsSynced: 9640,
  },
  {
    id: "conn_stripe",
    name: "Stripe Billing",
    category: "Payment",
    status: "connected",
    endpointUrl: "https://api.stripe.com/v1/events",
    syncFrequency: "Instant webhook",
    lastSyncedAt: "2026-11-22T08:18:00.000Z",
    recordsSynced: 4820,
  },
  {
    id: "conn_razorpay",
    name: "Razorpay Enterprise",
    category: "Payment",
    status: "disconnected",
    endpointUrl: "https://api.razorpay.com/v1/payments",
    syncFrequency: "Hourly batch",
    lastSyncedAt: "2026-11-21T21:00:00.000Z",
    recordsSynced: 0,
  },
  {
    id: "conn_slack",
    name: "Slack Operations",
    category: "Messaging",
    status: "connected",
    endpointUrl: "https://slack.com/api/chat.postMessage",
    syncFrequency: "Event-driven",
    lastSyncedAt: "2026-11-22T08:14:00.000Z",
    recordsSynced: 1295,
  },
];

export const PREVIEW_TRIGGERS: EmailTrigger[] = [
  {
    id: "trig_revenue_drop",
    name: "Weekly MRR Variance Alert",
    eventCondition: "Net revenue delta > 12% vs 30-day rolling baseline",
    recipientEmail: "ops@northbridgelogistics.example",
    enabled: true,
    lastTriggeredAt: "2026-11-22T07:30:00.000Z",
    dispatchCount: 14,
  },
  {
    id: "trig_high_intent",
    name: "Qualified Enterprise Lead Notification",
    eventCondition: "CRM lead score >= 82 and budget tier >= $349/mo",
    recipientEmail: "sales@northbridgelogistics.example",
    enabled: true,
    lastTriggeredAt: "2026-11-22T08:05:00.000Z",
    dispatchCount: 38,
  },
  {
    id: "trig_payment_fail",
    name: "Payment Retry & Churn Prevention",
    eventCondition: "Stripe invoice payment_failed after 1st attempt",
    recipientEmail: "billing@northbridgelogistics.example",
    enabled: true,
    lastTriggeredAt: null,
    dispatchCount: 5,
  },
];

export const PREVIEW_REPORTS: PerformanceReport[] = [
  {
    id: "rep_q4_rev",
    title: "Automated Revenue & Payment Reconciliation",
    dimension: "Stripe + Salesforce Pipeline",
    cadence: "Weekly",
    metricSummary: "$184,200 reconciled across 412 SME accounts",
    conversionRate: 24.8,
    automatedHoursSaved: 46,
    createdAt: "2026-11-21T16:00:00.000Z",
  },
  {
    id: "rep_lead_gen",
    title: "Inbound Content & Lead Attribution Audit",
    dimension: "HubSpot + Organic Search",
    cadence: "Monthly",
    metricSummary: "318 sales-qualified leads with 3.4x pipeline ROI",
    conversionRate: 18.6,
    automatedHoursSaved: 62,
    createdAt: "2026-11-18T11:30:00.000Z",
  },
  {
    id: "rep_sla",
    title: "Workflow Execution & Exception Summary",
    dimension: "Multi-API Orchestrator",
    cadence: "Daily",
    metricSummary: "99.94% automated completion rate across 18,400 tasks",
    conversionRate: 31.2,
    automatedHoursSaved: 29,
    createdAt: "2026-11-22T06:00:00.000Z",
  },
];

export const PREVIEW_VAULT: EncryptedVaultItem[] = [
  {
    id: "vault_sf_01",
    label: "Salesforce Production OAuth Token",
    category: "CRM Token",
    maskedPreview: "sf_l••••••••oken",
    iv: "9a3f18c42b7d9102e4c18a77",
    authTag: "4e19c7b8d2105f6a99310b4c18e2a50d",
    ciphertextPreview: "7b21e4a09f3318c7d51a88e02f14...",
    createdAt: "2026-11-20T14:20:00.000Z",
  },
  {
    id: "vault_stripe_02",
    label: "Stripe Settlement Webhook Secret",
    category: "Payment Key",
    maskedPreview: "rk_l••••••••_key",
    iv: "2c8d45a19f036b88e72d1109",
    authTag: "a71d0e84c52291fb3e6a0944c81f72b1",
    ciphertextPreview: "e9140c7a55b219d803f442a16b08...",
    createdAt: "2026-11-21T09:45:00.000Z",
  },
];

export const PREVIEW_CAMPAIGNS: LeadCampaign[] = [
  {
    id: "camp_b2b_ops",
    title: "Mid-Market Finance Automation Outreach",
    targetAudience: "B2B SaaS CFOs & Controllers (25–150 employees)",
    channel: "LinkedIn + Automated Email Sequence",
    projectedQualifiedLeads: 85,
    contentBrief:
      "3-part benchmarking series detailing how automated Stripe-to-CRM reconciliation eliminates 40+ hours of monthly close labor.",
    emailSubject: "Cutting month-end reconciliation time by 68%",
    emailSequenceSummary:
      "Day 1: Benchmark insight -> Day 4: Case study breakdown -> Day 8: Custom workflow ROI audit invite.",
    createdAt: "2026-11-19T13:10:00.000Z",
  },
];

export const REVENUE_THROUGHPUT_SERIES = [
  { month: "Jun", revenue: 118, automatedTasks: 11200, leads: 142 },
  { month: "Jul", revenue: 131, automatedTasks: 12900, leads: 168 },
  { month: "Aug", revenue: 144, automatedTasks: 14100, leads: 196 },
  { month: "Sep", revenue: 159, automatedTasks: 15800, leads: 241 },
  { month: "Oct", revenue: 172, automatedTasks: 17150, leads: 284 },
  { month: "Nov", revenue: 184, automatedTasks: 18400, leads: 318 },
];

export const ATTRIBUTION_CHANNELS = [
  { channel: "Strategic Content & SEO", leads: 124, conversionRate: 26.4 },
  { channel: "Automated Outbound Email", leads: 92, conversionRate: 19.8 },
  { channel: "CRM Reactivation Triggers", leads: 64, conversionRate: 31.2 },
  { channel: "Partner & Referral API", leads: 38, conversionRate: 28.9 },
];
