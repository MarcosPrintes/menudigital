import Link from "next/link";

export const metadata = {
  title: "Login",
  description: "Sign in to continue",
};

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form className="w-full rounded-lg border border-zinc-200 p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold">Login</h1>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Login
          </button>
          <Link
            href="/"
            className="w-full rounded-md border border-zinc-300 px-4 py-2 text-center text-sm font-medium hover:bg-zinc-100"
          >
            Go back
          </Link>
        </div>
      </form>
    </main>
  );
}
