import { Historic } from "../models/historic";
import ApiService from "./api";

const baseUrl = "/api/shoppingListHistory";
const apiService = ApiService.getInstance();

export const getHistorics = async (): Promise<Historic[]> => {
  const response = await apiService.getApi().get(baseUrl);
  return response.data;
};

export const getHistoric = async (historicId: string): Promise<Historic> => {
  const response = await apiService.getApi().get(`${baseUrl}/${historicId}`);
  return response.data;
};
