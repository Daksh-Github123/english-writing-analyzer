import type { Trend, TrendDelta } from "@/lib/trends";

const ARROW: Record<TrendDelta["direction"], string> = {
  up: "↑",
  down: "↓",
  flat: "→",
};

function Row({
  label,
  delta,
  goodDirection,
  format,
}: {
  label: string;
  delta: TrendDelta;
  goodDirection: "up" | "down";
  format: (n: number) => string;
}) {
  const isGood = delta.direction === goodDirection;
  const color =
    delta.direction === "flat"
      ? "text-zinc-500"
      : isGood
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-red-600 dark:text-red-400";

  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <span className={`font-medium ${color}`}>
        {ARROW[delta.direction]} {format(delta.current)}{" "}
        <span className="text-xs text-zinc-500">
          (was {format(delta.previousAvg)})
        </span>
      </span>
    </div>
  );
}

export function TrendPanel({ trend }: { trend: Trend }) {
  if (!trend.hasHistory) {
    return (
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Progress</h2>
        <p className="text-sm text-zinc-500">
          Submit another sample to see trends over time.
        </p>
      </div>
    );
  }

  const pct = (n: number) => `${Math.round(n * 100)}%`;
  const fixed1 = (n: number) => n.toFixed(1);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold">Progress vs. recent samples</h2>
      <div className="space-y-1.5">
        <Row
          label="Vocabulary range"
          delta={trend.vocabularyRange}
          goodDirection="up"
          format={pct}
        />
        <Row
          label="Overused words"
          delta={trend.overusedWords}
          goodDirection="down"
          format={(n) => String(Math.round(n))}
        />
        <Row
          label="Sentence variety"
          delta={trend.sentenceVariety}
          goodDirection="up"
          format={fixed1}
        />
        <Row
          label="Complex sentence ratio"
          delta={trend.complexSentenceRatio}
          goodDirection="up"
          format={pct}
        />
      </div>
      {trend.recurringFlaggedWords.length > 0 && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Still recurring across recent samples:{" "}
          {trend.recurringFlaggedWords.join(", ")}
        </p>
      )}
    </div>
  );
}
