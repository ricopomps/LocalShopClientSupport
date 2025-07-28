import { CellCoordinates } from "../components/Grid";
import { ProductItem } from "../context/ShoppingListContext";
import ApiService from "./api";

export interface ShoppingList {
  storeId: string;
  products: ShoppingListProductItem[];
  totalValue?: number;
}

interface ShoppingListProductItem {
  product: string;
  quantity: number;
}
export interface ShoppingListReturn {
  storeId: string;
  products: ProductItem[];
  totalValue?: number;
}

const baseUrl = "/api/shoppinglist";
const apiService = ApiService.getInstance();

export const createShoppingList = async (shoppingList: ShoppingList) => {
  const response = await apiService.getApi().post(baseUrl, shoppingList);
  return response.data;
};

export const getShoppingList = async (
  storeId: string
): Promise<ShoppingListReturn> => {
  const response = await apiService.getApi().get(`${baseUrl}/${storeId}`);
  return response.data;
};

export const finishShoppingList = async (shoppingList: ShoppingList) => {
  await apiService.getApi().post(`${baseUrl}/finish`, shoppingList);
};

export const copyShoppingList = async (historicId: string) => {
  await apiService.getApi().post(`${baseUrl}/copy/${historicId}`);
};

export const getShoppingListPath = async (
  shoppingList: ShoppingList
): Promise<CellCoordinates[][]> => {
  const response = await apiService
    .getApi()
    .post(`${baseUrl}/path`, shoppingList);
  return response.data;
};
