import { Product } from "@/src/types/product";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-lg border border-zinc-200 p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{product.title}</h2>
      <p className="mt-2 text-sm text-zinc-600">{product.description}</p>
      <p className="mt-3 text-base font-medium">${product.price.toFixed(2)}</p>

      {product.image ? (
        <a
          href={product.image}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm text-blue-600 hover:underline"
        >
          View image
        </a>
      ) : null}
    </article>
  );
}

