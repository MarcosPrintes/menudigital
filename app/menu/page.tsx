import { ProductList } from "@/src/components/menu/ProductList";
import { Header } from "@/src/components/layout/Header";
import { getProducts } from "@/src/services/productsService";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Menu",
  description: "List of available products",
};

export default async function MenuPage() {
  const productsResult = await getProducts();

  if (!productsResult.success) {
    const statusInfo = productsResult.error.status
      ? ` (status ${productsResult.error.status})`
      : "";
    throw new Error(`${productsResult.error.message}${statusInfo}`);
  }

  if (productsResult.data.length === 0) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-4xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Menu</h1>
          <p className="mt-2 text-zinc-600">Available products from the API.</p>
        </header>

        <ProductList products={productsResult.data} />
      </main>
    </>
  );
}
