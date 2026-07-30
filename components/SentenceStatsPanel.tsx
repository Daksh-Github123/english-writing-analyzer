import type { SentenceStats, ClauseComplexity } from "@/lib/nlp/types";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export function SentenceStatsPanel({
  sentenceStats,
  clauseComplexity,
}: {
  sentenceStats: SentenceStats;
  clauseComplexity: ClauseComplexity;
}) {
  const topOpener = sentenceStats.openerCounts[0];

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Sentence structure</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Sentences" value={String(sentenceStats.sentenceCount)} />
        <Stat label="Avg length" value={sentenceStats.avgLength.toFixed(1)} />
        <Stat
          label="Length variance"
          value={sentenceStats.stdDevLength.toFixed(1)}
        />
        <Stat
          label="Top opener"
          value={
            topOpener
              ? `"${topOpener.opener}" (${Math.round(
                  (topOpener.count / sentenceStats.sentenceCount) * 100,
                )}%)`
              : "—"
          }
        />
      </div>
      {sentenceStats.dominantOpenerShare > 0.3 && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Over {Math.round(sentenceStats.dominantOpenerShare * 100)}% of
          sentences open the same way — consider varying sentence openers.
        </p>
      )}
      <div className="grid grid-cols-3 gap-3">
        <Stat
          label="Simple"
          value={`${Math.round(clauseComplexity.simpleRatio * 100)}%`}
        />
        <Stat
          label="Compound"
          value={`${Math.round(clauseComplexity.compoundRatio * 100)}%`}
        />
        <Stat
          label="Complex"
          value={`${Math.round(clauseComplexity.complexRatio * 100)}%`}
        />
      </div>
    </div>
  );
}
