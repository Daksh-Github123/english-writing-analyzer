create table public.samples (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title       text,
  raw_text    text not null,
  word_count  int not null,
  created_at  timestamptz not null default now()
);

create table public.analysis_results (
  id                        uuid primary key default gen_random_uuid(),
  sample_id                 uuid not null unique references public.samples(id) on delete cascade,
  user_id                   uuid not null default auth.uid() references auth.users(id) on delete cascade,

  verb_frequency            jsonb not null,
  adjective_frequency       jsonb not null,
  repetition_flags          jsonb not null,
  sentence_stats            jsonb not null,
  clause_complexity         jsonb not null,

  distinct_word_ratio       numeric not null,
  overused_word_count       int not null,
  avg_sentence_length       numeric not null,
  sentence_length_stddev    numeric not null,
  complex_sentence_ratio    numeric not null,
  top_flagged_words         text[] not null default '{}',

  created_at                timestamptz not null default now()
);

create index samples_user_created_idx on public.samples (user_id, created_at desc);
create index analysis_results_user_created_idx on public.analysis_results (user_id, created_at desc);

alter table public.samples enable row level security;
alter table public.analysis_results enable row level security;

create policy "samples_select_own" on public.samples
  for select using (auth.uid() = user_id);
create policy "samples_insert_own" on public.samples
  for insert with check (auth.uid() = user_id);
create policy "samples_delete_own" on public.samples
  for delete using (auth.uid() = user_id);

create policy "analysis_results_select_own" on public.analysis_results
  for select using (auth.uid() = user_id);
create policy "analysis_results_insert_own" on public.analysis_results
  for insert with check (auth.uid() = user_id);
create policy "analysis_results_delete_own" on public.analysis_results
  for delete using (auth.uid() = user_id);
