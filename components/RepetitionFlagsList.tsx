import type { RepetitionFlag } from "@/lib/nlp/types";

const SEVERITY_STYLES: Record<RepetitionFlag["severity"], string> = {
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function RepetitionFlagsList({ flags }: { flags: RepetitionFlag[] }) {
  if (flags.length === 0) {
    return (
      <div className="space-y-2">
        <h2 className="text-sm font-semibold">Repetition</h2>
        <p className="text-sm text-zinc-500">
          No lazy repetition detected nearby.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Repetition</h2>
      <ul className="space-y-3">
        {flags.map((flag) => (
          <li key={flag.lemma} className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{flag.lemma}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[flag.severity]}`}
              >
                {flag.severity} · {flag.occurrences.length}x nearby
              </span>
            </div>
            <ul className="space-y-1 pl-3 text-xs text-zinc-500">
              {flag.occurrences.map((occ, i) => (
                <li key={i}>&ldquo;...{occ.snippet}...&rdquo;</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
