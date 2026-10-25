const nodes = {
  public: {
    type: "system",
    typeLabel: "External system",
    name: "company.com",
    role: "Public Website",
    purpose: "Public website for marketing, content and SEO.",
    route: "company.com",
    externalUrl: "https://company.com",
    icon: "globe",
    upstream: [],
    downstream: ["app"],
  },
  app: {
    type: "system",
    typeLabel: "Core service",
    name: "app.company.com",
    role: "Authentication (SSO)",
    purpose: "Single entry point for the authenticated business application.",
    route: "/login",
    externalUrl: "login.html",
    externalLabel: "Login",
    icon: "lock",
    upstream: ["public"],
    downstream: ["office", "audit", "hr", "client", "upload", "admin"],
  },
  office: {
    type: "module",
    typeLabel: "Application module",
    name: "Office",
    role: "Accounting-office operations",
    purpose: "Client operations, accounting, tax, documents and automation.",
    route: "/office",
    icon: "building",
    childRoutes: [
      ["/office", "Overview"],
      ["/office/entities", "Journal Entries"],
      ["/office/approvals", "Approvals"],
      ["/office/reports", "Reports"],
      ["/office/settings", "Settings"],
    ],
    upstream: ["app"],
    downstream: ["api"],
  },
  audit: {
    type: "module",
    typeLabel: "Application module",
    name: "Audit",
    role: "Engagements and workpapers",
    purpose: "Audit planning, risk, workpapers, review and sign-off.",
    route: "/audit",
    icon: "file",
    childRoutes: [
      ["/audit", "Overview"],
      ["/audit/engagements", "Engagements"],
      ["/audit/planning", "Planning"],
      ["/audit/workpapers", "Workpapers"],
      ["/audit/review", "Review"],
    ],
    upstream: ["app"],
    downstream: ["api"],
  },
  hr: {
    type: "module",
    typeLabel: "Application module",
    name: "HR",
    role: "People operations",
    purpose: "Employees, leave, overtime, attendance and approvals.",
    route: "/hr",
    icon: "users",
    childRoutes: [
      ["/hr", "Overview"],
      ["/hr/employees", "Employees"],
      ["/hr/leave", "Leave"],
      ["/hr/overtime", "Overtime"],
      ["/hr/attendance", "Attendance"],
    ],
    upstream: ["app"],
    downstream: ["api"],
  },
  client: {
    type: "module",
    typeLabel: "Application module",
    name: "Client Portal",
    role: "Authenticated client experience",
    purpose: "Client documents, requests, status, messages and profile.",
    route: "/client",
    icon: "user",
    childRoutes: [
      ["/client", "Overview"],
      ["/client/documents", "Documents"],
      ["/client/requests", "Requests"],
      ["/client/status", "Status"],
      ["/client/messages", "Messages"],
    ],
    upstream: ["app"],
    downstream: ["api"],
  },
  upload: {
    type: "module",
    typeLabel: "Public channel",
    name: "Upload Portal",
    role: "Permanent upload-only channel",
    purpose: "Unauthenticated, upload-only client channel with a rotatable public code.",
    route: "/upload/{client-slug}-{public-code}",
    icon: "upload-cloud",
    childRoutes: [
      ["/upload/{client-slug}-{public-code}", "Upload only"],
      ["/upload/...", "Permanent public link"],
    ],
    upstream: ["app"],
    downstream: ["api", "storage"],
  },
  admin: {
    type: "module",
    typeLabel: "Protected module",
    name: "Admin",
    role: "Users, permissions and audit logs",
    purpose: "Manage access, integrations, settings and system audit history.",
    route: "/admin",
    icon: "settings",
    childRoutes: [
      ["/admin", "Overview"],
      ["/admin/users", "Users"],
      ["/admin/roles", "Roles & permissions"],
      ["/admin/audit-logs", "Audit logs"],
      ["/admin/settings", "Settings"],
    ],
    upstream: ["app"],
    downstream: ["api"],
  },
  api: {
    type: "system",
    typeLabel: "Core service",
    name: "Backend API",
    role: "REST API / Internal Services",
    purpose: "Modular-monolith backend boundary for all application modules.",
    route: "/api",
    icon: "layers",
    upstream: ["office", "audit", "hr", "client", "upload", "admin"],
    downstream: ["postgres", "storage", "queue", "rpa", "ocr"],
  },
  postgres: {
    type: "data",
    typeLabel: "Data store",
    name: "PostgreSQL",
    role: "Primary Database",
    purpose: "System of record for platform metadata and business records.",
    route: "core / office / audit / hr",
    icon: "database",
    upstream: ["api"],
    downstream: [],
  },
  storage: {
    type: "data",
    typeLabel: "Data store",
    name: "Object Storage",
    role: "Files / Documents",
    purpose: "Stores document bytes while PostgreSQL stores metadata.",
    route: "clients/{client-id}/documents/{document-id}",
    icon: "database",
    upstream: ["api", "upload"],
    downstream: [],
  },
  queue: {
    type: "data",
    typeLabel: "Async infrastructure",
    name: "Queue",
    role: "Jobs / Events",
    purpose: "Asynchronous work boundary for document and automation pipelines.",
    route: "automation.jobs",
    icon: "queue",
    upstream: ["api"],
    downstream: ["rpa", "ocr"],
  },
  rpa: {
    type: "worker",
    typeLabel: "Background worker",
    name: "Python RPA",
    role: "Revenue Department automation",
    purpose: "Receives jobs, controls an authorized browser flow and downloads receipts.",
    route: "workers/revenue",
    icon: "gear",
    upstream: ["api", "queue"],
    downstream: ["ocr"],
  },
  ocr: {
    type: "worker",
    typeLabel: "Background processor",
    name: "OCR / Workers",
    role: "Document Processing",
    purpose: "Validates, classifies, extracts and checks documents asynchronously.",
    route: "workers/documents",
    icon: "file-text",
    upstream: ["api", "queue", "rpa"],
    downstream: [],
  },
};

const officeNodes = {
  shell: {
    type: "system",
    typeLabel: "Application module",
    name: "Office Module",
    role: "Accounting-office operations",
    purpose: "Primary operational system for clients, documents, accounting work and automation.",
    route: "/office",
    icon: "building",
    upstream: [],
    downstream: ["dashboard"],
  },
  dashboard: {
    type: "system",
    typeLabel: "Office entry point",
    name: "Office Dashboard",
    role: "Work queue and operational overview",
    purpose: "Brings together open tasks, client activity, documents and accounting-period status.",
    route: "/office/dashboard",
    icon: "home",
    upstream: ["shell"],
    downstream: ["clients", "tasks", "documents", "periods", "client360"],
  },
  clients: {
    type: "module",
    typeLabel: "Core module",
    name: "Client Master",
    role: "Clients and contacts",
    purpose: "Source of truth for client organizations, contacts, identifiers and service context.",
    route: "/office/clients",
    icon: "users",
    upstream: ["dashboard"],
    downstream: ["client360", "tasks"],
  },
  tasks: {
    type: "module",
    typeLabel: "Core module",
    name: "Tasks",
    role: "Operational work queue",
    purpose: "Assigns, prioritizes and tracks work across the accounting office.",
    route: "/office/tasks",
    icon: "file",
    upstream: ["dashboard", "clients"],
    downstream: ["automation"],
  },
  documents: {
    type: "module",
    typeLabel: "Core module",
    name: "Document Inbox",
    role: "Document intake and review",
    purpose: "Receives client documents and sends them through review, classification and processing.",
    route: "/office/documents",
    icon: "file-text",
    upstream: ["dashboard"],
    downstream: ["accounting", "storage"],
  },
  periods: {
    type: "module",
    typeLabel: "Core data workflow",
    name: "Accounting Periods",
    role: "Period control",
    purpose: "Defines the active accounting period and anchors work, documents and reporting.",
    route: "office.accounting_periods",
    icon: "calendar",
    upstream: ["dashboard"],
    downstream: ["accounting", "tax"],
  },
  client360: {
    type: "module",
    typeLabel: "Cross-functional view",
    name: "Client 360",
    role: "Single client workspace",
    purpose: "Connects client context, tasks, documents, accounting, tax, billing and activity.",
    route: "/office/clients/{clientId}",
    icon: "user",
    upstream: ["dashboard", "clients"],
    downstream: ["billing", "reports"],
  },
  accounting: {
    type: "module",
    typeLabel: "Workflow module",
    name: "Accounting",
    role: "Accounting workflow",
    purpose: "Handles accounting operations against clients and accounting periods.",
    route: "/office/accounting",
    icon: "database",
    upstream: ["documents", "periods"],
    downstream: ["api"],
  },
  tax: {
    type: "module",
    typeLabel: "Workflow module",
    name: "Tax",
    role: "Tax workflow",
    purpose: "Organizes tax-related work, documents, deadlines and submissions.",
    route: "/office/tax",
    icon: "file",
    upstream: ["periods"],
    downstream: ["api"],
  },
  billing: {
    type: "module",
    typeLabel: "Workflow module",
    name: "Billing",
    role: "Billing and collections",
    purpose: "Tracks service billing, invoices and payment-related follow-up.",
    route: "/office/billing",
    icon: "receipt",
    upstream: ["client360"],
    downstream: ["api"],
  },
  automation: {
    type: "module",
    typeLabel: "Workflow module",
    name: "Automation",
    role: "Office automation",
    purpose: "Creates asynchronous jobs for RPA, receipt downloads and document processing.",
    route: "/office/automation",
    icon: "gear",
    upstream: ["tasks"],
    downstream: ["queue"],
  },
  reports: {
    type: "module",
    typeLabel: "Workflow module",
    name: "Reports",
    role: "Operational reporting",
    purpose: "Provides office and client-level reporting from the system of record.",
    route: "/office/reports",
    icon: "chart",
    upstream: ["client360"],
    downstream: ["api"],
  },
  api: {
    type: "system",
    typeLabel: "Core service",
    name: "Backend API",
    role: "Office module boundary",
    purpose: "Keeps Office business rules behind one modular-monolith API boundary.",
    route: "/api",
    icon: "layers",
    upstream: ["accounting", "tax", "billing", "automation", "reports"],
    downstream: ["postgres", "storage", "queue", "audit"],
  },
  postgres: {
    type: "data",
    typeLabel: "Data store",
    name: "PostgreSQL",
    role: "Office schema",
    purpose: "Stores clients, contacts, tasks, periods and Office business records.",
    route: "core / office",
    icon: "database",
    upstream: ["api"],
    downstream: [],
  },
  storage: {
    type: "data",
    typeLabel: "Data store",
    name: "Object Storage",
    role: "Documents",
    purpose: "Stores document bytes while PostgreSQL keeps document metadata and relationships.",
    route: "clients/{client-id}/documents/{document-id}",
    icon: "database",
    upstream: ["api", "documents"],
    downstream: [],
  },
  queue: {
    type: "worker",
    typeLabel: "Async infrastructure",
    name: "Queue / Workers",
    role: "RPA and OCR jobs",
    purpose: "Runs background work without blocking the Office user interface.",
    route: "automation.jobs",
    icon: "queue",
    upstream: ["api", "automation"],
    downstream: [],
  },
  audit: {
    type: "data",
    typeLabel: "Cross-cutting service",
    name: "Audit Logs",
    role: "RBAC activity trail",
    purpose: "Records who changed Office data, what changed and when it happened.",
    route: "core.audit_logs",
    icon: "file-text",
    upstream: ["api"],
    downstream: [],
  },
};

const moduleMaps = {
  audit: {
    title: "Audit module map",
    contextTitle: "Audit Module",
    route: "/audit",
    role: "Engagements, workpapers and review",
    purpose: "Organizes audit work around engagements, periods, planning, risk, workpapers and sign-off.",
    nodes: [
      { id: "shell", name: "Audit Module", subtitle: "/audit · Engagement operations", route: "/audit", role: "Audit engagements and workpapers", purpose: "Separates client context from engagement-level audit work.", icon: "file", className: "node-system", x: 320, y: 30, w: 280, h: 70 },
      { id: "dashboard", name: "Audit Dashboard", subtitle: "/audit/dashboard · Open work", route: "/audit/dashboard", role: "Engagement overview", purpose: "Shows open engagements, review queues, deadlines and outstanding sign-offs.", icon: "home", className: "node-system node-api", x: 330, y: 135, w: 260, h: 64 },
      { id: "clients", name: "Client / Company", subtitle: "/audit/clients · shared context", route: "/audit/clients", role: "Shared client context", purpose: "References the shared Client Master; the audit engagement is scoped separately from accounting work.", icon: "users", className: "node-module", x: 24, y: 245, w: 160, h: 80 },
      { id: "engagements", name: "Engagements", subtitle: "/audit/engagements", route: "/audit/engagements", role: "Engagement workspace", purpose: "The primary container for audit planning, workpapers, review and sign-off.", icon: "building", className: "node-module", x: 203, y: 245, w: 160, h: 80 },
      { id: "period", name: "Fiscal Period", subtitle: "Year / period", route: "/audit/engagements/{engagementId}", role: "Engagement period", purpose: "Anchors audit evidence and conclusions to a fiscal year or reporting period.", icon: "calendar", className: "node-module", x: 382, y: 245, w: 160, h: 80 },
      { id: "planning", name: "Planning", subtitle: "/audit/planning", route: "/audit/planning", role: "Audit planning", purpose: "Defines scope, team, timeline and planned procedures.", icon: "file", className: "node-module", x: 561, y: 245, w: 160, h: 80 },
      { id: "risk", name: "Risk", subtitle: "/audit/risk", route: "/audit/risk", role: "Risk assessment", purpose: "Tracks assessed risks and links them to procedures and workpapers.", icon: "settings", className: "node-module", x: 740, y: 245, w: 160, h: 80 },
      { id: "workpapers", name: "Workpapers", subtitle: "/audit/workpapers", route: "/audit/workpapers", role: "Audit evidence", purpose: "Stores procedures, evidence, conclusions and reviewer context.", icon: "file-text", className: "node-module", x: 24, y: 400, w: 160, h: 80 },
      { id: "review", name: "Review & Sign-off", subtitle: "/audit/review", route: "/audit/review", role: "Review workflow", purpose: "Routes work for review, clearance and final sign-off.", icon: "lock", className: "node-module", x: 203, y: 400, w: 160, h: 80 },
      { id: "statements", name: "Financial Statements", subtitle: "/audit/financial-statements", route: "/audit/financial-statements", role: "Financial statement view", purpose: "Connects audit conclusions to the financial statements under review.", icon: "database", className: "node-module", x: 382, y: 400, w: 160, h: 80 },
      { id: "reports", name: "Audit Reports", subtitle: "/audit/reports", route: "/audit/reports", role: "Audit reporting", purpose: "Produces report-ready outputs from reviewed engagement data.", icon: "chart", className: "node-module", x: 561, y: 400, w: 160, h: 80 },
      { id: "api", name: "Backend API", subtitle: "Audit module boundary", route: "/api", role: "Audit module boundary", purpose: "Applies engagement-level authorization and persists audit records.", icon: "layers", className: "node-system node-api", x: 335, y: 535, w: 250, h: 64 },
      { id: "postgres", name: "PostgreSQL", subtitle: "audit schema", route: "audit.engagements / workpapers", role: "Audit records", purpose: "Stores engagements, periods, workpapers, reviews and reports.", icon: "database", className: "node-data", x: 30, y: 635, w: 170, h: 64 },
      { id: "storage", name: "Object Storage", subtitle: "Evidence files", route: "engagements/{id}/workpapers", role: "Audit evidence", purpose: "Stores uploaded evidence and generated document files.", icon: "database", className: "node-data", x: 250, y: 635, w: 170, h: 64 },
      { id: "auditlog", name: "Audit Logs", subtitle: "Review trail", route: "core.audit_logs", role: "Audit activity trail", purpose: "Records access, changes, reviews and sign-off events.", icon: "file-text", className: "node-data", x: 470, y: 635, w: 170, h: 64 },
      { id: "queue", name: "Queue / Workers", subtitle: "Async processing", route: "audit.jobs", role: "Async processing", purpose: "Handles document generation and long-running audit jobs.", icon: "queue", className: "node-worker", x: 690, y: 635, w: 200, h: 64 },
    ],
    edges: [
      ["shell", "dashboard", "blue"],
      ["dashboard", "clients", "blue"], ["dashboard", "engagements", "blue"], ["dashboard", "period", "blue"], ["dashboard", "planning", "blue"], ["dashboard", "risk", "blue"],
      ["engagements", "planning", "blue"], ["period", "planning", "blue"], ["planning", "risk", "blue"],
      ["risk", "workpapers", "blue"], ["workpapers", "review", "blue"], ["review", "statements", "blue"], ["statements", "reports", "blue"],
      ["reports", "api", "blue"], ["api", "postgres", "teal"], ["api", "storage", "teal"], ["api", "auditlog", "teal"], ["api", "queue", "amber"],
    ],
  },
  hr: {
    title: "HR module map",
    contextTitle: "HR Module",
    route: "/hr",
    role: "Employee, leave and attendance operations",
    purpose: "Expands the current leave system into a broader HR module without mixing HR rules into Office or Audit.",
    nodes: [
      { id: "shell", name: "HR Module", subtitle: "/hr · People operations", route: "/hr", role: "People operations", purpose: "Owns employee, leave, overtime, attendance and approval workflows.", icon: "users", className: "node-system", x: 320, y: 30, w: 280, h: 70 },
      { id: "dashboard", name: "HR Dashboard", subtitle: "/hr/dashboard · People overview", route: "/hr/dashboard", role: "HR overview", purpose: "Brings together employee actions, leave balances, approvals and attendance signals.", icon: "home", className: "node-system node-api", x: 330, y: 135, w: 260, h: 64 },
      { id: "employees", name: "Employees", subtitle: "/hr/employees", route: "/hr/employees", role: "Employee master", purpose: "Stores employee profiles, employment context and organization membership.", icon: "users", className: "node-module", x: 24, y: 245, w: 160, h: 80 },
      { id: "leave", name: "Leave", subtitle: "/hr/leave", route: "/hr/leave", role: "Leave requests", purpose: "Captures leave requests, balances, approvals and status history.", icon: "calendar", className: "node-module", x: 203, y: 245, w: 160, h: 80 },
      { id: "overtime", name: "Overtime", subtitle: "/hr/overtime", route: "/hr/overtime", role: "Overtime requests", purpose: "Tracks overtime submissions and approval decisions.", icon: "clock", className: "node-module", x: 382, y: 245, w: 160, h: 80 },
      { id: "attendance", name: "Attendance", subtitle: "/hr/attendance", route: "/hr/attendance", role: "Attendance records", purpose: "Provides attendance and working-time records for HR workflows.", icon: "file", className: "node-module", x: 561, y: 245, w: 160, h: 80 },
      { id: "calendar", name: "HR Calendar", subtitle: "/hr/calendar", route: "/hr/calendar", role: "People calendar", purpose: "Shows leave, holidays, meetings and attendance context in one timeline.", icon: "calendar", className: "node-module", x: 740, y: 245, w: 160, h: 80 },
      { id: "meeting", name: "Meetings", subtitle: "/hr/meeting", route: "/hr/meeting", role: "People meetings", purpose: "Coordinates internal HR meetings and related follow-up.", icon: "users", className: "node-module", x: 24, y: 400, w: 160, h: 80 },
      { id: "approval", name: "Approvals", subtitle: "/hr/approval", route: "/hr/approval", role: "HR approval queue", purpose: "Centralizes approval actions for leave, overtime and HR requests.", icon: "check", className: "node-module", x: 203, y: 400, w: 160, h: 80 },
      { id: "pilot", name: "GAS Leave Pilot", subtitle: "Migration boundary", route: "legacy GAS Leave", role: "Migration source", purpose: "Keeps the existing leave workflow visible as the first migration boundary.", icon: "server", className: "node-worker", x: 382, y: 400, w: 160, h: 80 },
      { id: "api", name: "Backend API", subtitle: "HR module boundary", route: "/api", role: "HR module boundary", purpose: "Applies employee-level authorization and persists HR records.", icon: "layers", className: "node-system node-api", x: 335, y: 535, w: 250, h: 64 },
      { id: "postgres", name: "PostgreSQL", subtitle: "hr schema", route: "hr.employees / leave", role: "HR records", purpose: "Stores employees, leave, overtime, attendance and holidays.", icon: "database", className: "node-data", x: 30, y: 635, w: 170, h: 64 },
      { id: "auditlog", name: "Audit Logs", subtitle: "HR activity trail", route: "core.audit_logs", role: "HR activity trail", purpose: "Records changes and approvals for sensitive people data.", icon: "file-text", className: "node-data", x: 250, y: 635, w: 170, h: 64 },
      { id: "notifications", name: "Notifications", subtitle: "Approval events", route: "hr.notifications", role: "Notification jobs", purpose: "Delivers approval and status notifications asynchronously.", icon: "bell", className: "node-worker", x: 470, y: 635, w: 170, h: 64 },
    ],
    edges: [
      ["shell", "dashboard", "blue"],
      ["dashboard", "employees", "blue"], ["dashboard", "leave", "blue"], ["dashboard", "overtime", "blue"], ["dashboard", "attendance", "blue"], ["dashboard", "calendar", "blue"],
      ["leave", "approval", "blue"], ["overtime", "approval", "blue"], ["attendance", "calendar", "blue"], ["employees", "meeting", "blue"], ["calendar", "meeting", "blue"],
      ["approval", "api", "blue"], ["pilot", "api", "amber"], ["meeting", "api", "blue"],
      ["api", "postgres", "teal"], ["api", "auditlog", "teal"], ["api", "notifications", "amber"],
    ],
  },
  client: {
    title: "Client portal map",
    contextTitle: "Client Portal",
    route: "/client",
    role: "Authenticated client experience",
    purpose: "Gives clients a secure workspace for documents, requests, tax context, status, messages and profile.",
    nodes: [
      { id: "shell", name: "Client Portal", subtitle: "/client · Authenticated", route: "/client", role: "Authenticated client experience", purpose: "Provides client-facing access without exposing internal Office or Audit controls.", icon: "user", className: "node-system", x: 320, y: 30, w: 280, h: 70 },
      { id: "dashboard", name: "Client Dashboard", subtitle: "/client/dashboard · Overview", route: "/client/dashboard", role: "Client overview", purpose: "Shows active companies, open requests, recent documents and status.", icon: "home", className: "node-system node-api", x: 330, y: 135, w: 260, h: 64 },
      { id: "membership", name: "Company Membership", subtitle: "Multiple client companies", route: "core.organization_memberships", role: "Membership context", purpose: "Lets one user switch between authorized client companies without duplicate accounts.", icon: "users", className: "node-module", x: 24, y: 245, w: 160, h: 80 },
      { id: "documents", name: "Documents", subtitle: "/client/documents", route: "/client/documents", role: "Client documents", purpose: "Lets clients view and exchange documents they are authorized to access.", icon: "file-text", className: "node-module", x: 203, y: 245, w: 160, h: 80 },
      { id: "requests", name: "Requests", subtitle: "/client/requests", route: "/client/requests", role: "Client requests", purpose: "Collects questions, requests and follow-up items from clients.", icon: "file", className: "node-module", x: 382, y: 245, w: 160, h: 80 },
      { id: "tax", name: "Tax", subtitle: "/client/tax", route: "/client/tax", role: "Client tax view", purpose: "Surfaces only the tax information and actions allowed for the client.", icon: "database", className: "node-module", x: 561, y: 245, w: 160, h: 80 },
      { id: "status", name: "Status", subtitle: "/client/status", route: "/client/status", role: "Work status", purpose: "Shows progress and status updates without exposing internal workflow details.", icon: "chart", className: "node-module", x: 740, y: 245, w: 160, h: 80 },
      { id: "messages", name: "Messages", subtitle: "/client/messages", route: "/client/messages", role: "Client communication", purpose: "Provides a traceable channel for client-office communication.", icon: "file", className: "node-module", x: 24, y: 400, w: 160, h: 80 },
      { id: "profile", name: "Profile", subtitle: "/client/profile", route: "/client/profile", role: "Client profile", purpose: "Manages client contact and personal profile information.", icon: "user", className: "node-module", x: 203, y: 400, w: 160, h: 80 },
      { id: "api", name: "Backend API", subtitle: "Client access boundary", route: "/api", role: "Client access boundary", purpose: "Enforces membership and client-scoped authorization on every request.", icon: "layers", className: "node-system node-api", x: 335, y: 535, w: 250, h: 64 },
      { id: "postgres", name: "PostgreSQL", subtitle: "Membership + metadata", route: "core / client", role: "Client records", purpose: "Stores memberships, requests, messages and permission metadata.", icon: "database", className: "node-data", x: 30, y: 635, w: 170, h: 64 },
      { id: "storage", name: "Object Storage", subtitle: "Client documents", route: "clients/{client-id}/documents", role: "Document files", purpose: "Stores client document bytes behind authorization checks.", icon: "database", className: "node-data", x: 250, y: 635, w: 170, h: 64 },
      { id: "auditlog", name: "Audit Logs", subtitle: "Client activity trail", route: "core.audit_logs", role: "Access trail", purpose: "Records client access, downloads, uploads and changes.", icon: "file-text", className: "node-data", x: 470, y: 635, w: 170, h: 64 },
    ],
    edges: [
      ["shell", "dashboard", "blue"],
      ["dashboard", "membership", "blue"], ["dashboard", "documents", "blue"], ["dashboard", "requests", "blue"], ["dashboard", "tax", "blue"], ["dashboard", "status", "blue"],
      ["membership", "profile", "blue"], ["requests", "messages", "blue"], ["documents", "messages", "blue"], ["status", "api", "blue"], ["profile", "api", "blue"], ["messages", "api", "blue"],
      ["api", "postgres", "teal"], ["api", "storage", "teal"], ["api", "auditlog", "teal"],
    ],
  },
  upload: {
    title: "Upload portal map",
    contextTitle: "Permanent Upload Portal",
    route: "/upload/{client-slug}-{public-code}",
    role: "Public upload-only client channel",
    purpose: "Accepts documents without login while keeping the boundary limited to upload-only actions.",
    nodes: [
      { id: "shell", name: "Permanent Upload Portal", subtitle: "/upload/{client-slug}-{public-code}", route: "/upload/{client-slug}-{public-code}", role: "Public upload-only channel", purpose: "A permanent, rotatable public link recognized by client slug and protected by a random code.", icon: "upload-cloud", className: "node-system", x: 300, y: 30, w: 320, h: 70 },
      { id: "dashboard", name: "Upload Landing", subtitle: "No login required", route: "/upload/{client-slug}-{public-code}", role: "Upload entry", purpose: "Explains the client context and presents only the actions allowed by the portal.", icon: "home", className: "node-system node-api", x: 330, y: 135, w: 260, h: 64 },
      { id: "link", name: "Public Link", subtitle: "Slug + 8-char code", route: "client-slug-public-code", role: "Recognizable URL", purpose: "Uses a human-readable slug plus a non-sequential code; it does not expose database IDs.", icon: "lock", className: "node-module", x: 24, y: 245, w: 160, h: 80 },
      { id: "upload", name: "Upload Only", subtitle: "Files in · nothing out", route: "POST /upload", role: "Upload boundary", purpose: "Allows file upload but does not allow browsing, downloading or editing client data.", icon: "upload-cloud", className: "node-module", x: 203, y: 245, w: 160, h: 80 },
      { id: "metadata", name: "Period & Type", subtitle: "Document metadata", route: "accounting-period / document-type", role: "Upload context", purpose: "Lets the visitor choose an accounting/document period and document type.", icon: "calendar", className: "node-module", x: 382, y: 245, w: 160, h: 80 },
      { id: "note", name: "Note", subtitle: "Optional message", route: "upload.note", role: "Uploader note", purpose: "Accepts a non-sensitive note that travels with the upload record.", icon: "file", className: "node-module", x: 561, y: 245, w: 160, h: 80 },
      { id: "confirm", name: "Confirmation", subtitle: "Non-sensitive result", route: "upload.confirmation", role: "Upload confirmation", purpose: "Confirms receipt without revealing existing documents or internal client data.", icon: "check", className: "node-module", x: 740, y: 245, w: 160, h: 80 },
      { id: "validation", name: "Validation", subtitle: "Type / size / checksum", route: "upload.validation", role: "File controls", purpose: "Validates file type, size, checksum and duplicate signals server-side.", icon: "settings", className: "node-module", x: 24, y: 400, w: 160, h: 80 },
      { id: "security", name: "Security Scan", subtitle: "Malware + abuse checks", route: "upload.security", role: "Security boundary", purpose: "Adds malware scanning, rate limiting, abuse detection and logging where practical.", icon: "lock", className: "node-module", x: 203, y: 400, w: 160, h: 80 },
      { id: "controls", name: "Portal Controls", subtitle: "Active / disable / rotate", route: "office.client_upload_portals", role: "Staff controls", purpose: "Lets staff disable or rotate a compromised portal without automatic expiry.", icon: "settings", className: "node-module", x: 382, y: 400, w: 160, h: 80 },
      { id: "audittrail", name: "Audit Trail", subtitle: "Access + upload events", route: "core.audit_logs", role: "Upload audit trail", purpose: "Records access attempts, upload outcomes and staff control changes.", icon: "file-text", className: "node-module", x: 561, y: 400, w: 160, h: 80 },
      { id: "api", name: "Backend API", subtitle: "Upload security boundary", route: "/api", role: "Upload API boundary", purpose: "Enforces the upload-only rules on the server; frontend validation is not trusted.", icon: "layers", className: "node-system node-api", x: 335, y: 535, w: 250, h: 64 },
      { id: "storage", name: "Object Storage", subtitle: "Uploaded files", route: "clients/{client-id}/documents", role: "File destination", purpose: "Stores uploaded bytes without exposing existing client documents.", icon: "database", className: "node-data", x: 30, y: 635, w: 170, h: 64 },
      { id: "postgres", name: "PostgreSQL", subtitle: "Portal metadata", route: "office.client_upload_portals", role: "Upload records", purpose: "Stores portal state, metadata, checksum and client relationship.", icon: "database", className: "node-data", x: 250, y: 635, w: 170, h: 64 },
      { id: "queue", name: "Queue / Scanners", subtitle: "Async validation", route: "upload.jobs", role: "Async processing", purpose: "Runs scanning, duplicate detection and downstream document processing.", icon: "queue", className: "node-worker", x: 470, y: 635, w: 170, h: 64 },
      { id: "auditlog", name: "Audit Logs", subtitle: "Abuse + access trail", route: "core.audit_logs", role: "Security trail", purpose: "Keeps a record of portal activity and security events.", icon: "file-text", className: "node-data", x: 690, y: 635, w: 200, h: 64 },
    ],
    edges: [
      ["shell", "dashboard", "blue"],
      ["dashboard", "link", "blue"], ["dashboard", "upload", "blue"], ["dashboard", "metadata", "blue"], ["dashboard", "note", "blue"], ["dashboard", "confirm", "blue"],
      ["upload", "validation", "blue"], ["validation", "security", "blue"], ["link", "controls", "blue"], ["security", "audittrail", "blue"], ["confirm", "api", "blue"], ["controls", "api", "blue"],
      ["api", "storage", "teal"], ["api", "postgres", "teal"], ["api", "queue", "amber"], ["api", "auditlog", "teal"],
    ],
  },
  admin: {
    title: "Admin module map",
    contextTitle: "Admin Module",
    route: "/admin",
    role: "Users, permissions, integrations and system settings",
    purpose: "Protects platform-wide controls and exposes administrative actions only to authorized users.",
    nodes: [
      { id: "shell", name: "Admin Module", subtitle: "/admin · Permission protected", route: "/admin", role: "Platform administration", purpose: "Owns users, roles, integrations, audit logs and system settings.", icon: "settings", className: "node-system", x: 320, y: 30, w: 280, h: 70 },
      { id: "dashboard", name: "Admin Dashboard", subtitle: "/admin · System overview", route: "/admin", role: "Administration overview", purpose: "Summarizes platform health, access changes and pending administrative work.", icon: "home", className: "node-system node-api", x: 330, y: 135, w: 260, h: 64 },
      { id: "users", name: "Users", subtitle: "/admin/users", route: "/admin/users", role: "User management", purpose: "Creates, suspends and reviews user access within the organization.", icon: "users", className: "node-module", x: 24, y: 245, w: 160, h: 80 },
      { id: "organizations", name: "Organizations", subtitle: "Tenant context", route: "core.organizations", role: "Organization management", purpose: "Maintains organization boundaries and tenant-level configuration.", icon: "building", className: "node-module", x: 203, y: 245, w: 160, h: 80 },
      { id: "roles", name: "Roles & Permissions", subtitle: "/admin/roles", route: "/admin/roles", role: "RBAC control", purpose: "Defines roles, permissions and membership assignments across modules.", icon: "lock", className: "node-module", x: 382, y: 245, w: 160, h: 80 },
      { id: "integrations", name: "Integrations", subtitle: "/admin/integrations", route: "/admin/integrations", role: "Integration settings", purpose: "Controls external connections and integration configuration.", icon: "gear", className: "node-module", x: 561, y: 245, w: 160, h: 80 },
      { id: "settings", name: "System Settings", subtitle: "/admin/settings", route: "/admin/settings", role: "System configuration", purpose: "Stores environment-level settings that are safe to expose to authorized administrators.", icon: "settings", className: "node-module", x: 740, y: 245, w: 160, h: 80 },
      { id: "auditlogs", name: "Audit Logs", subtitle: "/admin/audit-logs", route: "/admin/audit-logs", role: "Audit history", purpose: "Searches and reviews the first-class audit trail for platform actions.", icon: "file-text", className: "node-module", x: 24, y: 400, w: 160, h: 80 },
      { id: "guard", name: "Permission Guard", subtitle: "Server-side enforcement", route: "core.permissions", role: "Authorization boundary", purpose: "Ensures backend authorization is enforced even when the frontend hides actions.", icon: "lock", className: "node-module", x: 203, y: 400, w: 160, h: 80 },
      { id: "health", name: "Health & Jobs", subtitle: "System operations", route: "/admin/health", role: "Operational visibility", purpose: "Surfaces integration, queue and background-job health for authorized staff.", icon: "chart", className: "node-module", x: 382, y: 400, w: 160, h: 80 },
      { id: "api", name: "Backend API", subtitle: "Admin module boundary", route: "/api", role: "Admin API boundary", purpose: "Protects administrative operations behind server-side role checks.", icon: "layers", className: "node-system node-api", x: 335, y: 535, w: 250, h: 64 },
      { id: "postgres", name: "PostgreSQL", subtitle: "core schema", route: "core.users / roles / permissions", role: "Platform records", purpose: "Stores users, organizations, roles, permissions and configuration metadata.", icon: "database", className: "node-data", x: 30, y: 635, w: 170, h: 64 },
      { id: "auditlog", name: "Audit Logs", subtitle: "First-class history", route: "core.audit_logs", role: "Platform audit trail", purpose: "Stores immutable-ish evidence of sensitive administrative actions.", icon: "file-text", className: "node-data", x: 250, y: 635, w: 170, h: 64 },
      { id: "queue", name: "Queue / Workers", subtitle: "Integration jobs", route: "admin.jobs", role: "Background operations", purpose: "Runs integration sync, maintenance and other non-blocking work.", icon: "queue", className: "node-worker", x: 470, y: 635, w: 170, h: 64 },
    ],
    edges: [
      ["shell", "dashboard", "blue"],
      ["dashboard", "users", "blue"], ["dashboard", "organizations", "blue"], ["dashboard", "roles", "blue"], ["dashboard", "integrations", "blue"], ["dashboard", "settings", "blue"],
      ["users", "guard", "blue"], ["organizations", "guard", "blue"], ["roles", "guard", "blue"], ["integrations", "health", "blue"], ["settings", "health", "blue"], ["auditlogs", "api", "blue"], ["guard", "api", "blue"], ["health", "api", "blue"],
      ["api", "postgres", "teal"], ["api", "auditlog", "teal"], ["api", "queue", "amber"],
    ],
  },
};

const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-6h6v6"/>',
  building: '<path d="M5 21V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v17M3 21h18M8 7h2M8 11h2M8 15h2M12 7h2M12 11h2M12 15h2M9 21v-4h4v4"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>',
  users: '<path d="M16 20v-1.7a3.3 3.3 0 0 0-3.3-3.3H7.3A3.3 3.3 0 0 0 4 18.3V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 11a3 3 0 1 0-1.6-5.5M20 20v-1.6a3.2 3.2 0 0 0-2.3-3.1"/>',
  user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 21a7 7 0 0 1 14 0M5 21h14"/>',
  settings: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="4"/>',
  server: '<rect x="3" y="4" width="18" height="6" rx="1"/><rect x="3" y="14" width="18" height="6" rx="1"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.2"/><path d="m16 16 4.2 4.2"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M4 20h16"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  shield: '<path d="M12 3 20 6v5c0 5-3.4 8-8 10-4.6-2-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  briefcase: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/>',
  'file-signature': '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 14l2-2 2 2-2 2-2-2ZM9 18h7"/>',
  calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 6h8v4H8zM8 14h2M14 14h2M8 18h2M14 18h2"/>',
  'clipboard-list': '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v3H9zM9 11h6M9 15h6M9 18h3"/>',
  sparkles: '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
  fit: '<path d="M8 3H4a1 1 0 0 0-1 1v4M16 3h4a1 1 0 0 1 1 1v4M8 21H4a1 1 0 0 1-1-1v-4M16 21h4a1 1 0 0 0 1-1v-4"/>',
  hand: '<path d="M8 11V5a1.5 1.5 0 0 1 3 0v5M11 10V3.8a1.5 1.5 0 0 1 3 0V10M14 10V5.2a1.5 1.5 0 0 1 3 0v7.3M8 10V7.4a1.5 1.5 0 0 0-3 0v7.2c0 3.6 2.4 6.4 6.1 6.4h.8c3.9 0 6.1-2.6 6.1-6.2v-2.6"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
  database: '<ellipse cx="12" cy="5" rx="7.5" ry="3"/><path d="M4.5 5v7c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5M4.5 12v7c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-7"/>',
  queue: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 9h8M8 13h8M8 17h4"/>',
  gear: '<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="4"/>',
  'file-text': '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h4"/>',
  'upload-cloud': '<path d="M16 17a5 5 0 0 0-1-9.9A6 6 0 0 0 3.5 9.7 4 4 0 0 0 5 17h3M12 21V12M9 15l3-3 3 3"/>',
  x: '<path d="m6 6 12 12M18 6 6 18"/>',
  'panel-right': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 4v16M10 10l2 2-2 2"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h3M8 17h5"/>',
  receipt: '<path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  chart: '<path d="M4 19V5M4 19h16"/><path d="m7 15 3-4 3 2 5-7"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  'external-link': '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/>',
  copy: '<rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
};

function iconSvg(name, className = "") {
  return `<svg class="icon-svg ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.server}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((element) => {
    const name = element.dataset.icon;
    element.innerHTML = iconSvg(name);
  });
}

const layerNames = {
  system: "System",
  module: "Module",
  data: "Data",
  worker: "Worker",
};

const layerColors = {
  system: "#2778dc",
  module: "#83b4ef",
  data: "#3c9ea9",
  worker: "#efa72b",
};

const canvasViewport = document.querySelector("#canvasViewport");
const mapLayer = document.querySelector("#mapLayer");
const officeMapLayer = document.querySelector("#officeMapLayer");
const moduleMapLayer = document.querySelector("#moduleMapLayer");
const relationshipMapLayer = document.querySelector("#relationshipMapLayer");
const workspace = document.querySelector("#workspace");
const inspector = document.querySelector("#inspector");
const inspectorContent = document.querySelector("#inspectorContent");
const inspectorTitle = document.querySelector("#inspectorTitle");
const inspectorType = document.querySelector("#inspectorType");
const inspectorIcon = document.querySelector("#inspectorIcon");
const systemSearch = document.querySelector("#systemSearch");
const zoomReadout = document.querySelector("#zoomReadout");
const dataView = document.querySelector("#dataView");
const dataTableBody = document.querySelector("#dataTableBody");
const toast = document.querySelector("#toast");
const pageTitle = document.querySelector("#pageTitle");
const diagramContext = document.querySelector("#diagramContext");
const diagramContextTitle = document.querySelector("#diagramContextTitle");

let selectedNodeId = "office";
let selectedOfficeNodeId = "shell";
let selectedModuleNodeId = "shell";
let selectedRelationshipNodeId = "landing";
let relationshipNodesById = {};
let activeModuleId = "audit";
let inspectorMode = "platform";
let diagramMode = "platform";
let inspectorTab = "details";
let zoom = 1;
let panX = 0;
let panY = 0;
let panMode = false;
let dragState = null;
let toastTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
}

function openExternalUrl(url, label = url) {
  const opened = window.open(url, "_blank", "noopener,noreferrer");
  showToast(opened ? `Opened ${label} in a new tab` : `Browser blocked opening ${label}`);
}

function nodeTitle(id) {
  return nodes[id]?.name || id;
}

function renderInspector() {
  const node = inspectorMode === "relationship" ? relationshipNodesById[selectedRelationshipNodeId] : inspectorMode === "office" ? officeNodes[selectedOfficeNodeId] : inspectorMode === "module" ? getModuleNode(selectedModuleNodeId) : nodes[selectedNodeId];
  if (!node) return;

  inspectorTitle.textContent = node.name;
  inspectorType.textContent = inspectorMode === "relationship" ? "รายละเอียดฟังก์ชัน" : node.typeLabel;
  inspectorIcon.dataset.icon = node.icon;
  inspectorIcon.innerHTML = iconSvg(node.icon);

  if (inspectorTab === "relationships") {
    inspectorContent.innerHTML = inspectorMode === "relationship" ? renderRelationshipConnections(node) : inspectorMode === "office" ? renderOfficeRelationships(node) : inspectorMode === "module" ? renderModuleRelationships(node) : renderRelationships(node);
  } else {
    inspectorContent.innerHTML = inspectorMode === "relationship" ? renderRelationshipDetails(node) : inspectorMode === "office" ? renderOfficeDetails(node) : inspectorMode === "module" ? renderModuleDetails(node) : renderDetails(node);
  }

  inspectorContent.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = iconSvg(element.dataset.icon);
  });
  inspector.scrollTop = 0;
}

function renderFunctionSteps(steps) {
  return steps?.length ? `<div class="detail-section"><h3>ขั้นตอนและความสามารถ</h3><ol class="function-steps">${steps.map((step) => `<li>${step}</li>`).join("")}</ol></div>` : "";
}

function renderRelationshipDetails(node) {
  const detail = overviewDetails[node.id];
  if (!detail) return "";
  const targetLabel = node.action === "upload" ? "เปิดผังพอร์ทัลอัปโหลดถาวร (อีกช่องทาง)" : `เปิดผังย่อย ${node.name}`;
  const target = node.action ? `<button class="open-link-button" type="button" data-open-diagram="${node.action}"><span data-icon="layers"></span><span>${targetLabel}</span><span class="open-link-arrow" data-icon="arrow-right"></span></button>` : "";
  const external = node.href ? `<button class="open-link-button" type="button" data-open-url="${node.href}"><span data-icon="external-link"></span><span>เปิด Landing Page จริง</span><span class="open-link-arrow" data-icon="arrow-right"></span></button>` : "";
  return `<div class="detail-section"><span class="function-status">${detail.status}</span><p class="function-intro">${detail.purpose}</p></div>
    <div class="detail-section"><h3>ใครใช้งาน</h3><div class="purpose-box">${detail.audience}</div></div>
    ${renderFunctionSteps(detail.steps)}
    <div class="detail-section"><h3>ข้อมูลที่เกี่ยวข้อง</h3><div class="purpose-box">${detail.data}</div></div>
    <div class="detail-section"><h3>กฎสำคัญและสิทธิ์</h3><div class="purpose-box">${detail.rules}</div></div>
    ${target || external ? `<div class="detail-section function-actions">${target}${external}</div>` : ""}`;
}

function renderRelationshipConnections(node) {
  const links = overviewDetails[node.id]?.links || [];
  return `<div class="detail-section"><h3>เชื่อมกับฟังก์ชันใด</h3><div class="relationship-list">${links.map((id) => `<button class="relationship-link" type="button" data-overview-link="${id}"><span>${relationshipNodesById[id]?.name || id}</span><span data-icon="arrow-right"></span></button>`).join("")}</div></div>`;
}

function renderOfficeDetails(node) {
  const relatedIds = [...new Set([...(node.upstream || []), ...(node.downstream || [])])];
  const related = relatedIds.length
    ? `<div class="detail-section"><h3>Connected in Office map</h3><div class="relationship-list">${relatedIds
        .map(
          (id) => `<button class="relationship-link" type="button" data-office-link="${id}"><span><span class="relation-dot" style="background:${layerColors[officeNodes[id].type]}"></span>${officeNodes[id].name}</span><span data-icon="arrow-right"></span></button>`,
        )
        .join("")}</div></div>`
    : "";

  return `
    <div class="detail-section">
      <dl>
        <div class="detail-row"><dt>Name</dt><dd>${node.name}</dd></div>
        <div class="detail-row"><dt>Route / resource</dt><dd><span class="route-value"><span>${node.route}</span><button class="copy-route" type="button" data-copy="${node.route}" aria-label="Copy route"><span data-icon="copy"></span></button></span></dd></div>
      </dl>
    </div>
    <div class="detail-section">
      <h3>Purpose</h3>
      <div class="purpose-box">${node.role}</div>
    </div>
    <div class="detail-section">
      <h3>What it does</h3>
      <div class="purpose-box">${node.purpose}</div>
    </div>
    ${renderFunctionSteps(moduleFunctionSteps.office[selectedOfficeNodeId] || sharedTechnicalSteps[selectedOfficeNodeId])}
    ${related}
  `;
}

function renderOfficeRelationships(node) {
  const renderRelationGroup = (title, ids, direction) => {
    if (!ids.length) {
      return `<section class="relationship-group"><h3>${title}</h3><div class="empty-state">No ${direction} connections recorded.</div></section>`;
    }

    return `<section class="relationship-group"><h3>${title}</h3><div class="relationship-list">${ids
      .map(
        (id) => `<button class="relationship-link" type="button" data-office-link="${id}"><span><span class="relation-dot" style="background:${layerColors[officeNodes[id].type]}"></span>${officeNodes[id].name}</span><span data-icon="arrow-right"></span></button>`,
      )
      .join("")}</div></section>`;
  };

  return `${renderRelationGroup("Upstream", node.upstream || [], "upstream")} ${renderRelationGroup("Downstream", node.downstream || [], "downstream")}`;
}

function getModuleNode(id) {
  const config = moduleMaps[activeModuleId];
  if (!config) return null;
  const node = config.nodes.find((item) => item.id === id);
  if (!node) return null;
  return {
    ...node,
    upstream: config.edges.filter(([, target]) => target === id).map(([source]) => source),
    downstream: config.edges.filter(([source]) => source === id).map(([, target]) => target),
  };
}

function moduleEdgePath(source, target) {
  const sourceX = source.x + source.w / 2;
  const sourceY = source.y + source.h;
  const targetX = target.x + target.w / 2;
  const targetY = target.y;
  const bendY = Math.round((sourceY + targetY) / 2);
  return `M ${sourceX} ${sourceY} V ${bendY} H ${targetX} V ${targetY}`;
}

function renderModuleMap(moduleId) {
  const config = moduleMaps[moduleId];
  if (!config) return;
  const nodesById = Object.fromEntries(config.nodes.map((node) => [node.id, node]));
  const connectors = config.edges
    .map(([sourceId, targetId, color = "blue"]) => {
      const source = nodesById[sourceId];
      const target = nodesById[targetId];
      if (!source || !target) return "";
      return `<path class="connector connector-${color}" d="${moduleEdgePath(source, target)}" marker-end="url(#module-arrow-${color})"></path>`;
    })
    .join("");
  const mapNodes = config.nodes
    .map(
      (node) => `<div class="diagram-node ${node.className}" data-module-node-id="${node.id}" style="--x: ${node.x}px; --y: ${node.y}px; --w: ${node.w}px; --h: ${node.h}px" tabindex="0" role="button" aria-label="${node.name}">
        <span class="node-symbol" data-icon="${node.icon}" aria-hidden="true"></span>
        <span class="node-copy"><strong>${node.name}</strong><small>${node.subtitle}</small></span>
      </div>`,
    )
    .join("");

  moduleMapLayer.innerHTML = `
    <svg class="diagram-connectors" viewBox="0 0 920 760" role="img" aria-label="${config.title}">
      <defs>
        <marker id="module-arrow-blue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2778dc"></path></marker>
        <marker id="module-arrow-teal" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3c9ea9"></path></marker>
        <marker id="module-arrow-amber" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#efa72b"></path></marker>
      </defs>
      ${connectors}
    </svg>
    ${mapNodes}
    <div class="diagram-legend office-legend" aria-label="Module diagram legend">
      <div class="legend-item"><span class="legend-dot dot-module"></span><span><strong>Module</strong><small>Business capability</small></span></div>
      <div class="legend-item"><span class="legend-dot dot-data"></span><span><strong>Data</strong><small>Records and files</small></span></div>
      <div class="legend-item"><span class="legend-dot dot-worker"></span><span><strong>Async</strong><small>Queue and workers</small></span></div>
    </div>
  `;
  hydrateIcons(moduleMapLayer);
}

function renderRelationshipMap() {
  const relationshipNodes = [
    { id: "landing", name: "Landing Page", subtitle: "หน้าแนะนำบริษัท • มีปุ่มเข้าสู่ระบบ", icon: "globe", className: "relationship-map-node node-system relationship-map-entry", href: "https://ckaceaccount.com/landing-page", x: 290, y: 38, w: 360, h: 74 },
    { id: "app-shell", name: "แอปทำงาน · app.company.com", subtitle: "Login → ตรวจสิทธิ์ → เปิดพื้นที่ตามบทบาท", badge: "วางแผนไว้ • ยังไม่เปิดใช้งาน", icon: "shield", className: "relationship-map-node node-system relationship-map-app", x: 290, y: 145, w: 360, h: 76 },
    { id: "login", name: "เข้าสู่ระบบ · Login", subtitle: "ลูกค้าและทีมงานใช้หน้าเดียว", badge: "ยังไม่เปิดใช้งาน", icon: "lock", className: "relationship-map-node node-worker relationship-map-planned relationship-map-login", x: 690, y: 87, w: 190, h: 82 },
    { id: "client-portal", name: "Client Portal · ลูกค้า", subtitle: "บริษัทเดียวเข้าได้เลย • หลายบริษัทเลือกก่อน", icon: "user", className: "relationship-map-node node-module relationship-map-channel", action: "client", x: 26, y: 280, w: 270, h: 82 },
    { id: "my-work", name: "My Work · ทีมงาน", subtitle: "พนักงานเห็นงานที่ได้รับ • หัวหน้าเห็นเฉพาะทีม", icon: "briefcase", className: "relationship-map-node node-module relationship-map-channel", x: 315, y: 280, w: 270, h: 82 },
    { id: "team-admin", name: "Admin + หัวหน้าทีม", subtitle: "Admin ดูแลทุกทีม • หัวหน้าจัดงาน/สิทธิ์ในทีม", icon: "settings", className: "relationship-map-node node-worker relationship-map-crosscut", action: "admin", x: 604, y: 280, w: 270, h: 82 },
    { id: "company-master", name: "ฐานบริษัทลูกค้า · Company Master", subtitle: "บริษัทละ 1 ชุดข้อมูล • ผู้ใช้หลายคน • สิทธิ์บัญชี/สอบแยก", icon: "building", className: "relationship-map-node node-data relationship-map-entity", x: 48, y: 400, w: 384, h: 82 },
    { id: "contracts", name: "สัญญาและบริการ · Contract", subtitle: "เปิด/ปิดบริการตามวันที่ • อัปโหลดหรือสร้างและเซ็น", icon: "file-signature", className: "relationship-map-node node-module relationship-map-shared", x: 468, y: 400, w: 384, h: 82 },
    { id: "office", name: "งานบัญชี · Office", subtitle: "บัญชี ภาษี เงินเดือน • วางระบบ/จดทะเบียนเป็นงานย่อย", icon: "calculator", className: "relationship-map-node node-system relationship-map-workspace", action: "office", x: 26, y: 525, w: 197, h: 82 },
    { id: "audit", name: "งานสอบบัญชี · Audit", subtitle: "ทำงานสอบที่นี่ แม้บริษัทเดียวกันมีงานบัญชีใน Office", icon: "file", className: "relationship-map-node node-system relationship-map-workspace", action: "audit", x: 243, y: 525, w: 197, h: 82 },
    { id: "employee-system", name: "ระบบพนักงาน · HR แยก", subtitle: "ข้อมูลทีมงาน • เปิดจากลิงก์ในแอป", icon: "users", className: "relationship-map-node node-system relationship-map-hr relationship-map-workspace", action: "hr", x: 460, y: 525, w: 197, h: 82 },
    { id: "leave-system", name: "ระบบลางาน · HR แยก", subtitle: "ยื่นลา • อนุมัติ • ติดตามสถานะ", icon: "calendar", className: "relationship-map-node node-system relationship-map-hr relationship-map-workspace", action: "hr", x: 677, y: 525, w: 197, h: 82 },
    { id: "document-requests", name: "คำขอเอกสาร", subtitle: "สร้างจาก Template ตามบริการ", icon: "clipboard-list", className: "relationship-map-node node-module relationship-map-channel", action: "upload", x: 26, y: 636, w: 197, h: 80 },
    { id: "upload-link", name: "ลิงก์อัปโหลด", subtitle: "ลิงก์คำขอและลิงก์บริษัทแยกกัน • ไม่ต้อง Login", icon: "upload-cloud", className: "relationship-map-node node-module relationship-map-channel", action: "upload", x: 243, y: 636, w: 197, h: 80 },
    { id: "shared-documents", name: "เอกสารและสถานะ", subtitle: "ผูกบริษัท/คำขอ • แจ้งทีม • ลูกค้าดูใน Portal", icon: "layers", className: "relationship-map-node node-data relationship-map-shared", x: 460, y: 636, w: 197, h: 80 },
    { id: "ai-classifier", name: "AI คัดแยกเอกสาร", subtitle: "วางแผนเชื่อมกับ Upload/Document", badge: "อนาคต • ยังไม่ทำ", icon: "sparkles", className: "relationship-map-node node-worker relationship-map-future", x: 677, y: 636, w: 197, h: 80 },
  ];
  relationshipNodesById = Object.fromEntries(relationshipNodes.map((node) => [node.id, node]));

  const nodeMarkup = relationshipNodes
    .map((node) => {
      const actionAttributes = !node.href
        ? ` data-overview-select="${node.id}" tabindex="0" role="button" aria-label="ดูรายละเอียด ${node.name}"`
        : "";
      const linkAttributes = node.href
        ? ` href="${node.href}" target="_blank" rel="noreferrer" aria-label="เปิด ${node.name} ในแท็บใหม่"`
        : "";
      const tagName = node.href ? "a" : "div";
      return `<${tagName} class="diagram-node ${node.className}" data-relationship-node-id="${node.id}" style="--x: ${node.x}px; --y: ${node.y}px; --w: ${node.w}px; --h: ${node.h}px"${actionAttributes}${linkAttributes}>
        <span class="node-symbol" data-icon="${node.icon}" aria-hidden="true"></span>
        <span class="node-copy"><strong>${node.name}</strong><small>${node.subtitle}</small>${node.badge ? `<em class="relationship-map-status">${node.badge}</em>` : ""}</span>
      </${tagName}>${node.href ? `<button class="overview-info-button" type="button" data-overview-select="${node.id}" aria-label="ดูรายละเอียด ${node.name}" style="--x:${node.x + node.w - 29}px;--y:${node.y + 5}px">i</button>` : ""}`;
    })
    .join("");

  relationshipMapLayer.innerHTML = `
    <svg class="diagram-connectors" viewBox="0 0 900 790" role="img" aria-label="แผนภาพภาพรวม ตั้งแต่ Landing Page ผ่าน Login ไปยังพื้นที่ลูกค้าและทีมงาน ฐานบริษัท สัญญา งานบัญชี งานสอบ ระบบ HR และเอกสาร">
      <defs>
        <marker id="relationship-arrow-blue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#2778dc"></path></marker>
        <marker id="relationship-arrow-teal" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#3c9ea9"></path></marker>
        <marker id="relationship-arrow-amber" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#efa72b"></path></marker>
      </defs>

      <path class="connector connector-blue" d="M 470 112 V 145" marker-end="url(#relationship-arrow-blue)"></path>
      <path class="connector connector-blue relationship-connector-dashed" d="M 690 128 H 470" marker-end="url(#relationship-arrow-blue)"></path>

      <path class="connector connector-blue" d="M 470 221 V 258"></path>
      <path class="connector connector-blue" d="M 161 258 H 739"></path>
      <path class="connector connector-blue" d="M 161 258 V 280" marker-end="url(#relationship-arrow-blue)"></path>
      <path class="connector connector-blue" d="M 450 258 V 280" marker-end="url(#relationship-arrow-blue)"></path>
      <path class="connector connector-blue" d="M 739 258 V 280" marker-end="url(#relationship-arrow-blue)"></path>

      <path class="connector connector-teal" d="M 296 321 H 312 V 386 H 240 V 400" marker-end="url(#relationship-arrow-teal)"></path>
      <path class="connector connector-amber" d="M 739 321 V 386 H 660 V 400" marker-end="url(#relationship-arrow-amber)"></path>
      <path class="connector connector-teal" d="M 432 441 H 468" marker-end="url(#relationship-arrow-teal)"></path>

      <path class="connector connector-amber" d="M 660 482 V 520 H 125 V 525" marker-end="url(#relationship-arrow-amber)"></path>
      <path class="connector connector-amber" d="M 660 520 H 342 V 525" marker-end="url(#relationship-arrow-amber)"></path>
      <path class="connector connector-blue relationship-connector-dashed" d="M 650 183 H 888 V 513 H 558 V 525" marker-end="url(#relationship-arrow-blue)"></path>
      <path class="connector connector-blue" d="M 657 566 H 677" marker-end="url(#relationship-arrow-blue)"></path>

      <path class="connector connector-teal" d="M 125 607 V 628 H 558 V 636" marker-end="url(#relationship-arrow-teal)"></path>
      <path class="connector connector-teal" d="M 342 607 V 628 H 558" marker-end="url(#relationship-arrow-teal)"></path>
      <path class="connector connector-blue" d="M 223 676 H 243" marker-end="url(#relationship-arrow-blue)"></path>
      <path class="connector connector-teal" d="M 440 676 H 460" marker-end="url(#relationship-arrow-teal)"></path>
      <path class="connector connector-amber relationship-connector-dashed" d="M 657 676 H 677" marker-end="url(#relationship-arrow-amber)"></path>
      <path class="connector connector-teal" d="M 558 716 V 781 H 12 V 321 H 26" marker-end="url(#relationship-arrow-teal)"></path>
    </svg>

    <div class="relationship-map-section" style="--x: 290px; --y: 12px">หน้าเว็บไซต์และทางเข้า</div>
    <div class="relationship-map-guide">คลิกกล่องเพื่อดูหน้าที่และรายละเอียด</div>
    <div class="relationship-map-section" style="--x: 26px; --y: 240px">พื้นที่หลัง Login แยกตามสิทธิ์</div>
    <div class="relationship-map-section" style="--x: 26px; --y: 371px">ฐานบริษัทและสัญญาบริการ</div>
    <div class="relationship-map-label is-amber" style="--x: 300px; --y: 484px">ถ้าใช้ทั้งสองบริการ: งานบัญชี → Office • งานสอบ → Audit</div>
    <div class="relationship-map-section" style="--x: 26px; --y: 493px">ระบบทำงาน • HR เปิดแยก</div>
    <div class="relationship-map-section" style="--x: 26px; --y: 612px">คำขอเอกสารและการติดตาม</div>
    <div class="relationship-map-legend" aria-label="ความหมายของเส้นเชื่อม">
      <span class="relationship-legend-item"><i class="relationship-legend-line is-blue"></i>เข้าใช้และส่งต่องาน</span>
      <span class="relationship-legend-item"><i class="relationship-legend-line is-teal"></i>ข้อมูลและเอกสารร่วม</span>
      <span class="relationship-legend-item"><i class="relationship-legend-line is-amber"></i>บริการตามสัญญา</span>
      <span class="relationship-legend-item"><i class="relationship-legend-line is-dashed"></i>ระบบแยกหรือแผนอนาคต</span>
    </div>
    ${nodeMarkup}
  `;
  relationshipMapLayer.dataset.mapWidth = "900";
  relationshipMapLayer.dataset.mapHeight = "790";
  hydrateIcons(relationshipMapLayer);
}
function renderModuleDetails(node) {
  const relatedIds = [...new Set([...(node.upstream || []), ...(node.downstream || [])])];
  const related = relatedIds.length
    ? `<div class="detail-section"><h3>Connected in module map</h3><div class="relationship-list">${relatedIds
        .map(
          (id) => `<button class="relationship-link" type="button" data-module-link="${id}"><span><span class="relation-dot" style="background:${layerColors[nodeByActiveModule(id).type]}"></span>${nodeByActiveModule(id).name}</span><span data-icon="arrow-right"></span></button>`,
        )
        .join("")}</div></div>`
    : "";

  return `
    <div class="detail-section">
      <dl>
        <div class="detail-row"><dt>Name</dt><dd>${node.name}</dd></div>
        <div class="detail-row"><dt>Route / resource</dt><dd><span class="route-value"><span>${node.route}</span><button class="copy-route" type="button" data-copy="${node.route}" aria-label="Copy route"><span data-icon="copy"></span></button></span></dd></div>
      </dl>
    </div>
    <div class="detail-section">
      <h3>Purpose</h3>
      <div class="purpose-box">${node.role}</div>
    </div>
    <div class="detail-section">
      <h3>What it does</h3>
      <div class="purpose-box">${node.purpose}</div>
    </div>
    ${renderFunctionSteps(moduleFunctionSteps[activeModuleId]?.[selectedModuleNodeId] || sharedTechnicalSteps[selectedModuleNodeId])}
    ${related}
  `;
}

function nodeByActiveModule(id) {
  return getModuleNode(id) || { name: id, type: "module" };
}

function renderModuleRelationships(node) {
  const renderRelationGroup = (title, ids, direction) => {
    if (!ids.length) {
      return `<section class="relationship-group"><h3>${title}</h3><div class="empty-state">No ${direction} connections recorded.</div></section>`;
    }

    return `<section class="relationship-group"><h3>${title}</h3><div class="relationship-list">${ids
      .map(
        (id) => `<button class="relationship-link" type="button" data-module-link="${id}"><span><span class="relation-dot" style="background:${layerColors[nodeByActiveModule(id).type]}"></span>${nodeByActiveModule(id).name}</span><span data-icon="arrow-right"></span></button>`,
      )
      .join("")}</div></section>`;
  };

  return `${renderRelationGroup("Upstream", node.upstream || [], "upstream")} ${renderRelationGroup("Downstream", node.downstream || [], "downstream")}`;
}

function renderDetails(node) {
  const routes = node.childRoutes?.length
    ? `<div class="detail-section"><h3>Child routes</h3><div class="route-list">${node.childRoutes
        .map(
          ([route, label]) => `<button class="route-link" type="button" data-route="${route}"><code>${route}</code><span>${label}</span></button>`,
        )
        .join("")}</div></div>`
    : "";
  const externalAction = node.externalUrl
    ? `<div class="detail-section"><button class="open-link-button" type="button" data-open-url="${node.externalUrl}"><span class="open-link-icon" data-icon="external-link"></span><span>Open ${node.externalLabel || node.name}</span><span class="open-link-arrow" data-icon="arrow-right"></span></button></div>`
    : "";

  return `
    <div class="detail-section">
      <dl>
        <div class="detail-row"><dt>Name</dt><dd>${node.name}</dd></div>
        <div class="detail-row"><dt>Route</dt><dd><span class="route-value"><span>${node.route}</span><button class="copy-route" type="button" data-copy="${node.route}" aria-label="Copy route"><span data-icon="copy"></span></button></span></dd></div>
      </dl>
    </div>
    <div class="detail-section">
      <h3>Purpose</h3>
      <div class="purpose-box">${node.role}</div>
    </div>
    ${externalAction}
    ${routes}
  `;
}

function renderRelationships(node) {
  const renderRelationGroup = (title, ids, direction) => {
    if (!ids.length) {
      return `<section class="relationship-group"><h3>${title}</h3><div class="empty-state">No ${direction} connections recorded.</div></section>`;
    }

    return `<section class="relationship-group"><h3>${title}</h3><div class="relationship-list">${ids
      .map(
        (id) => `<button class="relationship-link" type="button" data-node-link="${id}"><span><span class="relation-dot" style="background:${layerColors[nodes[id].type]}"></span>${nodeTitle(id)}</span><span data-icon="arrow-right"></span></button>`,
      )
      .join("")}</div></section>`;
  };

  return `${renderRelationGroup("Upstream", node.upstream || [], "upstream")} ${renderRelationGroup("Downstream", node.downstream || [], "downstream")}`;
}

function selectNode(id, announce = true) {
  if (!nodes[id]) return;
  inspectorMode = "platform";
  selectedNodeId = id;
  document.querySelectorAll("[data-node-id]").forEach((nodeElement) => {
    nodeElement.classList.toggle("is-selected", nodeElement.dataset.nodeId === id);
  });
  document.querySelectorAll("[data-office-node-id]").forEach((nodeElement) => nodeElement.classList.remove("is-selected"));
  document.querySelectorAll("[data-module-node-id]").forEach((nodeElement) => nodeElement.classList.remove("is-selected"));
  document.querySelectorAll("[data-nav]").forEach((navItem) => {
    navItem.classList.toggle("is-active", navItem.dataset.nav === id || (id === "public" && navItem.dataset.nav === "overview"));
  });
  renderInspector();
  if (announce) showToast(`${nodes[id].name} selected`);
}

function selectOfficeNode(id, announce = true) {
  if (!officeNodes[id]) return;
  inspectorMode = "office";
  selectedOfficeNodeId = id;
  document.querySelectorAll("[data-node-id]").forEach((nodeElement) => {
    nodeElement.classList.toggle("is-selected", id === "shell" && nodeElement.dataset.nodeId === "office");
  });
  document.querySelectorAll("[data-office-node-id]").forEach((nodeElement) => {
    nodeElement.classList.toggle("is-selected", nodeElement.dataset.officeNodeId === id);
  });
  document.querySelectorAll("[data-module-node-id]").forEach((nodeElement) => nodeElement.classList.remove("is-selected"));
  document.querySelectorAll("[data-nav]").forEach((navItem) => {
    navItem.classList.toggle("is-active", navItem.dataset.nav === "office");
  });
  renderInspector();
  if (announce) showToast(`${officeNodes[id].name} selected`);
}

function selectModuleNode(id, announce = true) {
  const node = getModuleNode(id);
  if (!node) return;
  inspectorMode = "module";
  selectedModuleNodeId = id;
  document.querySelectorAll("[data-node-id]").forEach((nodeElement) => nodeElement.classList.remove("is-selected"));
  document.querySelectorAll("[data-office-node-id]").forEach((nodeElement) => nodeElement.classList.remove("is-selected"));
  document.querySelectorAll("[data-module-node-id]").forEach((nodeElement) => {
    nodeElement.classList.toggle("is-selected", nodeElement.dataset.moduleNodeId === id);
  });
  document.querySelectorAll("[data-nav]").forEach((navItem) => {
    navItem.classList.toggle("is-active", navItem.dataset.nav === activeModuleId);
  });
  renderInspector();
  if (announce) showToast(`${node.name} selected`);
}

function selectRelationshipNode(id) {
  if (!relationshipNodesById[id]) return;
  inspectorMode = "relationship";
  selectedRelationshipNodeId = id;
  setInspectorTab("details");
  workspace.classList.remove("inspector-closed");
  document.querySelectorAll("[data-relationship-node-id]").forEach((element) => {
    element.classList.toggle("is-selected", element.dataset.relationshipNodeId === id);
  });
  requestAnimationFrame(() => setTimeout(() => fitDiagram(false), 220));
}

function setDiagramMode(mode, announce = true) {
  diagramMode = mode;
  const officeVisible = mode === "office";
  const moduleVisible = mode === "module";
  const detailVisible = officeVisible || moduleVisible;
  mapLayer.hidden = detailVisible;
  officeMapLayer.hidden = !officeVisible;
  moduleMapLayer.hidden = !moduleVisible;
  relationshipMapLayer.hidden = true;
  diagramContext.hidden = !detailVisible;

  if (officeVisible) {
    diagramContextTitle.textContent = "Office Module";
    pageTitle.textContent = "Office module map";
    selectOfficeNode(selectedOfficeNodeId, false);
  } else if (moduleVisible) {
    const config = moduleMaps[activeModuleId];
    diagramContextTitle.textContent = config.contextTitle;
    pageTitle.textContent = config.title;
    selectModuleNode(selectedModuleNodeId, false);
  } else {
    diagramContextTitle.textContent = "";
    pageTitle.textContent = "ภาพรวมแพลตฟอร์ม";
    selectNode("office", false);
  }

  fitDiagram();
  if (announce) showToast(officeVisible ? "Office module diagram opened" : moduleVisible ? `${moduleMaps[activeModuleId].contextTitle} opened` : "Platform overview opened");
}

function openOfficeDiagram(announce = true) {
  setView("diagram", false);
  setDiagramMode("office", announce);
}

function openModuleDiagram(moduleId, announce = true) {
  if (!moduleMaps[moduleId]) return;
  activeModuleId = moduleId;
  selectedModuleNodeId = "shell";
  renderModuleMap(moduleId);
  setView("diagram", false);
  setDiagramMode("module", announce);
}

function openPlatformDiagram(announce = true) {
  setView("diagram", false);
  setDiagramMode("platform", announce);
}

function updateTransform(animate = true) {
  [mapLayer, officeMapLayer, moduleMapLayer, relationshipMapLayer].forEach((layer) => {
    if (!layer) return;
    if (!animate) layer.style.transition = "none";
    layer.style.setProperty("--zoom", zoom.toFixed(3));
    layer.style.setProperty("--pan-x", `${panX}px`);
    layer.style.setProperty("--pan-y", `${panY}px`);
  });
  zoomReadout.textContent = `${Math.round(zoom * 100)}%`;
  if (!animate) {
    requestAnimationFrame(() => {
      [mapLayer, officeMapLayer, moduleMapLayer, relationshipMapLayer].forEach((layer) => {
        if (layer) layer.style.transition = "";
      });
    });
  }
}

function minimumZoom() {
  return canvasViewport.clientWidth <= 640 ? 0.32 : 0.55;
}

function fitDiagram(animate = true) {
  const availableWidth = Math.max(160, canvasViewport.clientWidth - 48);
  const availableHeight = Math.max(220, canvasViewport.clientHeight - 48);
  const activeMap = [relationshipMapLayer, officeMapLayer, moduleMapLayer, mapLayer].find((layer) => layer && !layer.hidden);
  const mapWidth = Number(activeMap?.dataset.mapWidth) || 920;
  const mapHeight = Number(activeMap?.dataset.mapHeight) || 760;
  zoom = Math.max(minimumZoom(), Math.min(1, availableWidth / mapWidth, availableHeight / mapHeight));
  panX = 0;
  panY = 0;
  updateTransform(animate);
}
function setInspectorTab(tab) {
  inspectorTab = tab;
  document.querySelectorAll("[data-inspector-tab]").forEach((tabButton) => {
    const active = tabButton.dataset.inspectorTab === tab;
    tabButton.classList.toggle("is-active", active);
    tabButton.setAttribute("aria-selected", String(active));
  });
  renderInspector();
}

function renderDataTable() {
  const entries = Object.entries(nodes);
  dataTableBody.innerHTML = entries
    .map(([id, node]) => {
      const connectionCount = (node.downstream || []).length;
      return `<tr data-table-node="${id}"><td><span class="table-layer"><span class="table-dot" style="background:${layerColors[node.type]}"></span>${layerNames[node.type]}</span></td><td><strong>${node.name}</strong></td><td>${node.route}</td><td>${connectionCount} downstream</td></tr>`;
    })
    .join("");
}

function setView(view, announce = true) {
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === view);
  });
  const canvasVisible = view === "diagram" || view === "relationships";
  mapLayer.hidden = !canvasVisible || view === "relationships" || diagramMode !== "platform";
  officeMapLayer.hidden = !canvasVisible || view !== "diagram" || diagramMode !== "office";
  moduleMapLayer.hidden = !canvasVisible || view !== "diagram" || diagramMode !== "module";
  relationshipMapLayer.hidden = view !== "relationships";
  diagramContext.hidden = view !== "diagram" || diagramMode === "platform";
  dataView.hidden = canvasVisible;
  if (view === "data") {
    pageTitle.textContent = "Platform data";
    renderDataTable();
    if (announce) showToast("Data view opened");
  } else if (view === "relationships") {
    diagramMode = "platform";
    renderRelationshipMap();
    pageTitle.textContent = "ภาพรวมระบบ";
    diagramContext.hidden = true;
    fitDiagram(announce);
    if (announce) showToast("System overview opened");
  } else {
    pageTitle.textContent = diagramMode === "office" ? "Office module map" : diagramMode === "module" ? moduleMaps[activeModuleId].title : "ภาพรวมแพลตฟอร์ม";
    fitDiagram();
    if (announce) showToast("Diagram view opened");
  }
}

function filterNodes(query) {
  const normalized = query.trim().toLowerCase();
  const diagramNodes = [
    ...document.querySelectorAll("[data-node-id]"),
    ...document.querySelectorAll("[data-relationship-node-id]"),
  ];
  diagramNodes.forEach((nodeElement) => {
    const nodeId = nodeElement.dataset.nodeId || nodeElement.dataset.relationshipNodeId;
    const node = relationshipNodesById[nodeElement.dataset.relationshipNodeId] || nodes[nodeId] || officeNodes[nodeId] || getModuleNode(nodeId);
    const searchable = node ? `${node.name || ""} ${node.subtitle || ""} ${node.role || ""} ${node.route || ""} ${node.purpose || ""}`.toLowerCase() : "";
    const match = normalized.length > 0 && searchable.includes(normalized);
    nodeElement.classList.toggle("search-dim", normalized.length > 0 && !match);
    nodeElement.classList.toggle("search-match", match);
  });
}
function exportArchitecture() {
  const payload = {
    generatedAt: new Date().toISOString(),
    nodes: Object.entries(nodes).map(([id, node]) => ({ id, ...node })),
    layers: layerNames,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "company-platform-architecture.json";
  link.click();
  URL.revokeObjectURL(url);
  showToast("Architecture exported as JSON");
}

function copyText(value) {
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(value).then(() => showToast("Copied to clipboard")).catch(() => showToast(value));
  } else {
    showToast(value);
  }
}

function bindEvents() {
  document.querySelectorAll("[data-node-id]").forEach((nodeElement) => {
    const nodeId = nodeElement.dataset.nodeId;
    const activateNode = () => {
      if (nodeId === "office") {
        openOfficeDiagram();
        return;
      }
      if (moduleMaps[nodeId]) {
        openModuleDiagram(nodeId);
        return;
      }
      if (nodes[nodeId]?.externalUrl) {
        selectNode(nodeId, false);
        openExternalUrl(nodes[nodeId].externalUrl, nodes[nodeId].externalLabel || nodes[nodeId].name);
        return;
      }
      selectNode(nodeId);
    };
    nodeElement.addEventListener("click", activateNode);
    nodeElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateNode();
      }
    });
  });

  document.querySelectorAll("[data-office-node-id]").forEach((nodeElement) => {
    const officeNodeId = nodeElement.dataset.officeNodeId;
    const activateOfficeNode = () => selectOfficeNode(officeNodeId);
    nodeElement.addEventListener("click", activateOfficeNode);
    nodeElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activateOfficeNode();
      }
    });
  });

  moduleMapLayer.addEventListener("click", (event) => {
    const nodeElement = event.target.closest("[data-module-node-id]");
    if (nodeElement) selectModuleNode(nodeElement.dataset.moduleNodeId);
  });
  moduleMapLayer.addEventListener("keydown", (event) => {
    const nodeElement = event.target.closest("[data-module-node-id]");
    if (!nodeElement || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    selectModuleNode(nodeElement.dataset.moduleNodeId);
  });

  relationshipMapLayer.addEventListener("click", (event) => {
    const nodeElement = event.target.closest("[data-overview-select]");
    if (nodeElement) selectRelationshipNode(nodeElement.dataset.overviewSelect);
  });
  relationshipMapLayer.addEventListener("keydown", (event) => {
    const nodeElement = event.target.closest("[data-overview-select]");
    if (!nodeElement || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    selectRelationshipNode(nodeElement.dataset.overviewSelect);
  });

  document.querySelectorAll("[data-nav]").forEach((navItem) => {
    navItem.addEventListener("click", (event) => {
      event.preventDefault();
      const id = navItem.dataset.nav;
      if (id === "overview") {
        setView("relationships", false);
        showToast("Overview selected");
      } else if (id === "office") {
        openOfficeDiagram();
      } else if (moduleMaps[id]) {
        openModuleDiagram(id);
      } else {
        openPlatformDiagram(false);
        selectNode(id);
        document.querySelector(`[data-node-id="${id}"]`)?.scrollIntoView({ block: "nearest", inline: "nearest" });
      }
    });
  });

  document.querySelectorAll("[data-inspector-tab]").forEach((tabButton) => {
    tabButton.addEventListener("click", () => setInspectorTab(tabButton.dataset.inspectorTab));
  });

  document.querySelectorAll("[data-canvas-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.canvasAction;
      if (action === "zoom-in") zoom = Math.min(1.65, zoom + 0.1);
      if (action === "zoom-out") zoom = Math.max(minimumZoom(), zoom - 0.1);
      if (action === "fit") fitDiagram();
      if (action === "pan") {
        panMode = !panMode;
        button.classList.toggle("is-active", panMode);
        button.setAttribute("aria-pressed", String(panMode));
        canvasViewport.classList.toggle("is-panning", panMode);
        showToast(panMode ? "Pan mode enabled" : "Pan mode disabled");
      }
      if (action === "zoom-in" || action === "zoom-out") updateTransform();
    });
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.querySelector('[data-diagram-action="platform"]').addEventListener("click", () => openPlatformDiagram());

  document.querySelector('[data-action="export"]').addEventListener("click", exportArchitecture);
  document.querySelector('[data-action="notify"]').addEventListener("click", () => showToast("No new notifications"));
  document.querySelector('[data-action="systems"]').addEventListener("click", () => showToast("Systems view is part of the architecture map"));

  document.querySelector("#closeInspector").addEventListener("click", () => {
    workspace.classList.add("inspector-closed");
    showToast("Inspector collapsed");
  });
  document.querySelector("#reopenInspector").addEventListener("click", () => {
    workspace.classList.remove("inspector-closed");
    showToast("Inspector opened");
  });

  inspectorContent.addEventListener("click", (event) => {
    const openLinkButton = event.target.closest("[data-open-url]");
    if (openLinkButton) openExternalUrl(openLinkButton.dataset.openUrl, nodes[selectedNodeId]?.externalLabel || nodes[selectedNodeId]?.name || "website");
    const copyButton = event.target.closest("[data-copy]");
    if (copyButton) copyText(copyButton.dataset.copy);
    const diagramButton = event.target.closest("[data-open-diagram]");
    if (diagramButton) {
      if (diagramButton.dataset.openDiagram === "office") openOfficeDiagram();
      else if (moduleMaps[diagramButton.dataset.openDiagram]) openModuleDiagram(diagramButton.dataset.openDiagram);
    }
    const overviewButton = event.target.closest("[data-overview-link]");
    if (overviewButton) selectRelationshipNode(overviewButton.dataset.overviewLink);
    const relationshipButton = event.target.closest("[data-node-link]");
    if (relationshipButton) {
      openPlatformDiagram(false);
      selectNode(relationshipButton.dataset.nodeLink);
    }
    const officeRelationshipButton = event.target.closest("[data-office-link]");
    if (officeRelationshipButton) selectOfficeNode(officeRelationshipButton.dataset.officeLink);
    const moduleRelationshipButton = event.target.closest("[data-module-link]");
    if (moduleRelationshipButton) selectModuleNode(moduleRelationshipButton.dataset.moduleLink);
    const routeButton = event.target.closest("[data-route]");
    if (routeButton) showToast(`${routeButton.dataset.route} is ready for implementation`);
  });

  dataTableBody.addEventListener("click", (event) => {
    const row = event.target.closest("[data-table-node]");
    if (!row) return;
    setView("diagram", false);
    if (row.dataset.tableNode === "office") {
      openOfficeDiagram();
    } else if (moduleMaps[row.dataset.tableNode]) {
      openModuleDiagram(row.dataset.tableNode);
    } else {
      openPlatformDiagram(false);
      selectNode(row.dataset.tableNode);
    }
  });

  systemSearch.addEventListener("input", () => filterNodes(systemSearch.value));
  systemSearch.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      systemSearch.value = "";
      filterNodes("");
      systemSearch.blur();
    }
  });
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      systemSearch.focus();
    }
  });

  canvasViewport.addEventListener("pointerdown", (event) => {
    if (!panMode || event.target.closest("button")) return;
    dragState = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, panX, panY };
    canvasViewport.classList.add("is-dragging");
    canvasViewport.setPointerCapture(event.pointerId);
  });
  canvasViewport.addEventListener("pointermove", (event) => {
    if (!dragState || dragState.pointerId !== event.pointerId) return;
    panX = dragState.panX + event.clientX - dragState.startX;
    panY = dragState.panY + event.clientY - dragState.startY;
    updateTransform(false);
  });
  const stopDragging = () => {
    dragState = null;
    canvasViewport.classList.remove("is-dragging");
  };
  canvasViewport.addEventListener("pointerup", stopDragging);
  canvasViewport.addEventListener("pointercancel", stopDragging);
  window.addEventListener("resize", () => {
    if (zoom === 1 && panX === 0 && panY === 0) fitDiagram();
  });
}

hydrateIcons();
renderInspector();
renderDataTable();
bindEvents();
workspace.classList.add("inspector-closed");
setView("relationships", false);
requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => fitDiagram(false), 220)));
