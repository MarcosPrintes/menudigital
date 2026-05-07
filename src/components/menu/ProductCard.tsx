import { Product } from "@/src/types/product";

type ProductCardProps = {
  product: Product;
  onDeleteProduct: (productId: string) => Promise<void>;
};

function getSafeImageUrl(rawUrl: string): string | null {
  try {
    const parsedUrl = new URL(rawUrl);
    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      return parsedUrl.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function ProductCard({ product, onDeleteProduct }: ProductCardProps) {
  const deleteAction = onDeleteProduct.bind(null, product.id);
  const safeImageUrl = getSafeImageUrl(product.image);

  return (
    <article className="rounded-lg border border-zinc-200 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-lg font-semibold">{product.title}</h2>
        <form action={deleteAction}>
          <button
            type="submit"
            aria-label={`Delete product ${product.title}`}
            title="Delete product"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-red-200 text-red-600 transition hover:bg-red-50 hover:text-red-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 6V4.8c0-.99.81-1.8 1.8-1.8h4.4c.99 0 1.8.81 1.8 1.8V6"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.8 6l.8 13.2A2 2 0 009.6 21h4.8a2 2 0 001.99-1.8L17.2 6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 10.5v6" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10.5v6" />
            </svg>
          </button>
        </form>
      </div>
      <p className="mt-2 text-sm text-zinc-600">{product.description}</p>
      <p className="mt-3 text-base font-medium">${product.price.toFixed(2)}</p>

      {safeImageUrl ? (
        <a
          href={safeImageUrl}
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

