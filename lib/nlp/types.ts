import type { ThesaurusAlternative } from "@/lib/thesaurus";

export interface WordFreqEntry {
  lemma: string;
  count: number;
  flagged: boolean;
  flagReason?: "overused" | "frequent";
  alternatives?: ThesaurusAlternative[];
}

export interface RepetitionOccurrence {
  start: number;
  end: number;
  snippet: string;
}

export interface RepetitionFlag {
  lemma: string;
  occurrences: RepetitionOccurrence[];
  severity: "low" | "medium" | "high";
}

export interface SentenceStats {
  sentenceCount: number;
  avgLength: number;
  stdDevLength: number;
  lengths: number[];
  openerCounts: { opener: string; count: number }[];
  dominantOpenerShare: number;
}

export interface ClauseComplexity {
  simple: number;
  compound: number;
  complex: number;
  total: number;
  simpleRatio: number;
  compoundRatio: number;
  complexRatio: number;
}

export interface AnalysisResult {
  verbFrequency: WordFreqEntry[];
  adjectiveFrequency: WordFreqEntry[];
  repetitionFlags: RepetitionFlag[];
  sentenceStats: SentenceStats;
  clauseComplexity: ClauseComplexity;
  distinctWordRatio: number;
  overusedWordCount: number;
  topFlaggedWords: string[];
}
