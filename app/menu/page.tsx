import { ProductList } from "@/src/components/menu/ProductList";
import { getProducts } from "@/src/services/productsService";

export const metadata = {
  title: "Menu",
  description: "List of available products",
};

export default async function MenuPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Menu</h1>
        <p className="mt-2 text-zinc-600">Available products from the API.</p>
      </header>

      <ProductList products={products} />
    </main>
  );
}

