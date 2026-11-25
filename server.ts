import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import express, { type NextFunction, type Request, type Response } from "express";
import { createServer as createViteServer } from "vite";

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const SESSION_SECRET =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16
    ? process.env.SESSION_SECRET
    : crypto.randomBytes(32).toString("hex");

const ENCRYPTION_KEY = crypto.scryptSync(
  process.env.ENCRYPTION_KEY || SESSION_SECRET,
  "strataflow-aes256-gcm-salt",
  32
);

const DATA_DIR = path.resolve(process.cwd(), ".data");
const STORE_PATH = path.resolve(DATA_DIR, "store.json");

const ALLOWED_PLAN_PRICES = new Set([249, 349, 449, 549, 649]);

interface StoredUser {
  id: string;
  name: string;
  email: string;
  company: string;
  passwordHash: string;
  salt: string;
  planPrice: number;
  createdAt: string;
}

interface ConnectorRecord {
  id: string;
  name: string;
  category: "CRM" | "Payment" | "Messaging";
  status: "connected" | "disconnected";
  endpointUrl: string;
  syncFrequency: string;
  lastSyncedAt: string;
  recordsSynced: number;
}

interface TriggerRecord {
  id: string;
  name: string;
  eventCondition: string;
  recipientEmail: string;
  enabled: boolean;
  lastTriggeredAt: string | null;
  dispatchCount: number;
}

interface ReportRecord {
  id: string;
  title: string;
  dimension: string;
  cadence: "Daily" | "Weekly" | "Monthly";
  metricSummary: string;
  conversionRate: number;
  automatedHoursSaved: number;
  createdAt: string;
}

interface VaultRecord {
  id: string;
  label: string;
  category: "CRM Token" | "Payment Key" | "Client PII";
  maskedPreview: string;
  iv: string;
  authTag: string;
  ciphertext: string;
  createdAt: string;
}

interface CampaignRecord {
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

interface WorkspaceData {
  connectors: ConnectorRecord[];
  triggers: TriggerRecord[];
  reports: ReportRecord[];
  vaultItems: VaultRecord[];
  campaigns: CampaignRecord[];
}

interface InquiryRecord {
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

interface StoreSchema {
  users: StoredUser[];
  workspaces: Record<string, WorkspaceData>;
  inquiries: InquiryRecord[];
}

interface AuthenticatedRequest extends Request {
  authUser?: StoredUser;
}

const aiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

function encryptText(plaintext: string): {
  iv: string;
  authTag: string;
  ciphertext: string;
} {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex"),
    ciphertext: encrypted.toString("hex"),
  };
}

function decryptText(payload: {
  iv: string;
  authTag: string;
  ciphertext: string;
}): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    ENCRYPTION_KEY,
    Buffer.from(payload.iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.ciphertext, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

function maskSecret(secret: string): string {
  if (secret.length <= 6) {
    return "••••••";
  }
  return `${secret.slice(0, 4)}••••••••${secret.slice(-4)}`;
}

function createDefaultWorkspace(email: string): WorkspaceData {
  const now = new Date().toISOString();
  const sampleCrmEncrypted = encryptText("sf_live_99381_enterprise_sync_token");
  const sampleStripeEncrypted = encryptText("rk_live_51Nx92_payment_webhook_key");
  return {
    connectors: [
      {
        id: "conn_salesforce",
        name: "Salesforce CRM",
        category: "CRM",
        status: "connected",
        endpointUrl: "https://api.salesforce.com/services/data/v61.0",
        syncFrequency: "Every 15 min",
        lastSyncedAt: now,
        recordsSynced: 14280,
      },
      {
        id: "conn_hubspot",
        name: "HubSpot Marketing",
        category: "CRM",
        status: "connected",
        endpointUrl: "https://api.hubapi.com/crm/v3/objects/contacts",
        syncFrequency: "Real-time webhook",
        lastSyncedAt: now,
        recordsSynced: 9640,
      },
      {
        id: "conn_stripe",
        name: "Stripe Billing",
        category: "Payment",
        status: "connected",
        endpointUrl: "https://api.stripe.com/v1/events",
        syncFrequency: "Instant webhook",
        lastSyncedAt: now,
        recordsSynced: 4820,
      },
      {
        id: "conn_razorpay",
        name: "Razorpay Enterprise",
        category: "Payment",
        status: "disconnected",
        endpointUrl: "https://api.razorpay.com/v1/payments",
        syncFrequency: "Hourly batch",
        lastSyncedAt: now,
        recordsSynced: 0,
      },
      {
        id: "conn_slack",
        name: "Slack Operations",
        category: "Messaging",
        status: "connected",
        endpointUrl: "https://slack.com/api/chat.postMessage",
        syncFrequency: "Event-driven",
        lastSyncedAt: now,
        recordsSynced: 1295,
      },
    ],
    triggers: [
      {
        id: "trig_revenue_drop",
        name: "Weekly MRR Variance Alert",
        eventCondition: "Net revenue delta > 12% vs 30-day rolling baseline",
        recipientEmail: email,
        enabled: true,
        lastTriggeredAt: now,
        dispatchCount: 14,
      },
      {
        id: "trig_high_intent",
        name: "Qualified Enterprise Lead Notification",
        eventCondition: "CRM lead score >= 82 and budget tier >= $349/mo",
        recipientEmail: email,
        enabled: true,
        lastTriggeredAt: now,
        dispatchCount: 38,
      },
      {
        id: "trig_payment_fail",
        name: "Payment Retry & Churn Prevention",
        eventCondition: "Stripe invoice payment_failed after 1st attempt",
        recipientEmail: email,
        enabled: true,
        lastTriggeredAt: null,
        dispatchCount: 5,
      },
    ],
    reports: [
      {
        id: "rep_q4_rev",
        title: "Automated Revenue & Payment Reconciliation",
        dimension: "Stripe + Salesforce Pipeline",
        cadence: "Weekly",
        metricSummary: "$184,200 reconciled across 412 SME accounts",
        conversionRate: 24.8,
        automatedHoursSaved: 46,
        createdAt: now,
      },
      {
        id: "rep_lead_gen",
        title: "Inbound Content & Lead Attribution Audit",
        dimension: "HubSpot + Organic Search",
        cadence: "Monthly",
        metricSummary: "318 sales-qualified leads with 3.4x pipeline ROI",
        conversionRate: 18.6,
        automatedHoursSaved: 62,
        createdAt: now,
      },
      {
        id: "rep_sla",
        title: "Workflow Execution & Exception Summary",
        dimension: "Multi-API Orchestrator",
        cadence: "Daily",
        metricSummary: "99.94% automated completion rate across 18,400 tasks",
        conversionRate: 31.2,
        automatedHoursSaved: 29,
        createdAt: now,
      },
    ],
    vaultItems: [
      {
        id: "vault_sf_01",
        label: "Salesforce Production OAuth Token",
        category: "CRM Token",
        maskedPreview: maskSecret("sf_live_99381_enterprise_sync_token"),
        ...sampleCrmEncrypted,
        createdAt: now,
      },
      {
        id: "vault_stripe_02",
        label: "Stripe Settlement Webhook Secret",
        category: "Payment Key",
        maskedPreview: maskSecret("rk_live_51Nx92_payment_webhook_key"),
        ...sampleStripeEncrypted,
        createdAt: now,
      },
    ],
    campaigns: [
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
        createdAt: now,
      },
    ],
  };
}

let writeQueue = Promise.resolve();

function ensureStore(): StoreSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STORE_PATH)) {
    const initial: StoreSchema = {
      users: [],
      workspaces: {},
      inquiries: [],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
  try {
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreSchema;
  } catch {
    return { users: [], workspaces: {}, inquiries: [] };
  }
}

async function readStore(): Promise<StoreSchema> {
  await writeQueue;
  return ensureStore();
}

async function updateStore(
  mutator: (store: StoreSchema) => void | Promise<void>
): Promise<StoreSchema> {
  const run = async (): Promise<StoreSchema> => {
    const store = ensureStore();
    await mutator(store);
    const tmpPath = `${STORE_PATH}.${crypto.randomUUID()}.tmp`;
    await fs.promises.writeFile(
      tmpPath,
      JSON.stringify(store, null, 2),
      "utf8"
    );
    await fs.promises.rename(tmpPath, STORE_PATH);
    return store;
  };
  const next = writeQueue.then(run, run);
  writeQueue = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

function verifyPassword(password: string, salt: string, storedHex: string): boolean {
  const derived = crypto.scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHex, "hex");
  if (derived.length !== stored.length) {
    return false;
  }
  return crypto.timingSafeEqual(derived, stored);
}

function signToken(userId: string): string {
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }
  const [payloadB64, sigB64] = parts;
  const expectedSig = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payloadB64)
    .digest();
  let providedSig: Buffer;
  try {
    providedSig = Buffer.from(sigB64, "base64url");
  } catch {
    return null;
  }
  if (expectedSig.length !== providedSig.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(expectedSig, providedSig)) {
    return null;
  }
  try {
    const decoded = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf8")
    ) as { sub?: string; exp?: number };
    if (!decoded.sub || !decoded.exp || decoded.exp < Date.now()) {
      return null;
    }
    return decoded.sub;
  } catch {
    return null;
  }
}

function sanitizeUser(user: StoredUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    company: user.company,
    planPrice: user.planPrice,
    createdAt: user.createdAt,
  };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 160;
}

function isSafeHttpsUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== "https:") {
      return false;
    }
    const host = parsed.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host === "169.254.169.254" ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(host)
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }
  const token = header.slice("Bearer ".length).trim();
  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: "Session expired or invalid." });
    return;
  }
  const store = await readStore();
  const user = store.users.find((u) => u.id === userId);
  if (!user) {
    res.status(401).json({ error: "Account not found." });
    return;
  }
  req.authUser = user;
  next();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", encryption: "AES-256-GCM" });
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const name = String(req.body?.name ?? "").trim();
      const email = String(req.body?.email ?? "").trim().toLowerCase();
      const company = String(req.body?.company ?? "").trim();
      const password = String(req.body?.password ?? "");
      const requestedPlan = Number(req.body?.planPrice ?? 349);
      const planPrice = ALLOWED_PLAN_PRICES.has(requestedPlan)
        ? requestedPlan
        : 349;

      if (name.length < 2 || name.length > 80) {
        res.status(400).json({ error: "Please enter your full name (2–80 characters)." });
        return;
      }
      if (!isValidEmail(email)) {
        res.status(400).json({ error: "Please enter a valid work email address." });
        return;
      }
      if (company.length < 2 || company.length > 100) {
        res.status(400).json({ error: "Please enter your company name." });
        return;
      }
      if (password.length < 8 || password.length > 128) {
        res.status(400).json({ error: "Password must be at least 8 characters." });
        return;
      }

      let createdUser: StoredUser | null = null;
      let duplicate = false;

      await updateStore((store) => {
        if (store.users.some((u) => u.email === email)) {
          duplicate = true;
          return;
        }
        const salt = crypto.randomBytes(16).toString("hex");
        const newUser: StoredUser = {
          id: `usr_${crypto.randomUUID()}`,
          name,
          email,
          company,
          passwordHash: hashPassword(password, salt),
          salt,
          planPrice,
          createdAt: new Date().toISOString(),
        };
        store.users.push(newUser);
        store.workspaces[newUser.id] = createDefaultWorkspace(email);
        createdUser = newUser;
      });

      if (duplicate || !createdUser) {
        res.status(409).json({ error: "An account with this email already exists." });
        return;
      }

      const token = signToken((createdUser as StoredUser).id);
      res.status(201).json({
        token,
        user: sanitizeUser(createdUser as StoredUser),
      });
    } catch (err) {
      res.status(500).json({ error: "Unable to create account right now." });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const email = String(req.body?.email ?? "").trim().toLowerCase();
      const password = String(req.body?.password ?? "");

      if (!isValidEmail(email) || !password) {
        res.status(400).json({ error: "Email and password are required." });
        return;
      }

      const store = await readStore();
      const user = store.users.find((u) => u.email === email);
      if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
        res.status(401).json({ error: "Invalid email or password." });
        return;
      }

      const token = signToken(user.id);
      res.json({ token, user: sanitizeUser(user) });
    } catch {
      res.status(500).json({ error: "Unable to sign in right now." });
    }
  });

  app.get("/api/auth/me", requireAuth, (req: AuthenticatedRequest, res) => {
    res.json({ user: sanitizeUser(req.authUser!) });
  });

  app.get("/api/workspace", requireAuth, async (req: AuthenticatedRequest, res) => {
    const user = req.authUser!;
    const store = await readStore();
    let workspace = store.workspaces[user.id];
    if (!workspace) {
      await updateStore((draft) => {
        draft.workspaces[user.id] = createDefaultWorkspace(user.email);
      });
      workspace = createDefaultWorkspace(user.email);
    }
    const sanitizedVault = workspace.vaultItems.map((item) => ({
      id: item.id,
      label: item.label,
      category: item.category,
      maskedPreview: item.maskedPreview,
      iv: item.iv,
      authTag: item.authTag,
      ciphertextPreview: `${item.ciphertext.slice(0, 28)}...`,
      createdAt: item.createdAt,
    }));
    res.json({
      connectors: workspace.connectors,
      triggers: workspace.triggers,
      reports: workspace.reports,
      vaultItems: sanitizedVault,
      campaigns: workspace.campaigns,
    });
  });

  app.patch(
    "/api/workspace/plan",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const planPrice = Number(req.body?.planPrice);
      if (!ALLOWED_PLAN_PRICES.has(planPrice)) {
        res.status(400).json({ error: "Invalid subscription tier selected." });
        return;
      }
      let updatedUser: StoredUser | undefined;
      await updateStore((store) => {
        const target = store.users.find((u) => u.id === req.authUser!.id);
        if (target) {
          target.planPrice = planPrice;
          updatedUser = target;
        }
      });
      if (!updatedUser) {
        res.status(404).json({ error: "User not found." });
        return;
      }
      res.json({ user: sanitizeUser(updatedUser) });
    }
  );

  app.patch(
    "/api/workspace/connectors/:id",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const connectorId = req.params.id;
      const status = req.body?.status;
      const endpointUrl = req.body?.endpointUrl
        ? String(req.body.endpointUrl).trim()
        : undefined;
      const syncFrequency = req.body?.syncFrequency
        ? String(req.body.syncFrequency).trim()
        : undefined;

      if (status !== undefined && status !== "connected" && status !== "disconnected") {
        res.status(400).json({ error: "Invalid connector status." });
        return;
      }
      if (endpointUrl !== undefined && !isSafeHttpsUrl(endpointUrl)) {
        res.status(400).json({
          error: "Endpoint URL must be a valid external HTTPS URL.",
        });
        return;
      }

      let updated: ConnectorRecord | null = null;
      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        const target = ws?.connectors.find((c) => c.id === connectorId);
        if (!target) return;
        if (status) target.status = status;
        if (endpointUrl) target.endpointUrl = endpointUrl;
        if (syncFrequency) target.syncFrequency = syncFrequency.slice(0, 40);
        target.lastSyncedAt = new Date().toISOString();
        if (target.status === "connected" && target.recordsSynced === 0) {
          target.recordsSynced = 1240;
        }
        updated = target;
      });

      if (!updated) {
        res.status(404).json({ error: "Connector not found." });
        return;
      }
      res.json({ connector: updated });
    }
  );

  app.post(
    "/api/workspace/triggers",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const name = String(req.body?.name ?? "").trim();
      const eventCondition = String(req.body?.eventCondition ?? "").trim();
      const recipientEmail = String(
        req.body?.recipientEmail ?? req.authUser!.email
      )
        .trim()
        .toLowerCase();

      if (name.length < 3 || name.length > 90) {
        res.status(400).json({ error: "Trigger name must be 3–90 characters." });
        return;
      }
      if (eventCondition.length < 5 || eventCondition.length > 180) {
        res.status(400).json({ error: "Condition must be 5–180 characters." });
        return;
      }
      if (!isValidEmail(recipientEmail)) {
        res.status(400).json({ error: "Valid recipient email required." });
        return;
      }

      const newTrigger: TriggerRecord = {
        id: `trig_${crypto.randomUUID().slice(0, 8)}`,
        name,
        eventCondition,
        recipientEmail,
        enabled: true,
        lastTriggeredAt: null,
        dispatchCount: 0,
      };

      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        if (ws) {
          ws.triggers.unshift(newTrigger);
        }
      });

      res.status(201).json({ trigger: newTrigger });
    }
  );

  app.patch(
    "/api/workspace/triggers/:id",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const enabled = Boolean(req.body?.enabled);
      let updated: TriggerRecord | null = null;
      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        const target = ws?.triggers.find((t) => t.id === req.params.id);
        if (target) {
          target.enabled = enabled;
          updated = target;
        }
      });
      if (!updated) {
        res.status(404).json({ error: "Trigger not found." });
        return;
      }
      res.json({ trigger: updated });
    }
  );

  app.post(
    "/api/workspace/triggers/:id/test",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      let updated: TriggerRecord | null = null;
      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        const target = ws?.triggers.find((t) => t.id === req.params.id);
        if (target) {
          target.lastTriggeredAt = new Date().toISOString();
          target.dispatchCount += 1;
          updated = target;
        }
      });
      if (!updated) {
        res.status(404).json({ error: "Trigger not found." });
        return;
      }
      res.json({ trigger: updated });
    }
  );

  app.post(
    "/api/workspace/reports",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const title = String(req.body?.title ?? "").trim();
      const dimension = String(req.body?.dimension ?? "").trim();
      const cadenceRaw = String(req.body?.cadence ?? "Weekly");
      const cadence =
        cadenceRaw === "Daily" || cadenceRaw === "Monthly" ? cadenceRaw : "Weekly";

      if (title.length < 3 || title.length > 100) {
        res.status(400).json({ error: "Report title must be 3–100 characters." });
        return;
      }
      if (dimension.length < 3 || dimension.length > 80) {
        res.status(400).json({ error: "Data dimension must be 3–80 characters." });
        return;
      }

      const newReport: ReportRecord = {
        id: `rep_${crypto.randomUUID().slice(0, 8)}`,
        title,
        dimension,
        cadence,
        metricSummary: `Automated ${cadence.toLowerCase()} snapshot across ${dimension}`,
        conversionRate: 21.4,
        automatedHoursSaved: 34,
        createdAt: new Date().toISOString(),
      };

      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        if (ws) {
          ws.reports.unshift(newReport);
        }
      });

      res.status(201).json({ report: newReport });
    }
  );

  app.delete(
    "/api/workspace/reports/:id",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      let removed = false;
      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        if (!ws) return;
        const prevLen = ws.reports.length;
        ws.reports = ws.reports.filter((r) => r.id !== req.params.id);
        removed = ws.reports.length < prevLen;
      });
      if (!removed) {
        res.status(404).json({ error: "Report not found." });
        return;
      }
      res.json({ deleted: true });
    }
  );

  app.post(
    "/api/workspace/vault",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const label = String(req.body?.label ?? "").trim();
      const categoryRaw = String(req.body?.category ?? "CRM Token");
      const category =
        categoryRaw === "Payment Key" || categoryRaw === "Client PII"
          ? categoryRaw
          : "CRM Token";
      const secretValue = String(req.body?.secretValue ?? "").trim();

      if (label.length < 3 || label.length > 80) {
        res.status(400).json({ error: "Label must be 3–80 characters." });
        return;
      }
      if (secretValue.length < 4 || secretValue.length > 500) {
        res.status(400).json({ error: "Sensitive payload must be 4–500 characters." });
        return;
      }

      const encrypted = encryptText(secretValue);
      const record: VaultRecord = {
        id: `vault_${crypto.randomUUID().slice(0, 8)}`,
        label,
        category,
        maskedPreview: maskSecret(secretValue),
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        ciphertext: encrypted.ciphertext,
        createdAt: new Date().toISOString(),
      };

      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        if (ws) {
          ws.vaultItems.unshift(record);
        }
      });

      res.status(201).json({
        item: {
          id: record.id,
          label: record.label,
          category: record.category,
          maskedPreview: record.maskedPreview,
          iv: record.iv,
          authTag: record.authTag,
          ciphertextPreview: `${record.ciphertext.slice(0, 28)}...`,
          createdAt: record.createdAt,
        },
      });
    }
  );

  app.post(
    "/api/workspace/vault/:id/decrypt",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      const store = await readStore();
      const ws = store.workspaces[req.authUser!.id];
      const item = ws?.vaultItems.find((v) => v.id === req.params.id);
      if (!item) {
        res.status(404).json({ error: "Encrypted record not found." });
        return;
      }
      try {
        const plaintext = decryptText({
          iv: item.iv,
          authTag: item.authTag,
          ciphertext: item.ciphertext,
        });
        res.json({ plaintext });
      } catch {
        res.status(500).json({ error: "Decryption integrity verification failed." });
      }
    }
  );

  app.delete(
    "/api/workspace/vault/:id",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      let removed = false;
      await updateStore((store) => {
        const ws = store.workspaces[req.authUser!.id];
        if (!ws) return;
        const prevLen = ws.vaultItems.length;
        ws.vaultItems = ws.vaultItems.filter((v) => v.id !== req.params.id);
        removed = ws.vaultItems.length < prevLen;
      });
      if (!removed) {
        res.status(404).json({ error: "Encrypted record not found." });
        return;
      }
      res.json({ deleted: true });
    }
  );

  app.post("/api/ai/analyze", requireAuth, async (req: AuthenticatedRequest, res) => {
    if (!aiClient) {
      res.status(503).json({
        error:
          "Gemini API key is not configured on the server. Add GEMINI_API_KEY in Settings > Secrets to run live AI analysis.",
      });
      return;
    }

    const focusArea = String(req.body?.focusArea ?? "").trim();
    const datasetNotes = String(req.body?.datasetNotes ?? "").trim();
    const language = String(req.body?.language ?? "English").trim();

    if (focusArea.length < 3 || focusArea.length > 160) {
      res.status(400).json({ error: "Please specify an analysis focus area." });
      return;
    }

    try {
      const store = await readStore();
      const ws = store.workspaces[req.authUser!.id];
      const contextSummary = ws
        ? `Connected APIs: ${ws.connectors
            .filter((c) => c.status === "connected")
            .map((c) => `${c.name} (${c.recordsSynced} records)`)
            .join(", ")}. Active reports: ${ws.reports.length}. Active email triggers: ${
            ws.triggers.filter((t) => t.enabled).length
          }.`
        : "";

      const response = await aiClient.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: `Perform an intelligent SME business workflow and operational data analysis.
Company: ${req.authUser!.company}
Subscription Scale: $${req.authUser!.planPrice}/month
Focus Area: ${focusArea}
Operational Context: ${contextSummary}
Client Notes / Metrics Provided: ${datasetNotes || "Standard CRM, Stripe billing, and lead funnel throughput."}
Respond in language: ${language}. Keep findings concrete, quantitative, and executive-ready.`,
        config: {
          systemInstruction:
            "You are an enterprise operations data analyst. Deliver concise, actionable findings grounded in the supplied business context without fluff.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveSummary: { type: Type.STRING },
              bottleneckDetected: { type: Type.STRING },
              projectedMonthlyHoursSaved: { type: Type.INTEGER },
              recommendedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: [
              "executiveSummary",
              "bottleneckDetected",
              "projectedMonthlyHoursSaved",
              "recommendedActions",
            ],
          },
        },
      });

      const parsed = JSON.parse((response.text ?? "{}").trim());
      res.json({ analysis: parsed });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "AI analysis request failed.";
      res.status(502).json({ error: message });
    }
  });

  app.post(
    "/api/ai/content-strategy",
    requireAuth,
    async (req: AuthenticatedRequest, res) => {
      if (!aiClient) {
        res.status(503).json({
          error:
            "Gemini API key is not configured on the server. Add GEMINI_API_KEY in Settings > Secrets to generate strategic lead campaigns.",
        });
        return;
      }

      const targetAudience = String(req.body?.targetAudience ?? "").trim();
      const offerGoal = String(req.body?.offerGoal ?? "").trim();
      const channel = String(req.body?.channel ?? "LinkedIn + Email Nurture").trim();
      const language = String(req.body?.language ?? "English").trim();

      if (targetAudience.length < 3 || offerGoal.length < 3) {
        res.status(400).json({
          error: "Please specify both target audience and lead generation goal.",
        });
        return;
      }

      try {
        const response = await aiClient.models.generateContent({
          model: "gemini-4-hydrogen",
          contents: `Create a B2B marketing automation and strategic content campaign to generate qualified leads for ${req.authUser!.company}.
Target Audience: ${targetAudience}
Primary Offer / Goal: ${offerGoal}
Distribution Channel: ${channel}
Output Language: ${language}`,
          config: {
            systemInstruction:
              "You are a B2B demand-generation strategist. Write concrete, non-generic content briefs and high-converting outreach sequences without hype buzzwords.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                projectedQualifiedLeads: { type: Type.INTEGER },
                contentBrief: { type: Type.STRING },
                emailSubject: { type: Type.STRING },
                emailSequenceSummary: { type: Type.STRING },
              },
              required: [
                "title",
                "projectedQualifiedLeads",
                "contentBrief",
                "emailSubject",
                "emailSequenceSummary",
              ],
            },
          },
        });

        const parsed = JSON.parse((response.text ?? "{}").trim()) as {
          title: string;
          projectedQualifiedLeads: number;
          contentBrief: string;
          emailSubject: string;
          emailSequenceSummary: string;
        };

        const campaign: CampaignRecord = {
          id: `camp_${crypto.randomUUID().slice(0, 8)}`,
          title: parsed.title || `${targetAudience} Campaign`,
          targetAudience,
          channel,
          projectedQualifiedLeads: Number(parsed.projectedQualifiedLeads) || 45,
          contentBrief: parsed.contentBrief || "",
          emailSubject: parsed.emailSubject || "",
          emailSequenceSummary: parsed.emailSequenceSummary || "",
          createdAt: new Date().toISOString(),
        };

        await updateStore((store) => {
          const ws = store.workspaces[req.authUser!.id];
          if (ws) {
            ws.campaigns.unshift(campaign);
          }
        });

        res.status(201).json({ campaign });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Content strategy generation failed.";
        res.status(502).json({ error: message });
      }
    }
  );

  app.post("/api/inquiries", async (req, res) => {
    try {
      const name = String(req.body?.name ?? "").trim();
      const email = String(req.body?.email ?? "").trim().toLowerCase();
      const phone = String(req.body?.phone ?? "").trim();
      const company = String(req.body?.company ?? "").trim();
      const planPrice = Number(req.body?.planPrice ?? 349);
      const serviceFocus = String(req.body?.serviceFocus ?? "").trim();
      const message = String(req.body?.message ?? "").trim();

      if (name.length < 2 || name.length > 80) {
        res.status(400).json({ error: "Please enter your name." });
        return;
      }
      if (!isValidEmail(email)) {
        res.status(400).json({ error: "Please provide a valid email address." });
        return;
      }
      if (phone.length < 6 || phone.length > 30) {
        res.status(400).json({ error: "Please provide a valid contact phone number." });
        return;
      }
      if (message.length < 10 || message.length > 1500) {
        res.status(400).json({ error: "Please describe your inquiry (10–1500 characters)." });
        return;
      }

      const inquiry: InquiryRecord = {
        id: `SF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
        name,
        email,
        phone,
        company: company.slice(0, 100) || "Independent SME",
        planPrice: ALLOWED_PLAN_PRICES.has(planPrice) ? planPrice : 349,
        serviceFocus: serviceFocus.slice(0, 100) || "Workflow Automation",
        message,
        createdAt: new Date().toISOString(),
      };

      await updateStore((store) => {
        store.inquiries.unshift(inquiry);
      });

      res.status(201).json({
        inquiryId: inquiry.id,
        createdAt: inquiry.createdAt,
      });
    } catch {
      res.status(500).json({ error: "Unable to submit inquiry right now." });
    }
  });

  app.get("/api/inquiries", requireAuth, async (req: AuthenticatedRequest, res) => {
    const store = await readStore();
    const userEmail = req.authUser!.email;
    const filtered = store.inquiries.filter((inq) => inq.email === userEmail);
    res.json({ inquiries: filtered });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), "dist");
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Bennisaas Solutions LLC server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Bennisaas Solutions LLC server:", err);
  process.exit(1);
});
