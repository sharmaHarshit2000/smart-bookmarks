"use client";

import { useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type Bookmark = {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
};

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export default function BookmarksClient({ userId }: { userId: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setBookmarks((data ?? []) as Bookmark[]);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();

    const channel = supabase
      .channel(`bookmarks-rt:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          load();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, userId]);

  const addBookmark = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const t = title.trim();
    const u = normalizeUrl(url);
    if (!t || !u) return;

    setSaving(true);

    const { error } = await supabase.from("bookmarks").insert({
      user_id: userId,
      title: t,
      url: u,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setTitle("");
      setUrl("");
      await load();
    }

    setSaving(false);
  };

  const deleteBookmark = async (id: string) => {
    setErrorMsg(null);
    setDeletingId(id);

    // Optimistic UI
    setBookmarks((cur) => cur.filter((b) => b.id !== id));

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
      setErrorMsg(error.message);
      // Restore truth from DB if delete failed
      await load();
    }

    setDeletingId(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="mt-8">
      <form
        onSubmit={addBookmark}
        className="rounded-2xl border border-zinc-700 bg-zinc-950/40 p-5 shadow-sm"
      >
        <div className="grid gap-3">
          <input
            className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-600"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
          <input
            className="rounded-xl border border-zinc-700 bg-black/40 px-3 py-2 text-white placeholder:text-zinc-500 outline-none focus:ring-2 focus:ring-zinc-600"
            placeholder="URL (e.g. example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          {errorMsg ? <p className="text-sm text-red-400">{errorMsg}</p> : null}

          <div className="flex items-center justify-between gap-3">
            <button
              disabled={saving}
              className="rounded-xl bg-white text-black px-4 py-2 font-medium disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add bookmark"}
            </button>

            <button
              type="button"
              onClick={signOut}
              className="rounded-xl border border-zinc-700 px-4 py-2 text-zinc-100 hover:bg-white/5"
            >
              Sign out
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-zinc-400">Loading…</p>
        ) : bookmarks.length === 0 ? (
          <p className="text-sm text-zinc-400">
            No bookmarks yet. Add your first bookmark above.
          </p>
        ) : (
          <ul className="space-y-3">
            {bookmarks.map((b) => (
              <li
                key={b.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate text-zinc-50">{b.title}</p>
                  <a
                    href={b.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sky-400 break-all hover:underline"
                  >
                    {b.url}
                  </a>
                  <p className="text-xs text-zinc-500 mt-1">
                    {new Date(b.created_at).toLocaleString()}
                  </p>
                </div>

                <button
                  disabled={deletingId === b.id}
                  onClick={() => deleteBookmark(b.id)}
                  className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-100 hover:bg-white/5 disabled:opacity-50"
                >
                  {deletingId === b.id ? "Deleting..." : "Delete"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
