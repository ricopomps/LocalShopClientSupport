import { ProductItem } from "../context/ShoppingListContext";
import { Store } from "./store";

export interface Historic {
  _id: string;
  store: Store;
  creatorId: string;
  products: ProductItem[];
  createdAt: Date;
  totalValue: number;
}
