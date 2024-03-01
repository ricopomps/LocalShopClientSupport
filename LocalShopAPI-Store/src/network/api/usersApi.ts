import { Types } from "mongoose";
import { User, UserType } from "../../models/user";
import ApiService from "../api";
//USER ROUTES
const apiService = new ApiService(process.env.API_USERS_BASE_URL);

export async function getLoggedInUser(): Promise<User> {
  const response = await apiService.getApi().get("/api/users");
  return response.data;
}

export interface SignUpCredentials {
  username: string;
  email: string;
  password: string;
  userType: UserType;
  cpf: string;
  confirmedPassword: string;
}

export async function signUp(
  credentials: SignUpCredentials,
  setAccessToken: (accessToken: string) => void
): Promise<User> {
  const { data } = await apiService
    .getApi()
    .post("/api/users/signup", credentials);
  setAccessToken(data.accessToken);
  return data.user;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export async function login(
  credentials: LoginCredentials,
  setAccessToken: (accessToken: string) => void
): Promise<User> {
  const {
    data: { user, accessToken },
  } = await apiService.getApi().post("/api/auth", credentials);
  setAccessToken(accessToken);
  return user;
}

export async function logout() {
  await apiService.getApi().post("/api/auth/logout");
}

export async function favoriteStore(storeId: string) {
  const response = await apiService.getApi().post("/api/users/favoriteStores", {
    storeId,
  });
  return response.data;
}

export async function favoriteProduct(productId: string) {
  const response = await apiService
    .getApi()
    .post("/api/users/favoriteProduct", {
      productId,
    });
  return response.data;
}

export async function unfavoriteProduct(productId: string) {
  const response = await apiService
    .getApi()
    .post("/api/users/unFavoriteProduct", {
      productId,
    });
  return response.data;
}

export async function unfavoriteStore(storeId: string) {
  const response = await apiService
    .getApi()
    .post("/api/users/unFavoriteStores", {
      storeId,
    });
  return response.data;
}

export async function getUsersByFavoriteProduct(
  productId: string,
  token?: string
): Promise<User[]> {
  const response = await apiService
    .getApi(token)
    .get(`/api/users/favoriteProduct/${productId}`);
  return response.data;
}

export async function getUserFavoriteStores(
  token?: string
): Promise<Types.ObjectId[]> {
  const response = await apiService
    .getApi(token)
    .get(`/api/users/favoriteStores`);
  return response.data;
}

export async function getUserFavoriteProducts(
  token?: string
): Promise<Types.ObjectId[]> {
  const response = await apiService
    .getApi(token)
    .get(`/api/users/favoriteProducts`);
  return response.data;
}
