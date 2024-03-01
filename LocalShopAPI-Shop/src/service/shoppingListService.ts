import createHttpError from "http-errors";
import { Types, startSession } from "mongoose";
import { Product } from "../models/product";
import ShoppingListModel, {
  ShoppingList,
  ShoppingListItem,
} from "../models/shoppingList";
import { Store } from "../models/store";
import { User } from "../models/user";
import { calculatePath } from "../network/api/mapApi";
import {
  CellCoordinates,
  getProductsList,
  removeStock,
} from "../network/api/productsApi";
import {
  IShoppingListHistoryService,
  ShoppingListHistoryService,
} from "./shoppingListHistoryService";

export type PopulatedShoppingList = {
  store: Store;
  creator: User;
  products: {
    product: Product;
    quantity: number;
  }[] &
    ShoppingList;
};

export interface IShoppingListService {
  createOrUpdateShoppingList(
    creatorId: Types.ObjectId,
    storeId: Types.ObjectId,
    products: ShoppingListItem[],
    token: string
  ): Promise<ShoppingList>;

  getShoppingListsByUser(
    userId: Types.ObjectId,
    storeId: Types.ObjectId
  ): Promise<PopulatedShoppingList | null>;

  finishShoppingList(
    creatorId: Types.ObjectId,
    storeId: Types.ObjectId,
    products: ShoppingListItem[],
    token: string
  ): Promise<void>;

  copyHistoryList(
    shoppingListHistoryId: Types.ObjectId,
    token: string
  ): Promise<ShoppingList>;

  getShoppingListShortestPath(
    creatorId: Types.ObjectId,
    storeId: Types.ObjectId,
    products: ShoppingListItem[],
    token: string
  ): Promise<CellCoordinates[][]>;
}

interface GetShoppingListsByUserFilter {
  creatorId: Types.ObjectId;
  storeId?: Types.ObjectId;
}

export class ShoppingListService implements IShoppingListService {
  private shoppingListHistoryService: IShoppingListHistoryService;
  private shoppingListRepository;

  constructor() {
    this.shoppingListHistoryService = new ShoppingListHistoryService();
    this.shoppingListRepository = ShoppingListModel;
  }

  async createOrUpdateShoppingList(
    creatorId: Types.ObjectId,
    storeId: Types.ObjectId,
    products: ShoppingListItem[],
    token: string
  ): Promise<ShoppingList> {
    let shoppingList = await this.shoppingListRepository
      .findOne({
        creatorId,
        storeId,
      })
      .exec();

    const productsInStock = await getProductsList(
      products.map((item) => item.product),
      token
    );

    products.forEach((product) => {
      const productInStock = productsInStock.find(
        (stockProduct) =>
          stockProduct._id.toString() === product.product.toString()
      );
      if (productInStock) {
        if (productInStock.stock < product.quantity)
          throw createHttpError(
            400,
            `O produto '${productInStock.name}' não está mais em estoque (Estoque disponível: ${productInStock.stock})`
          );
      } else {
        throw createHttpError(404, `O produto não está mais disponivel`);
      }
    });

    if (shoppingList) {
      shoppingList.products = products;

      await shoppingList.save();
    } else {
      shoppingList = await this.shoppingListRepository.create({
        storeId,
        creatorId,
        products: products,
      });
    }

    return shoppingList;
  }

  async getShoppingListsByUser(
    userId: Types.ObjectId,
    storeId: Types.ObjectId
  ): Promise<PopulatedShoppingList | null> {
    const filter: GetShoppingListsByUserFilter = {
      creatorId: new Types.ObjectId(userId),
      storeId: new Types.ObjectId(storeId),
    };

    const shoppingLists = await this.shoppingListRepository
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "users",
            localField: "creatorId",
            foreignField: "_id",
            as: "creator",
          },
        },
        {
          $unwind: "$creator",
        },
        { $unset: "creator.password" },
        {
          $lookup: {
            from: "stores",
            localField: "storeId",
            foreignField: "_id",
            as: "store",
          },
        },
        {
          $unwind: "$store",
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product",
            foreignField: "_id",
            as: "populatedProducts",
          },
        },
        {
          $addFields: {
            products: {
              $map: {
                input: "$products",
                as: "productObj",
                in: {
                  product: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$populatedProducts",
                          as: "populatedProduct",
                          cond: {
                            $eq: [
                              "$$populatedProduct._id",
                              "$$productObj.product",
                            ],
                          },
                        },
                      },
                      0,
                    ],
                  },
                  quantity: "$$productObj.quantity",
                },
              },
            },
          },
        },
        { $unset: "populatedProducts" },
      ])
      .exec();

    return shoppingLists[0] || null;
  }

  async finishShoppingList(
    creatorId: Types.ObjectId,
    storeId: Types.ObjectId,
    products: ShoppingListItem[],
    token: string
  ) {
    const session = await startSession();
    session.startTransaction();
    try {
      await this.createOrUpdateShoppingList(
        creatorId,
        storeId,
        products,
        token
      );

      const productsInStock = await getProductsList(
        products.map((item) => item.product),
        token
      );

      const removeStockPromises = products.map((product) => {
        const productInStock = productsInStock.find(
          (stockProduct) =>
            stockProduct._id.toString() === product.product.toString()
        );
        if (productInStock) {
          if (productInStock.stock < product.quantity)
            throw createHttpError(
              400,
              `O produto '${productInStock.name}' não está mais em estoque (Estoque disponível: ${productInStock.stock})`
            );
          return removeStock(productInStock._id, product.quantity, token);
        } else {
          throw createHttpError(404, `O produto não está mais disponivel`);
        }
      });

      await Promise.all(removeStockPromises);

      const shoppingList = await this.getShoppingListsByUser(
        creatorId,
        storeId
      );

      if (!shoppingList)
        throw createHttpError(404, `Lista de compras não está mais disponível`);

      await this.shoppingListHistoryService.createHistory(
        shoppingList,
        session
      );

      await this.shoppingListRepository
        .findOneAndDelete({ creatorId, storeId })
        .session(session);
      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async copyHistoryList(
    shoppingListHistoryId: Types.ObjectId,
    token: string
  ): Promise<ShoppingList> {
    const history =
      await this.shoppingListHistoryService.getShoppingListHistory(
        shoppingListHistoryId
      );

    const productsItem = history.products.map((item): ShoppingListItem => {
      if (!item.product) throw createHttpError(404, "Produto não encontrado ");
      return {
        product: (item.product as Product)._id,
        quantity: item.quantity,
      };
    });

    const shoppingList = await this.createOrUpdateShoppingList(
      history.creatorId,
      history.storeId,
      productsItem,
      token
    );

    return shoppingList;
  }

  async getShoppingListShortestPath(
    creatorId: Types.ObjectId,
    storeId: Types.ObjectId,
    products: ShoppingListItem[],
    token: string
  ): Promise<CellCoordinates[][]> {
    await this.createOrUpdateShoppingList(creatorId, storeId, products, token);
    const shoppingList = await this.getShoppingListsByUser(creatorId, storeId);

    shoppingList?.products.forEach((item) => {
      if (!item.product.location)
        throw createHttpError(
          404,
          `O produto ${item.product.name} não possui localização cadastrada, favor remova ele da lista.`
        );
    });

    if (!shoppingList)
      throw createHttpError(
        404,
        "Não foi possível encontrar a lista de compras"
      );
    const paths = await calculatePath(storeId.toString(), shoppingList, token);
    return paths;
  }
}
