export type ThesaurusPos = "verb" | "adjective" | "adverb" | "noun";

export interface ThesaurusAlternative {
  word: string;
  example: string;
}

export interface ThesaurusEntry {
  lemma: string;
  pos: ThesaurusPos;
  alternatives: ThesaurusAlternative[];
}

export const OVERUSED_WORDS: Record<string, ThesaurusEntry> = {
  said: {
    lemma: "said",
    pos: "verb",
    alternatives: [
      { word: "stated", example: "She stated that the results were final." },
      { word: "remarked", example: '"That\'s odd," he remarked.' },
      { word: "exclaimed", example: '"Watch out!" she exclaimed.' },
      { word: "muttered", example: "He muttered an apology under his breath." },
      { word: "insisted", example: '"I did nothing wrong," she insisted.' },
    ],
  },
  get: {
    lemma: "get",
    pos: "verb",
    alternatives: [
      { word: "obtain", example: "She obtained a copy of the report." },
      { word: "acquire", example: "The company acquired a smaller rival." },
      { word: "receive", example: "He received the award in person." },
      { word: "secure", example: "They secured funding for the project." },
    ],
  },
  make: {
    lemma: "make",
    pos: "verb",
    alternatives: [
      { word: "create", example: "They created a new prototype overnight." },
      { word: "produce", example: "The factory produces two thousand units a day." },
      { word: "construct", example: "Engineers constructed the bridge in six months." },
      { word: "craft", example: "She crafted a careful reply." },
    ],
  },
  look: {
    lemma: "look",
    pos: "verb",
    alternatives: [
      { word: "glance", example: "He glanced at his watch." },
      { word: "peer", example: "She peered through the fog." },
      { word: "gaze", example: "They gazed at the horizon in silence." },
      { word: "scan", example: "He scanned the room for a familiar face." },
    ],
  },
  walk: {
    lemma: "walk",
    pos: "verb",
    alternatives: [
      { word: "stride", example: "She strode into the meeting, unbothered." },
      { word: "amble", example: "They ambled along the riverbank." },
      { word: "wander", example: "He wandered through the old quarter." },
      { word: "trudge", example: "She trudged home through the snow." },
    ],
  },
  go: {
    lemma: "go",
    pos: "verb",
    alternatives: [
      { word: "head", example: "We headed toward the exit." },
      { word: "proceed", example: "The team proceeded to the next stage." },
      { word: "venture", example: "They ventured into the unknown." },
    ],
  },
  very: {
    lemma: "very",
    pos: "adverb",
    alternatives: [
      { word: "(replace with a stronger adjective)", example: '"very tired" -> "exhausted"' },
      { word: "remarkably", example: "The results were remarkably consistent." },
      { word: "genuinely", example: "She was genuinely surprised." },
      { word: "notably", example: "The change was notably effective." },
    ],
  },
  really: {
    lemma: "really",
    pos: "adverb",
    alternatives: [
      { word: "(replace with a stronger verb/adjective)", example: '"really wanted" -> "craved"' },
      { word: "truly", example: "It was truly the best outcome we could ask for." },
      { word: "genuinely", example: "He was genuinely relieved." },
    ],
  },
  good: {
    lemma: "good",
    pos: "adjective",
    alternatives: [
      { word: "excellent", example: "It was an excellent decision." },
      { word: "solid", example: "That was a solid first draft." },
      { word: "commendable", example: "Her effort was commendable." },
      { word: "admirable", example: "His restraint was admirable." },
    ],
  },
  bad: {
    lemma: "bad",
    pos: "adjective",
    alternatives: [
      { word: "poor", example: "The visibility was poor that morning." },
      { word: "flawed", example: "The plan was fundamentally flawed." },
      { word: "dismal", example: "Attendance was dismal." },
      { word: "subpar", example: "The results were subpar." },
    ],
  },
  nice: {
    lemma: "nice",
    pos: "adjective",
    alternatives: [
      { word: "pleasant", example: "It was a pleasant afternoon." },
      { word: "charming", example: "The cafe had a charming atmosphere." },
      { word: "delightful", example: "The surprise was delightful." },
      { word: "considerate", example: "That was a considerate thing to do." },
    ],
  },
  big: {
    lemma: "big",
    pos: "adjective",
    alternatives: [
      { word: "substantial", example: "They made a substantial investment." },
      { word: "massive", example: "A massive crowd gathered outside." },
      { word: "considerable", example: "The gap was considerable." },
      { word: "significant", example: "It marked a significant shift in strategy." },
    ],
  },
  small: {
    lemma: "small",
    pos: "adjective",
    alternatives: [
      { word: "modest", example: "They started with a modest budget." },
      { word: "minor", example: "It was a minor setback." },
      { word: "compact", example: "The kitchen was compact but efficient." },
    ],
  },
  happy: {
    lemma: "happy",
    pos: "adjective",
    alternatives: [
      { word: "delighted", example: "She was delighted with the outcome." },
      { word: "content", example: "He seemed content with the decision." },
      { word: "elated", example: "The team was elated after the win." },
    ],
  },
  interesting: {
    lemma: "interesting",
    pos: "adjective",
    alternatives: [
      { word: "compelling", example: "It was a compelling argument." },
      { word: "intriguing", example: "The findings were intriguing." },
      { word: "fascinating", example: "She found the topic fascinating." },
    ],
  },
  thing: {
    lemma: "thing",
    pos: "noun",
    alternatives: [
      { word: "(replace with the specific noun)", example: '"the thing I noticed" -> "the pattern I noticed"' },
      { word: "factor", example: "Cost was the deciding factor." },
      { word: "detail", example: "That detail changed everything." },
      { word: "issue", example: "It raised a deeper issue." },
    ],
  },
};

export function lookupOverused(lemma: string): ThesaurusEntry | undefined {
  return OVERUSED_WORDS[lemma.toLowerCase()];
}
