import { CellCoordinates } from "../components/Grid";
import ApiService from "./api";

export interface Map {
  items: CellCoordinates[];
}

const baseUrl = "/api/map";
const apiService = ApiService.getInstance();

export async function saveMap(map: Map): Promise<void> {
  const { data } = await apiService.getApi().post(baseUrl, map);
  return data;
}

export async function getMap(storeId: string): Promise<Map> {
  const { data } = await apiService.getApi().get(`${baseUrl}/${storeId}`);
  return data;
}
