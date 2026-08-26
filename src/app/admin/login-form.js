"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Seal } from "@/components/marks";
import { signIn } from "@/lib/admin-actions";

const EMPTY = { ok: false, message: "" };

export default function LoginForm({ configured }) {
  const [state, formAction, pending] = useActionState(signIn, EMPTY);
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <main className="fit-screen relative flex items-center justify-center px-5 py-24">
      <form action={formAction} className="compose relative z-10 w-[min(24rem,100%)]">
        <div className="text-center">
          <Seal size={38} className="mx-auto text-[var(--rose)] opacity-50" />
          <p className="eyebrow mt-6">the desk</p>
          <h1 className="display mt-2 text-[1.9rem]">Who&apos;s reading?</h1>
        </div>

        <hr className="rule my-6" />

        {configured ? (
          <>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="user"
                  className="block text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--ink-3)]"
                >
                  username
                </label>
                <input
                  id="user"
                  name="user"
                  className="field mt-1"
                  autoComplete="username"
                  autoCapitalize="off"
                  spellCheck={false}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-[0.6875rem] uppercase tracking-[0.18em] text-[var(--ink-3)]"
                >
                  password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="field mt-1"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn mt-8 w-full" disabled={pending}>
              {pending ? "Checking…" : "Sign in"}
            </button>

            {state.message && (
              <p className="notice mt-4 text-center" role="alert">
                {state.message}
              </p>
            )}
          </>
        ) : (
          <p className="text-[0.9rem] leading-relaxed text-[var(--ink-2)]">
            No admin credentials are set. Add <code>ADMIN_USER</code> and{" "}
            <code>ADMIN_PASSWORD</code> to the environment and restart.
          </p>
        )}
      </form>
    </main>
  );
}
