import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { Product } from "@/src/types/product";
import { toProduct } from "@/src/utils/productMapper";

type ProductResponse = Partial<Product>;
type ProductsApiResponse = {
  data?: {
    products?: ProductResponse[];
  };
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${getApiUrl()}${API_ENDPOINTS.PRODUCTS}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Could not fetch products.");
  }

  const jsonParsed = (await response.json()) as ProductResponse[] | ProductsApiResponse;

  if (Array.isArray(jsonParsed)) {
    return jsonParsed.map(toProduct);
  }

  if (!Array.isArray(jsonParsed.data?.products)) {
    return [];
  }

  return jsonParsed.data.products.map(toProduct);
}

