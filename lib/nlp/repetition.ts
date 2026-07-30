import type { Document } from "wink-nlp";
import { its, itsLemma } from "./engine";
import type { RepetitionFlag, RepetitionOccurrence } from "./types";

// Window is measured in content tokens (stopwords/punctuation excluded),
// not raw tokens, so it reflects perceived density of repeated words.
const WINDOW_SIZE = 60;
const MIN_OCCURRENCES = 3;
const SNIPPET_RADIUS = 40;

const EXCLUDED_POS = new Set(["PUNCT", "SPACE", "SYM", "PROPN", "NUM"]);

interface ContentToken {
  lemma: string;
  start: number;
  end: number;
}

// wink-nlp doesn't expose character offsets directly, so offsets are
// reconstructed by walking the raw text and locating each token's exact
// (case-preserving) value in order. Falls back to the running cursor if a
// token can't be found (should not normally happen).
function computeTokenOffsets(
  rawText: string,
  values: string[],
): Array<[number, number]> {
  let cursor = 0;
  const offsets: Array<[number, number]> = [];
  for (const value of values) {
    if (!value) {
      offsets.push([cursor, cursor]);
      continue;
    }
    const idx = rawText.indexOf(value, cursor);
    const start = idx === -1 ? cursor : idx;
    const end = start + value.length;
    offsets.push([start, end]);
    cursor = end;
  }
  return offsets;
}

function severityFor(occurrenceCount: number): RepetitionFlag["severity"] {
  if (occurrenceCount >= 6) return "high";
  if (occurrenceCount >= 4) return "medium";
  return "low";
}

export function detectRepetition(doc: Document, rawText: string): RepetitionFlag[] {
  const tokens = doc.tokens();
  const values = tokens.out(its.value) as string[];
  const lemmas = tokens.out(itsLemma) as string[];
  const poses = tokens.out(its.pos) as string[];
  const stopFlags = tokens.out(its.stopWordFlag) as boolean[];
  const offsets = computeTokenOffsets(rawText, values);

  const contentTokens: ContentToken[] = [];
  for (let i = 0; i < values.length; i++) {
    if (stopFlags[i] || EXCLUDED_POS.has(poses[i])) continue;
    contentTokens.push({
      lemma: lemmas[i].toLowerCase(),
      start: offsets[i][0],
      end: offsets[i][1],
    });
  }

  // Single pass: for each lemma, track its last MIN_OCCURRENCES positions.
  // If those span <= WINDOW_SIZE content tokens, it's a repetition cluster.
  const recentPositions = new Map<string, number[]>();
  const flaggedLemmas = new Set<string>();

  contentTokens.forEach((token, index) => {
    const recent = recentPositions.get(token.lemma) ?? [];
    recent.push(index);
    if (recent.length > MIN_OCCURRENCES) recent.shift();
    recentPositions.set(token.lemma, recent);

    if (
      recent.length === MIN_OCCURRENCES &&
      index - recent[0] <= WINDOW_SIZE
    ) {
      flaggedLemmas.add(token.lemma);
    }
  });

  if (flaggedLemmas.size === 0) return [];

  const occurrencesByLemma = new Map<string, RepetitionOccurrence[]>();
  for (const token of contentTokens) {
    if (!flaggedLemmas.has(token.lemma)) continue;
    const snippet = rawText
      .slice(
        Math.max(0, token.start - SNIPPET_RADIUS),
        Math.min(rawText.length, token.end + SNIPPET_RADIUS),
      )
      .replace(/\s+/g, " ")
      .trim();

    const list = occurrencesByLemma.get(token.lemma) ?? [];
    list.push({ start: token.start, end: token.end, snippet });
    occurrencesByLemma.set(token.lemma, list);
  }

  return [...occurrencesByLemma.entries()]
    .map(([lemma, occurrences]) => ({
      lemma,
      occurrences,
      severity: severityFor(occurrences.length),
    }))
    .sort((a, b) => b.occurrences.length - a.occurrences.length);
}
