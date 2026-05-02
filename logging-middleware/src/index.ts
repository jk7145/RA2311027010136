/**
 * Reusable logging client for the evaluation log API.
 * Call initLogTransport once at app startup, then use Log(...) everywhere.
 * Do not use console.* for application diagnostics in evaluated code paths.
 */

export type Stack = "backend" | "frontend";

export type Level = "debug" | "info" | "warn" | "error" | "fatal";

export type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service";

export type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style";

export type SharedPackage = "auth" | "config" | "middleware" | "utils";

export type Package = BackendPackage | FrontendPackage | SharedPackage;

export type LogBody = {
  stack: Stack;
  level: Level;
  package: Package;
  message: string;
};

const BACKEND_ONLY: Set<string> = new Set([
  "cache",
  "controller",
  "cron_job",
  "db",
  "domain",
  "handler",
  "repository",
  "route",
  "service",
]);

const FRONTEND_ONLY: Set<string> = new Set([
  "api",
  "component",
  "hook",
  "page",
  "state",
  "style",
]);

function validatePackage(stack: Stack, pkg: Package): void {
  const p = pkg as string;
  if (stack === "frontend" && BACKEND_ONLY.has(p)) {
    throw new Error(`package "${pkg}" is not valid for frontend stack`);
  }
  if (stack === "backend" && FRONTEND_ONLY.has(p)) {
    throw new Error(`package "${pkg}" is not valid for backend stack`);
  }
}

export type LogTransport = (body: LogBody) => Promise<void>;

let transport: LogTransport | null = null;

/**
 * Wire how Log posts payloads (e.g. same-origin Next.js route that adds Bearer server-side).
 */
export function initLogTransport(fn: LogTransport): void {
  transport = fn;
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  validatePackage(stack, pkg);
  if (!transport) {
    return;
  }
  try {
    await transport({ stack, level, package: pkg, message });
  } catch {
    // Swallow logging failures so UI and business logic keep working.
  }
}
