import type { Document, PartOfSpeech } from "wink-nlp";
import { its, itsLemma } from "./engine";
import { lookupOverused } from "@/lib/thesaurus";
import type { WordFreqEntry } from "./types";

const TOP_N = 15;
// Only auto-flag an unlisted lemma as generically "frequent" once it
// dominates the ranked list, not merely because it appears more than once.
const FREQUENT_SHARE_THRESHOLD = 0.5;
const FREQUENT_MIN_COUNT = 3;

function rankByPOS(doc: Document, pos: PartOfSpeech): WordFreqEntry[] {
  const lemmas = doc
    .tokens()
    .filter((t) => t.out(its.pos) === pos)
    .out(itsLemma) as string[];

  const freq = new Map<string, number>();
  for (const lemma of lemmas) {
    const key = lemma.toLowerCase();
    freq.set(key, (freq.get(key) ?? 0) + 1);
  }

  const sorted = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N);
  const maxCount = sorted[0]?.[1] ?? 0;

  return sorted.map(([lemma, count]) => {
    const thesaurusEntry = lookupOverused(lemma);
    if (thesaurusEntry) {
      return {
        lemma,
        count,
        flagged: true,
        flagReason: "overused",
        alternatives: thesaurusEntry.alternatives,
      };
    }

    const isFrequent =
      maxCount > 0 &&
      count / maxCount >= FREQUENT_SHARE_THRESHOLD &&
      count >= FREQUENT_MIN_COUNT;

    return {
      lemma,
      count,
      flagged: isFrequent,
      flagReason: isFrequent ? "frequent" : undefined,
    };
  });
}

export function extractVerbFrequency(doc: Document): WordFreqEntry[] {
  return rankByPOS(doc, "VERB");
}

export function extractAdjectiveFrequency(doc: Document): WordFreqEntry[] {
  return rankByPOS(doc, "ADJ");
}
