import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="max-w-sm space-y-3 text-center">
        <h1 className="text-lg font-semibold">Sign-in link invalid</h1>
        <p className="text-sm text-zinc-500">
          That link has expired or was already used. Request a new one.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm font-medium underline"
        >
          Back to sign in
        </Link>
      </div>
    </main>
  );
}
