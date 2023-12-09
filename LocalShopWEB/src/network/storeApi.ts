import { Store } from "../models/store";
import ApiService from "./api";

const baseUrl = "/api/stores";
const apiService = ApiService.getInstance();

export async function fetchStores(): Promise<Store[]> {
  const response = await apiService
    .getApi()
    .get(baseUrl, { withCredentials: true });
  return response.data;
}

export interface StoreInput {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  cnpj: string;
}

export async function createStore(store: StoreInput): Promise<Store> {
  const response = await apiService.getApi().post(baseUrl, store);
  return response.data;
}

export async function getStore(storeId: string): Promise<Store> {
  const response = await apiService.getApi().get(`${baseUrl}/${storeId}`);
  return response.data;
}

export async function updateStore(
  storeId: string,
  store: StoreInput
): Promise<Store> {
  const response = await apiService
    .getApi()
    .patch(`${baseUrl}/${storeId}`, store);
  return response.data;
}

export interface ListStores {
  name?: string;
  category?: string;
}

export async function listStores(filterStores: ListStores): Promise<Store[]> {
  const response = await apiService.getApi().get(`${baseUrl}/list`, {
    params: filterStores,
  });
  return response.data;
}

export async function getCategories() {
  const response = await apiService.getApi().get(`${baseUrl}/categories`);
  return response.data;
}

export async function deleteStore(storeId: string) {
  await apiService.getApi().delete(`${baseUrl}/${storeId}`);
}

export async function setSessionStoreId(storeId: string) {
  await apiService.getApi().patch(`${baseUrl}/session/${storeId}`);
}

export async function getStoreByLoggedUser(): Promise<Store> {
  const response = await apiService.getApi().get(`${baseUrl}/session`);
  return response.data;
}
