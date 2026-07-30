"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { analyzeText } from "@/lib/nlp/pipeline";
import type { Json } from "@/types/database";

// Round-trips through JSON so optional fields (e.g. `alternatives?`) and
// nested interfaces satisfy the generated `Json` column type exactly.
function toJson(value: unknown): Json {
  return JSON.parse(JSON.stringify(value));
}

const MAX_CHARS = 20000;

export type CreateSampleState = { error: string } | null;

export async function createSample(
  _prevState: CreateSampleState,
  formData: FormData,
): Promise<CreateSampleState> {
  const rawText = String(formData.get("text") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim() || null;

  if (!rawText) {
    return { error: "Writing sample cannot be empty." };
  }
  if (rawText.length > MAX_CHARS) {
    return { error: `Writing sample exceeds the ${MAX_CHARS}-character limit.` };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;

  const { data: sample, error: sampleError } = await supabase
    .from("samples")
    .insert({ raw_text: rawText, title, word_count: wordCount })
    .select("id")
    .single();

  if (sampleError || !sample) {
    return { error: sampleError?.message ?? "Failed to save sample." };
  }

  const analysis = analyzeText(rawText);

  const { error: analysisError } = await supabase.from("analysis_results").insert({
    sample_id: sample.id,
    verb_frequency: toJson(analysis.verbFrequency),
    adjective_frequency: toJson(analysis.adjectiveFrequency),
    repetition_flags: toJson(analysis.repetitionFlags),
    sentence_stats: toJson(analysis.sentenceStats),
    clause_complexity: toJson(analysis.clauseComplexity),
    distinct_word_ratio: analysis.distinctWordRatio,
    overused_word_count: analysis.overusedWordCount,
    avg_sentence_length: analysis.sentenceStats.avgLength,
    sentence_length_stddev: analysis.sentenceStats.stdDevLength,
    complex_sentence_ratio: analysis.clauseComplexity.complexRatio,
    top_flagged_words: analysis.topFlaggedWords,
  });

  if (analysisError) {
    return { error: analysisError.message };
  }

  revalidatePath("/history");
  redirect(`/results/${sample.id}`);
}
