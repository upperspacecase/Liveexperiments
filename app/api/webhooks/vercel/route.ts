import { NextRequest, NextResponse } from "next/server";
import { verifySignature, parseWebhookPayload } from "@/lib/webhook";
import { writeDeployment } from "@/lib/deployments";

export async function POST(request: NextRequest) {
  const secret = process.env.VERCEL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("VERCEL_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Read the raw body for signature verification
  const rawBody = await request.text();
  const signature = request.headers.get("x-vercel-signature");

  if (!verifySignature(rawBody, signature, secret)) {
    console.warn("Webhook signature verification failed");
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 401 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const record = parseWebhookPayload(body);
  if (!record) {
    // Unrecognized event type — acknowledge but skip
    return NextResponse.json({ ok: true, skipped: true });
  }

  console.log(
    `[webhook] ${record.eventType} | ${record.projectName} | ${record.deploymentUrl} | target=${record.target} | ${record.timestamp}`
  );

  try {
    await writeDeployment(record);
  } catch (err) {
    console.error("Failed to store deployment record:", err);
    return NextResponse.json(
      { error: "Failed to store record" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
