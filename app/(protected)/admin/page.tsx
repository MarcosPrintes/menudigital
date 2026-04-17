export const metadata = {
  title: "Admin",
  description: "Administrative area",
};

export default function AdminPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="mt-2 text-zinc-600">
          You are authenticated and can access the administrative area.
        </p>
      </header>
    </main>
  );
}
