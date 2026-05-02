import { NextResponse } from "next/server";
import { Log } from "@campus/logging-middleware";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    await Log("frontend", "warn", "api", "Invalid JSON body on log relay");
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // In development, just log to console instead of relaying to external service
  console.log("[LOG]", JSON.stringify(body));

  await Log("frontend", "info", "api", "Log relay accepted (local dev mode)");

  return NextResponse.json({ success: true });
}
