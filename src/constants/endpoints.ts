export const API_ENDPOINTS = {
  PRODUCTS: "/products",
  REGISTER: "/register",
  REGISTER_PRODUCT: "/product/register",
  DELETE_PRODUCT: (productId: string) => `/product/${productId}`,
  UPLOAD_IMAGE: "/imagens/upload",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  AUTH_REFRESH: "/auth/refresh",
} as const;
