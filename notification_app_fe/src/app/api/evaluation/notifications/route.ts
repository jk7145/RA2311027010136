import { NextResponse } from "next/server";
import { Log } from "@campus/logging-middleware";

export const runtime = "nodejs";

const base =
  process.env.EVALUATION_SERVICE_BASE_URL ??
  "http://20.207.122.201/evaluation-service";

export async function GET(req: Request): Promise<NextResponse> {
  const token = process.env.EVALUATION_ACCESS_TOKEN;
  if (!token) {
    await Log(
      "frontend",
      "error",
      "config",
      "Missing EVALUATION_ACCESS_TOKEN for notifications proxy"
    );
    return NextResponse.json(
      { error: "Server is not configured with evaluation credentials." },
      { status: 500 }
    );
  }

  const incoming = new URL(req.url);
  const limit = incoming.searchParams.get("limit") ?? "";
  const page = incoming.searchParams.get("page") ?? "";
  const notificationType = incoming.searchParams.get("notification_type") ?? "";

  const upstream = new URL(`${base}/notifications`);
  if (limit) upstream.searchParams.set("limit", limit);
  if (page) upstream.searchParams.set("page", page);
  if (notificationType) {
    upstream.searchParams.set("notification_type", notificationType);
  }

  await Log(
    "frontend",
    "info",
    "api",
    `Proxying notifications request limit=${limit || "default"} page=${page || "default"} type=${notificationType || "all"}`
  );

  const res = await fetch(upstream.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    await Log(
      "frontend",
      "error",
      "api",
      `Notifications upstream failed status=${res.status}`
    );
  }

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}
