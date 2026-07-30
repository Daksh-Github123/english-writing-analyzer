import type { Document, ItemSentence, ItemToken } from "wink-nlp";
import { its } from "./engine";
import type { ClauseComplexity } from "./types";

// The lite POS model tags true subordinating conjunctions as SCONJ, but
// relative pronouns like "which"/"that" introducing a clause are often
// tagged PRON/DET instead. This list catches those cases too - it's a
// heuristic, not a dependency parse, so it will misfire on non-clausal
// uses (e.g. "that" as a demonstrative).
const SUBORDINATORS = new Set([
  "because", "although", "since", "while", "if", "when", "unless",
  "though", "whereas", "that", "which", "who", "whom", "before",
  "after", "until", "once",
]);

export function computeClauseComplexity(doc: Document): ClauseComplexity {
  let simple = 0;
  let compound = 0;
  let complex = 0;

  doc.sentences().each((sentence: ItemSentence) => {
    let hasCoordinator = false;
    let hasSubordinator = false;

    sentence.tokens().each((token: ItemToken) => {
      const pos = token.out(its.pos);
      const normal = (token.out(its.normal) as string).toLowerCase();
      if (pos === "CCONJ") hasCoordinator = true;
      if (pos === "SCONJ" || SUBORDINATORS.has(normal)) hasSubordinator = true;
    });

    if (hasSubordinator) complex++;
    else if (hasCoordinator) compound++;
    else simple++;
  });

  const total = simple + compound + complex;

  return {
    simple,
    compound,
    complex,
    total,
    simpleRatio: total ? simple / total : 0,
    compoundRatio: total ? compound / total : 0,
    complexRatio: total ? complex / total : 0,
  };
}
