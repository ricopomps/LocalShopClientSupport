import createHttpError from "http-errors";
import { ClientSession, Types } from "mongoose";
import { Product } from "../models/product";
import { ShoppingList } from "../models/shoppingList";
import ShoppingListHistoryModel, {
  ShoppingListHistory,
} from "../models/shoppingListHistory";
import { Store } from "../models/store";
import { User } from "../models/user";

type PopulatedShoppingList = {
  store: Store;
  creator: User;
  products: {
    product: Product;
    quantity: number;
  }[] &
    ShoppingList;
};

export interface IShoppingListHistoryService {
  createHistory(
    shoppingList: PopulatedShoppingList,
    session: ClientSession
  ): Promise<void>;
  getShoppingListHistory(
    shoppingListHistoryId: Types.ObjectId
  ): Promise<ShoppingListHistory>;

  getStoreHistory(
    storeId: Types.ObjectId,
    startDate: Date,
    endDate: Date
  ): Promise<ShoppingListHistory[]>;
}

export class ShoppingListHistoryService implements IShoppingListHistoryService {
  private shoppingListHistoryRepository;
  constructor() {
    this.shoppingListHistoryRepository = ShoppingListHistoryModel;
  }

  async createHistory(
    shoppingList: PopulatedShoppingList,
    session: ClientSession
  ): Promise<void> {
    let totalValue = 0;
    shoppingList?.products.forEach(
      (productItem) =>
        (totalValue += productItem.product.price * productItem.quantity)
    );

    await this.shoppingListHistoryRepository.create(
      [
        {
          storeId: shoppingList.store._id,
          creatorId: shoppingList.creator._id,
          products: shoppingList?.products,
          totalValue,
        },
      ],
      { session }
    );
  }

  async getShoppingListHistory(
    shoppingListHistoryId: Types.ObjectId
  ): Promise<ShoppingListHistory> {
    const shoppingListsHistory = await this.shoppingListHistoryRepository
      .findById(shoppingListHistoryId)
      .exec();

    if (!shoppingListsHistory)
      throw createHttpError(404, "Histórico não encontrado");
    return shoppingListsHistory;
  }

  async getStoreHistory(
    storeId: Types.ObjectId,
    startDate: Date,
    endDate: Date
  ): Promise<ShoppingListHistory[]> {
    const history = await this.shoppingListHistoryRepository
      .find({
        storeId,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .exec();
    return history;
  }
}
