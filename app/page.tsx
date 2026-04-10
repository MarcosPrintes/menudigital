import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10">
      <header className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Home</h1>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Register
          </Link>
        </nav>
      </header>

      <p className="text-zinc-600">Welcome! Use the links above to continue.</p>
    </main>
  );
}
