import { initLogTransport } from "@campus/logging-middleware";

const base =
  process.env.EVALUATION_SERVICE_BASE_URL ??
  "http://20.207.122.201/evaluation-service";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const token = process.env.EVALUATION_ACCESS_TOKEN;
  initLogTransport(async (body) => {
    if (!token) {
      return;
    }
    await fetch(`${base}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
  });
}
