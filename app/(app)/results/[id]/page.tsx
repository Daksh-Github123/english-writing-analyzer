import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeTrend, type AnalysisScalarRow } from "@/lib/trends";
import { WordFrequencyTable } from "@/components/WordFrequencyTable";
import { RepetitionFlagsList } from "@/components/RepetitionFlagsList";
import { SentenceStatsPanel } from "@/components/SentenceStatsPanel";
import { TrendPanel } from "@/components/TrendPanel";
import type {
  WordFreqEntry,
  RepetitionFlag,
  SentenceStats,
  ClauseComplexity,
} from "@/lib/nlp/types";

const PRIOR_SAMPLE_LIMIT = 5;

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: sample, error } = await supabase
    .from("samples")
    .select(
      "id, title, raw_text, word_count, created_at, analysis_results(*)",
    )
    .eq("id", id)
    .single();

  if (error || !sample) {
    notFound();
  }

  const analysis = Array.isArray(sample.analysis_results)
    ? sample.analysis_results[0]
    : sample.analysis_results;

  if (!analysis) {
    notFound();
  }

  const { data: priorRows } = await supabase
    .from("analysis_results")
    .select(
      "distinct_word_ratio, overused_word_count, avg_sentence_length, sentence_length_stddev, complex_sentence_ratio, top_flagged_words, created_at",
    )
    .lt("created_at", sample.created_at)
    .order("created_at", { ascending: false })
    .limit(PRIOR_SAMPLE_LIMIT);

  const trend = computeTrend(analysis as AnalysisScalarRow, priorRows ?? []);

  const verbFrequency = analysis.verb_frequency as unknown as WordFreqEntry[];
  const adjectiveFrequency =
    analysis.adjective_frequency as unknown as WordFreqEntry[];
  const repetitionFlags =
    analysis.repetition_flags as unknown as RepetitionFlag[];
  const sentenceStats = analysis.sentence_stats as unknown as SentenceStats;
  const clauseComplexity =
    analysis.clause_complexity as unknown as ClauseComplexity;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          {sample.title || "Untitled sample"}
        </h1>
        <Link href="/history" className="text-sm text-zinc-500 hover:underline">
          Back to history
        </Link>
      </div>
      <p className="text-sm text-zinc-500">
        {sample.word_count} words ·{" "}
        {new Date(sample.created_at).toLocaleString()}
      </p>

      <TrendPanel trend={trend} />

      <div className="grid gap-6 sm:grid-cols-2">
        <WordFrequencyTable title="Top verbs" entries={verbFrequency} />
        <WordFrequencyTable title="Top adjectives" entries={adjectiveFrequency} />
      </div>

      <SentenceStatsPanel
        sentenceStats={sentenceStats}
        clauseComplexity={clauseComplexity}
      />

      <RepetitionFlagsList flags={repetitionFlags} />

      <details className="text-sm text-zinc-500">
        <summary className="cursor-pointer">View raw text</summary>
        <pre className="mt-2 whitespace-pre-wrap rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
          {sample.raw_text}
        </pre>
      </details>
    </div>
  );
}
