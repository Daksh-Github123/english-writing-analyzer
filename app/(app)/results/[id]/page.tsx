import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sample, error } = await supabase
    .from("samples")
    .select("id, title, raw_text, word_count, created_at")
    .eq("id", id)
    .single();

  if (error || !sample) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          {sample.title || "Untitled sample"}
        </h1>
        <Link href="/history" className="text-sm text-zinc-500 hover:underline">
          Back to history
        </Link>
      </div>
      <p className="text-sm text-zinc-500">
        {sample.word_count} words · {new Date(sample.created_at).toLocaleString()}
      </p>
      <p className="text-sm text-zinc-500 italic">
        Word usage, repetition, and sentence-structure analysis coming in the
        next phase.
      </p>
      <pre className="whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        {sample.raw_text}
      </pre>
    </div>
  );
}
