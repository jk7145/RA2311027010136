import { NextResponse } from "next/server";
import { Log } from "@campus/logging-middleware";

export const runtime = "nodejs";

const base =
  process.env.EVALUATION_SERVICE_BASE_URL ??
  "http://20.207.122.201/evaluation-service";

export async function POST(req: Request): Promise<NextResponse> {
  const token = process.env.EVALUATION_ACCESS_TOKEN;
  if (!token) {
    await Log(
      "frontend",
      "error",
      "config",
      "Missing EVALUATION_ACCESS_TOKEN for log relay"
    );
    return NextResponse.json(
      { error: "Server is not configured with evaluation credentials." },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    await Log("frontend", "warn", "api", "Invalid JSON body on log relay");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const res = await fetch(`${base}/logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    await Log(
      "frontend",
      "error",
      "api",
      `Log relay upstream error status=${res.status}`
    );
  } else {
    await Log("frontend", "info", "api", "Log relay accepted by upstream");
  }

  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}
