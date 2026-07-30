import type { WordFreqEntry } from "@/lib/nlp/types";

export function WordFrequencyTable({
  title,
  entries,
}: {
  title: string;
  entries: WordFreqEntry[];
}) {
  if (entries.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <p className="text-sm text-zinc-500">Nothing to show.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold">{title}</h2>
      <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
        {entries.map((entry) => (
          <li key={entry.lemma} className="space-y-1 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{entry.lemma}</span>
              <span className="flex items-center gap-2">
                <span className="text-zinc-500">{entry.count}x</span>
                {entry.flagReason === "overused" && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    overused
                  </span>
                )}
                {entry.flagReason === "frequent" && (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    frequent
                  </span>
                )}
              </span>
            </div>
            {entry.alternatives && entry.alternatives.length > 0 && (
              <ul className="space-y-0.5 pl-3 text-xs text-zinc-500">
                {entry.alternatives.map((alt) => (
                  <li key={alt.word}>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {alt.word}
                    </span>{" "}
                    — {alt.example}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
