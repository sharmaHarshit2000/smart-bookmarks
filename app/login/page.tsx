"use client";

import { useMemo } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const signInWithGoogle = async () => {
    const origin = window.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950/40 p-8 shadow-lg">
        <h1 className="text-3xl font-semibold text-white">Smart Bookmarks</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Sign in with Google to manage your private bookmarks.
        </p>

        <button
          onClick={signInWithGoogle}
          className="mt-6 w-full rounded-2xl bg-white text-black py-3 font-medium hover:bg-zinc-200 transition"
        >
          Continue with Google
        </button>

        <p className="mt-4 text-xs text-zinc-500 text-center">
          Secure login powered by Google OAuth
        </p>
      </div>
    </div>
  );
}
