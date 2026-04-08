import { Product } from "@/src/types/product";

export function toProduct(product: Partial<Product>, index: number): Product {
  return {
    id: String(product.id ?? index),
    title: product.title ?? "Unnamed product",
    description: product.description ?? "No description",
    image: product.image ?? "",
    price: Number(product.price ?? 0),
  };
}

