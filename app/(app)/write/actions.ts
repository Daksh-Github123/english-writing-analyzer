"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  // Stub analysis until the NLP pipeline (Phase D) replaces this with
  // real POS-tagging/repetition/sentence-structure output.
  const { error: analysisError } = await supabase.from("analysis_results").insert({
    sample_id: sample.id,
    verb_frequency: [],
    adjective_frequency: [],
    repetition_flags: [],
    sentence_stats: {},
    clause_complexity: {},
    distinct_word_ratio: 0,
    overused_word_count: 0,
    avg_sentence_length: 0,
    sentence_length_stddev: 0,
    complex_sentence_ratio: 0,
    top_flagged_words: [],
  });

  if (analysisError) {
    return { error: analysisError.message };
  }

  revalidatePath("/history");
  redirect(`/results/${sample.id}`);
}
