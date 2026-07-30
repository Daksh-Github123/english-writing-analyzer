import { createClient } from "@/lib/supabase/server";
import { HistoryList, type HistoryItem } from "@/components/HistoryList";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("samples")
    .select(
      "id, title, word_count, created_at, analysis_results(overused_word_count, distinct_word_ratio)",
    )
    .order("created_at", { ascending: false });

  const samples: HistoryItem[] = (data ?? []).map((sample) => {
    const analysis = Array.isArray(sample.analysis_results)
      ? sample.analysis_results[0]
      : sample.analysis_results;
    return {
      id: sample.id,
      title: sample.title,
      word_count: sample.word_count,
      created_at: sample.created_at,
      overused_word_count: analysis?.overused_word_count ?? null,
      distinct_word_ratio: analysis?.distinct_word_ratio ?? null,
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">History</h1>
      <HistoryList samples={samples} />
    </div>
  );
}
