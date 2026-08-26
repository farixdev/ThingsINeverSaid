import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/auth";
import { deskPulse } from "@/lib/confessions";

/**
 * A cheap heartbeat for the desk. One row of counts, no confession bodies, so
 * the open admin tab can poll it and only pull real data when something has
 * actually changed.
 */
export async function GET() {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  try {
    return NextResponse.json(await deskPulse(), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Desk pulse failed:", error);
    return NextResponse.json({ error: "Unreachable." }, { status: 503 });
  }
}
