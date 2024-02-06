import createHttpError from "http-errors";
import { Types } from "mongoose";
import { ListStoresFilter } from "../controller/storesController";
import StoreModel, { Store } from "../models/store";
export interface IStoreService {
  getStore(storeId: Types.ObjectId): Promise<Store>;
  listStores(
    filter: ListStoresFilter,
    userId: Types.ObjectId,
    favorite?: boolean
  ): Promise<Store[]>;
}

export class StoreService implements IStoreService {
  private storeRepository;

  constructor() {
    this.storeRepository = StoreModel;
  }

  async getStore(storeId: Types.ObjectId): Promise<Store> {
    const store = await this.storeRepository.findById(storeId).exec();

    if (!store) throw createHttpError(404, "Store não encontrada");

    return store;
  }

  async listStores(
    filter: ListStoresFilter,
    userId: Types.ObjectId,
    favorite?: boolean
  ): Promise<Store[]> {
    const stores = await this.storeRepository.find(filter).exec();

    return stores;
  }
}
