import Link from "next/link";

export interface HistoryItem {
  id: string;
  title: string | null;
  word_count: number;
  created_at: string;
  overused_word_count: number | null;
  distinct_word_ratio: number | null;
}

export function HistoryList({ samples }: { samples: HistoryItem[] }) {
  if (samples.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No samples yet.{" "}
        <Link href="/write" className="underline">
          Write one
        </Link>
        .
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
      {samples.map((sample) => (
        <li key={sample.id} className="py-3">
          <Link
            href={`/results/${sample.id}`}
            className="flex items-center justify-between gap-4 text-sm hover:underline"
          >
            <span>{sample.title || "Untitled sample"}</span>
            <span className="flex shrink-0 items-center gap-3 text-zinc-500">
              {sample.distinct_word_ratio !== null && (
                <span>
                  {Math.round(sample.distinct_word_ratio * 100)}% distinct
                </span>
              )}
              {sample.overused_word_count !== null && (
                <span>{sample.overused_word_count} overused</span>
              )}
              <span>{sample.word_count} words</span>
              <span>{new Date(sample.created_at).toLocaleDateString()}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
