import { isSignedIn, credentialsConfigured } from "@/lib/auth";
import { deskPulse, listForDesk } from "@/lib/confessions";
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

  let notes = [];
  let pulse = { pending: 0, approved: 0, latest: 0 };
  let error = null;
  try {
    [notes, pulse] = await Promise.all([listForDesk(view, search), deskPulse()]);
  } catch (cause) {
    console.error("The desk could not reach the database:", cause);
    error = "The database is unreachable right now.";
  }

  return <Desk notes={notes} pulse={pulse} view={view} search={search} error={error} />;
}
