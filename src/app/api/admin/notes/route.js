import { NextResponse } from "next/server";
import { isSignedIn } from "@/lib/auth";
import { DESK_PAGE, pageForDesk } from "@/lib/confessions";

/**
 * Pages of confessions for the desk's grid.
 *
 * GET /api/admin/notes?view=wall|pending&q=&offset=0&limit=18
 *
 * Never cached anywhere shared — the desk has to show the real state of the
 * database, and the response is scoped to an authenticated session.
 */
export async function GET(request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  try {
    const page = await pageForDesk({
      status: params.get("view") === "wall" ? "approved" : "pending",
      search: params.get("q") ?? "",
      limit: params.get("limit") ?? DESK_PAGE,
      offset: params.get("offset") ?? 0,
    });
    return NextResponse.json(page, {
      headers: { "Cache-Control": "no-store, private" },
    });
  } catch (error) {
    console.error("GET /api/admin/notes failed:", error);
    return NextResponse.json({ error: "Unreachable." }, { status: 503 });
  }
}
