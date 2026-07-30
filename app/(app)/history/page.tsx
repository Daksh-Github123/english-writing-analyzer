import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: samples } = await supabase
    .from("samples")
    .select("id, title, word_count, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">History</h1>
      {!samples || samples.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No samples yet.{" "}
          <Link href="/write" className="underline">
            Write one
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {samples.map((sample) => (
            <li key={sample.id} className="py-3">
              <Link
                href={`/results/${sample.id}`}
                className="flex items-center justify-between text-sm hover:underline"
              >
                <span>{sample.title || "Untitled sample"}</span>
                <span className="text-zinc-500">
                  {sample.word_count} words ·{" "}
                  {new Date(sample.created_at).toLocaleDateString()}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
