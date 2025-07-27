import { Types } from "mongoose";
import { Product } from "../../models/product";
import ApiService from "../api";

const baseUrl = "/api/products";
const apiService = new ApiService(process.env.API_GATEWAY_BASE_URL);

export async function fetchProducts(
  storeId: string,
  page: number,
  token: string,
  take?: number
): Promise<Product[]> {
  const response = await apiService
    .getApi(token)
    .get(`${baseUrl}?storeId=${storeId}&page=${page}&take=${take ?? 10}`, {
      withCredentials: true,
    });
  return response.data;
}

export interface CellCoordinates {
  x: number;
  y: number;
  type?: string;
  productId?: string;
}

export interface ProductInput {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  category: string;
  storeId: string;
  location?: CellCoordinates;
  sale?: boolean;
  promotionPercent?: number;
  oldPrice?: number;
  stock?: number;
}

export async function createProduct(
  product: ProductInput,
  token: string
): Promise<Product> {
  const response = await apiService.getApi(token).post(baseUrl, product);
  return response.data;
}

export async function updateProduct(
  productId: string,
  product: ProductInput,
  token: string
): Promise<Product> {
  const response = await apiService
    .getApi(token)
    .patch(`${baseUrl}/${productId}`, product);
  return response.data;
}

export async function deleteProduct(productId: string, token: string) {
  await apiService.getApi(token).delete(`${baseUrl}/${productId}`);
}

export interface ListProducts {
  productName?: string;
  category?: string;
  priceFrom?: number;
  priceTo?: number;
  favorite?: boolean;
}

export async function listProducts(
  storeId: string,
  filterProducts: ListProducts,
  token: string
): Promise<Product[]> {
  const response = await apiService
    .getApi(token)
    .get(`${baseUrl}/store/${storeId}`, {
      params: filterProducts,
    });
  return response.data;
}

export async function getCategories(token: string) {
  const response = await apiService.getApi(token).get(`${baseUrl}/categories`);
  return response.data;
}

export async function getSortOptions(token: string) {
  const response = await apiService.getApi(token).get(`${baseUrl}/sort`);
  return response.data;
}

export async function getProductList(
  token: string
): Promise<{ _id: string; name: string }[]> {
  const response = await apiService.getApi(token).get(`${baseUrl}/list`);
  return response.data;
}

export async function getProduct(
  productId: string,
  token: string
): Promise<Product> {
  const response = await apiService
    .getApi(token)
    .get(`${baseUrl}/${productId}`);
  return response.data;
}

export async function getProductsList(
  productsIds: Types.ObjectId[],
  token: string
): Promise<Product[]> {
  const response = await apiService
    .getApi(token)
    .post(`${baseUrl}/getProductsList`, { productsIds });
  return response.data;
}

export async function removeStock(
  productId: Types.ObjectId,
  quantity: number,
  token: string
): Promise<void> {
  const response = await apiService
    .getApi(token)
    .patch(`${baseUrl}/removeStock`, { productId, quantity });
  return response.data;
}
