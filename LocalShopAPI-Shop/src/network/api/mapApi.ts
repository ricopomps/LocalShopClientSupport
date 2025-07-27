import { PopulatedShoppingList } from "../../service/shoppingListService";
import ApiService from "../api";
import { CellCoordinates } from "./productsApi";
export interface Map {
  items: CellCoordinates[];
}

const baseUrl = "/api/map";
const apiService = new ApiService(process.env.API_GATEWAY_BASE_URL);

export async function saveMap(map: Map, token: string): Promise<void> {
  const { data } = await apiService.getApi(token).post(baseUrl, map);
  return data;
}

export async function getMap(storeId: string, token: string): Promise<Map> {
  const { data } = await apiService.getApi(token).get(`${baseUrl}/${storeId}`);
  return data;
}

export async function calculatePath(
  storeId: string,
  shoppingList: PopulatedShoppingList,
  token: string
): Promise<CellCoordinates[][]> {
  const { data } = await apiService
    .getApi(token)
    .post(`${baseUrl}/path`, { storeId, shoppingList });
  return data;
}
