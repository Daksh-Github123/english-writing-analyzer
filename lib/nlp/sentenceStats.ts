import type { Document, ItemSentence } from "wink-nlp";
import { its, itsLemma } from "./engine";
import type { SentenceStats } from "./types";

export function computeSentenceStats(doc: Document): SentenceStats {
  const lengths: number[] = [];
  const openers = new Map<string, number>();

  doc.sentences().each((sentence: ItemSentence) => {
    const contentTokens = sentence
      .tokens()
      .filter((t) => t.out(its.pos) !== "PUNCT" && t.out(its.pos) !== "SPACE");
    const count = contentTokens.length();
    lengths.push(count);

    if (count > 0) {
      const opener = (contentTokens.itemAt(0).out(itsLemma) as string).toLowerCase();
      openers.set(opener, (openers.get(opener) ?? 0) + 1);
    }
  });

  const sentenceCount = lengths.length;
  const avgLength = sentenceCount
    ? lengths.reduce((sum, l) => sum + l, 0) / sentenceCount
    : 0;
  const variance = sentenceCount
    ? lengths.reduce((sum, l) => sum + (l - avgLength) ** 2, 0) / sentenceCount
    : 0;
  const stdDevLength = Math.sqrt(variance);

  const openerCounts = [...openers.entries()]
    .map(([opener, count]) => ({ opener, count }))
    .sort((a, b) => b.count - a.count);

  const dominantOpenerShare = sentenceCount
    ? (openerCounts[0]?.count ?? 0) / sentenceCount
    : 0;

  return {
    sentenceCount,
    avgLength,
    stdDevLength,
    lengths,
    openerCounts,
    dominantOpenerShare,
  };
}
