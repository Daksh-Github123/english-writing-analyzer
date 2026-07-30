import { nlp, its, itsLemma } from "./engine";
import { extractVerbFrequency, extractAdjectiveFrequency } from "./posExtraction";
import { detectRepetition } from "./repetition";
import { computeSentenceStats } from "./sentenceStats";
import { computeClauseComplexity } from "./clauseComplexity";
import type { AnalysisResult } from "./types";

const NON_CONTENT_POS = new Set(["PUNCT", "SPACE", "SYM"]);

export function analyzeText(rawText: string): AnalysisResult {
  const doc = nlp.readDoc(rawText);

  const verbFrequency = extractVerbFrequency(doc);
  const adjectiveFrequency = extractAdjectiveFrequency(doc);
  const repetitionFlags = detectRepetition(doc, rawText);
  const sentenceStats = computeSentenceStats(doc);
  const clauseComplexity = computeClauseComplexity(doc);

  const contentLemmas = (
    doc
      .tokens()
      .filter(
        (t) => !t.out(its.stopWordFlag) && !NON_CONTENT_POS.has(t.out(its.pos) as string),
      )
      .out(itsLemma) as string[]
  ).map((l) => l.toLowerCase());

  const distinctWordRatio = contentLemmas.length
    ? new Set(contentLemmas).size / contentLemmas.length
    : 0;

  const overusedEntries = [...verbFrequency, ...adjectiveFrequency].filter(
    (w) => w.flagReason === "overused",
  );
  const overusedWordCount = overusedEntries.reduce((sum, w) => sum + w.count, 0);
  const topFlaggedWords = overusedEntries
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
    .map((w) => w.lemma);

  return {
    verbFrequency,
    adjectiveFrequency,
    repetitionFlags,
    sentenceStats,
    clauseComplexity,
    distinctWordRatio,
    overusedWordCount,
    topFlaggedWords,
  };
}
