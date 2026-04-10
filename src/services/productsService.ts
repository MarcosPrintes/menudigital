import { API_ENDPOINTS } from "@/src/constants/endpoints";
import { getApiUrl } from "@/src/services/config/apiConfig";
import { Product } from "@/src/types/product";
import { ServiceResult } from "@/src/types/serviceResult";
import { toProduct } from "@/src/utils/productMapper";

type ProductResponse = Partial<Product>;

type ProductsApiResponse = {
  data?: {
    products?: ProductResponse[];
  };
};

export type ProductsError = {
  message: string;
  status?: number;
};

export async function getProducts(): Promise<ServiceResult<Product[], ProductsError>> {
  const response = await fetch(`${getApiUrl()}${API_ENDPOINTS.PRODUCTS}`, {
    cache: "no-store",
    next: {
      revalidate: 60,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return {
      success: false,
      error: {
        message: "Could not fetch products.",
        status: response.status,
      },
    };
  }

  const jsonParsed = (await response.json()) as ProductResponse[] | ProductsApiResponse;

  if (Array.isArray(jsonParsed)) {
    return {
      success: true,
      data: jsonParsed.map(toProduct),
    };
  }

  if (!Array.isArray(jsonParsed.data?.products)) {
    return {
      success: false,
      error: {
        message: "Products API response has an unexpected format.",
      },
    };
  }

  return {
    success: true,
    data: jsonParsed.data.products.map(toProduct),
  };
}
