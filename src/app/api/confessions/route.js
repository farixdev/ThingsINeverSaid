import { NextResponse } from "next/server";
import { listConfessions } from "@/lib/confessions";

/**
 * A small public read API for the wall. Writing goes through the server action
 * in src/lib/actions.js, not through here.
 *
 * GET /api/confessions?limit=24&offset=0&search=regret
 */
export async function GET(request) {
  const params = request.nextUrl.searchParams;

  try {
    const result = await listConfessions({
      limit: params.get("limit"),
      offset: params.get("offset"),
      search: params.get("search") ?? "",
    });

    return NextResponse.json(result, {
      headers: {
        // Cheap at the edge, never stale for long, and safe to serve while revalidating.
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("GET /api/confessions failed:", error);
    return NextResponse.json({ error: "The wall is unreachable." }, { status: 503 });
  }
}
