"use server";

import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";
import {
  SESSION_COOKIE,
  checkCredentials,
  cookieOptions,
  credentialsConfigured,
  isSignedIn,
  issueToken,
} from "./auth";
import { deleteConfession, setConfessionStatus, WALL_TAG } from "./confessions";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signIn(_prevState, formData) {
  if (!credentialsConfigured()) {
    return { ok: false, message: "No admin credentials are set on the server." };
  }

  const user = String(formData.get("user") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!checkCredentials(user, password)) {
    // Slow every failure down so the form can't be hammered.
    await sleep(700);
    return { ok: false, message: "That isn't right." };
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, issueToken(), cookieOptions);
  return { ok: true, message: "" };
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** Every mutation below re-checks the session; never trust the page render. */
async function guard() {
  if (!(await isSignedIn())) throw new Error("Not signed in.");
}

export async function approveConfession(id) {
  await guard();
  const note = await setConfessionStatus(id, "approved");
  if (note) revalidateTag(WALL_TAG);
  return { ok: Boolean(note) };
}

export async function unapproveConfession(id) {
  await guard();
  const note = await setConfessionStatus(id, "pending");
  if (note) revalidateTag(WALL_TAG);
  return { ok: Boolean(note) };
}

export async function removeConfession(id) {
  await guard();
  const gone = await deleteConfession(id);
  if (gone) revalidateTag(WALL_TAG);
  return { ok: gone };
}
