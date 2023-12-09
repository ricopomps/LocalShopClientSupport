import { CellCoordinates } from "../components/Grid";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  category?: string;
  createdAt: string;
  updatedAt: string;
  location?: CellCoordinates;
  sale?: boolean;
  promotionPercent?: number;
  oldPrice?: number;
  stock?: number;
}
