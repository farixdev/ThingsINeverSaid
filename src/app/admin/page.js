import { isSignedIn, credentialsConfigured } from "@/lib/auth";
import { DESK_PAGE, deskPulse, pageForDesk } from "@/lib/confessions";
import LoginForm from "./login-form";
import Desk from "./desk";

// The desk must always show the real state of the database.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "The desk",
  robots: { index: false, follow: false },
};

export default async function AdminPage({ searchParams }) {
  if (!(await isSignedIn())) {
    return <LoginForm configured={credentialsConfigured()} />;
  }

  const params = await searchParams;
  const view = params?.view === "wall" ? "approved" : "pending";
  const search = typeof params?.q === "string" ? params.q : "";

  // Only the first page is rendered on the server — enough for an instant
  // first paint. The client owns the list from there.
  let first = { data: [], total: 0, hasMore: false };
  let pulse = { pending: 0, approved: 0, latest: 0 };
  let error = null;
  try {
    [first, pulse] = await Promise.all([
      pageForDesk({ status: view, search, limit: DESK_PAGE, offset: 0 }),
      deskPulse(),
    ]);
  } catch (cause) {
    console.error("The desk could not reach the database:", cause);
    error = "The database is unreachable right now.";
  }

  return <Desk first={first} pulse={pulse} view={view} search={search} error={error} />;
}
