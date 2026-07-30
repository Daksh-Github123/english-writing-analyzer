export interface AnalysisScalarRow {
  distinct_word_ratio: number;
  overused_word_count: number;
  avg_sentence_length: number;
  sentence_length_stddev: number;
  complex_sentence_ratio: number;
  top_flagged_words: string[];
}

export interface TrendDelta {
  direction: "up" | "down" | "flat";
  current: number;
  previousAvg: number;
}

export interface Trend {
  hasHistory: boolean;
  vocabularyRange: TrendDelta;
  overusedWords: TrendDelta;
  sentenceVariety: TrendDelta;
  complexSentenceRatio: TrendDelta;
  recurringFlaggedWords: string[];
}

// Ignore small fluctuations (< 2% of the prior average) so the trend
// arrows reflect a real shift, not sample-to-sample noise.
const NOISE_THRESHOLD_RATIO = 0.02;

function delta(current: number, priorValues: number[]): TrendDelta {
  if (priorValues.length === 0) {
    return { direction: "flat", current, previousAvg: current };
  }
  const previousAvg =
    priorValues.reduce((sum, v) => sum + v, 0) / priorValues.length;
  const diff = current - previousAvg;
  const threshold = Math.abs(previousAvg) * NOISE_THRESHOLD_RATIO;
  const direction = diff > threshold ? "up" : diff < -threshold ? "down" : "flat";
  return { direction, current, previousAvg };
}

export function computeTrend(
  current: AnalysisScalarRow,
  priorRows: AnalysisScalarRow[],
): Trend {
  const recurringFlaggedWords =
    priorRows.length === 0
      ? []
      : current.top_flagged_words.filter((word) => {
          const appearances = priorRows.filter((row) =>
            row.top_flagged_words.includes(word),
          ).length;
          return appearances / priorRows.length >= 0.5;
        });

  return {
    hasHistory: priorRows.length > 0,
    vocabularyRange: delta(
      current.distinct_word_ratio,
      priorRows.map((r) => r.distinct_word_ratio),
    ),
    overusedWords: delta(
      current.overused_word_count,
      priorRows.map((r) => r.overused_word_count),
    ),
    sentenceVariety: delta(
      current.sentence_length_stddev,
      priorRows.map((r) => r.sentence_length_stddev),
    ),
    complexSentenceRatio: delta(
      current.complex_sentence_ratio,
      priorRows.map((r) => r.complex_sentence_ratio),
    ),
    recurringFlaggedWords,
  };
}
