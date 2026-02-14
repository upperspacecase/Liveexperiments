import { NextResponse } from "next/server";
import { readDeployments } from "@/lib/deployments";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const deployments = await readDeployments();
    return NextResponse.json(deployments);
  } catch (err) {
    console.error("Failed to read deployments:", err);
    return NextResponse.json(
      { error: "Failed to read deployments" },
      { status: 500 }
    );
  }
}
