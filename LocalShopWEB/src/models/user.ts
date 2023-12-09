import { Store } from "./store";

export interface User {
  username: string;
  email: string;
  userType: UserType;
  store?: Store;
  cpf: string;
  favoriteStores: string[];
  favoriteProducts: string[];
  image?: string;
  googleUser?: boolean;
}

export enum UserType {
  shopper = "shopper",
  store = "lojista",
}
