"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createSample, type CreateSampleState } from "@/app/(app)/write/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-zinc-900"
    >
      {pending ? "Analyzing..." : "Analyze"}
    </button>
  );
}

export function WriteForm() {
  const [state, formAction] = useActionState<CreateSampleState, FormData>(
    createSample,
    null,
  );

  return (
    <form action={formAction} className="space-y-3">
      <input
        type="text"
        name="title"
        placeholder="Title (optional)"
        className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
      <textarea
        name="text"
        required
        rows={16}
        placeholder="Paste your writing sample here..."
        className="w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
