import { ShoppingListHistory } from "../../models/shoppingListHistory";
import ApiService from "../api";

const baseUrl = "/api/shoppingListHistory";
const apiService = new ApiService(process.env.API_HISTORY_BASE_URL);

export const getHistorics = async (
  token: string
): Promise<ShoppingListHistory[]> => {
  const response = await apiService.getApi(token).get(baseUrl);
  return response.data;
};

export const getHistoric = async (
  historicId: string,
  token: string
): Promise<ShoppingListHistory> => {
  const response = await apiService
    .getApi(token)
    .get(`${baseUrl}/${historicId}`);
  return response.data;
};

export const getStoreHistoric = async (
  startDate: Date,
  endDate: Date,
  token: string
): Promise<ShoppingListHistory[]> => {
  const response = await apiService.getApi(token).get(`${baseUrl}/store`, {
    params: {
      startDate,
      endDate,
    },
  });
  return response.data;
};
