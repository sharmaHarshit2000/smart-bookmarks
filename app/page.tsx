import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import BookmarksClient from "@/components/bookmarks-client";

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proper server-side redirect
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your Bookmarks</h1>
          <p className="text-sm text-zinc-400">{user.email}</p>
        </div>
      </div>

      <BookmarksClient userId={user.id} />
    </div>
  );
}
