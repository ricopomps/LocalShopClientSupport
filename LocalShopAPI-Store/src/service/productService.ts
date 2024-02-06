import createHttpError from "http-errors";
import { ClientSession, Types, startSession } from "mongoose";
import { ListProductsByUserFilter } from "../controller/productsController";
import ProductModel, { Product, ProductCategories } from "../models/product";
import { IStoreService, StoreService } from "./storeService";

export interface IProductService {
  getProduct(productId: string): Promise<Product>;
  getProducts(productsIds: Types.ObjectId[]): Promise<Product[]>;
  createProduct(product: ProductData): Promise<Product>;
  updateProduct(productId: string, product: ProductData): Promise<Product>;
  addStock(
    productId: string,
    stock: number,
    session?: ClientSession
  ): Promise<Product>;
  removeStock(
    productId: string,
    stock: number,
    session?: ClientSession
  ): Promise<Product>;
  listProducts(
    filter: ListProductsByUserFilter,
    userId: Types.ObjectId,
    favorite?: boolean,
    sortOption?: ProductSort
  ): Promise<Product[]>;
}

interface ProductData {
  storeId?: Types.ObjectId;
  name?: string;
  description?: string;
  image?: string;
  category?: ProductCategories;
  price?: number;
  location?: {
    x?: number;
    y?: number;
  };
  sale?: boolean;
  oldPrice?: number;
  salePercentage?: number;
  stock?: number;
}

export enum ProductSort {
  PRICE_ASC = "Menor preço",
  PRICE_DESC = "Maior preço",
  NAME_ASC = "Alfabético",
  NAME_DESC = "Alfabético invertido",
  STOCK_ASC = "Mais estoque",
  STOCK_DESC = "Menos estoque",
  SALE_ASC = "Maior desconto",
}

type SortOptions = {
  [key: string]: 1 | -1;
};

export class ProductService implements IProductService {
  private storeService: IStoreService;
  private productRepository;

  constructor() {
    this.storeService = new StoreService();
    this.productRepository = ProductModel;
  }

  async getProduct(productId: string): Promise<Product> {
    const product = await this.productRepository.findById(productId).exec();

    if (!product) throw createHttpError(404, "Produto não encontrado");

    return product;
  }

  async getProducts(productsIds: Types.ObjectId[]): Promise<Product[]> {
    const products = await this.productRepository
      .find({ _id: { $in: productsIds } })
      .exec();

    return products;
  }

  async createProduct(product: ProductData): Promise<Product> {
    const newProduct = await this.productRepository.create(product);

    return newProduct;
  }

  async updateProduct(
    productId: string,
    productData: ProductData
  ): Promise<Product> {
    const session = await startSession();
    session.startTransaction();
    try {
      const existingProduct = await this.productRepository
        .findById(productId)
        .session(session)
        .exec();

      if (!existingProduct)
        throw createHttpError(404, "Produto não encontrado");

      if (
        productData.sale &&
        productData.oldPrice &&
        productData.price &&
        productData.oldPrice < productData.price
      )
        throw createHttpError(
          400,
          "Não é possível cadastrar uma promoção com preço maior que o original"
        );

      if (productData.name) {
        existingProduct.name = productData.name;
      }

      if (productData.description) {
        existingProduct.description = productData.description;
      }

      if (productData.image) {
        existingProduct.image = productData.image;
      }

      if (
        productData.category &&
        Object.values(ProductCategories).includes(productData.category)
      ) {
        existingProduct.category = productData.category;
      }

      if (productData.price) {
        existingProduct.price = productData.price;
      }

      if (productData.location) {
        existingProduct.location = productData.location;
      }

      if (productData.sale !== undefined) {
        existingProduct.sale = productData.sale;
      }

      if (productData.oldPrice) {
        existingProduct.oldPrice = productData.oldPrice;
      }

      if (productData.sale && productData.oldPrice && productData.price) {
        existingProduct.salePercentage =
          ((productData.oldPrice - productData.price) / productData.oldPrice) *
          100;
      } else {
        existingProduct.salePercentage = 0;
      }

      if (productData.stock !== undefined) {
        const stockDifference = productData.stock - existingProduct.stock;

        if (stockDifference > 0) {
          await this.addStock(productId, stockDifference, session);
        } else if (stockDifference < 0) {
          await this.removeStock(productId, -stockDifference, session);
        }

        existingProduct.stock = productData.stock;
      }

      const updatedProduct = await existingProduct.save();
      await session.commitTransaction();
      session.endSession();
      return updatedProduct;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async addStock(
    productId: string,
    stock: number,
    session?: ClientSession
  ): Promise<Product> {
    const query = this.productRepository.findById(productId);

    if (session) {
      query.session(session);
    }

    const product = await query.exec();

    if (!product) {
      throw createHttpError(404, "Produto não encontrado");
    }

    product.stock += stock;
    await product.save({ session });

    return product;
  }

  async removeStock(
    productId: string,
    stock: number,
    session?: ClientSession
  ): Promise<Product> {
    const query = this.productRepository.findById(productId);

    if (session) {
      query.session(session);
    }

    const product = await query.exec();

    if (!product) {
      throw createHttpError(404, "Produto não encontrado");
    }

    if (stock > product.stock) {
      throw createHttpError(
        400,
        `O Produto: '${product.name}' não possui estoque suficiente (estoque atual: ${product.stock})`
      );
    }

    product.stock -= stock;
    await product.save({ session });

    return product;
  }

  private getSort(option?: ProductSort): SortOptions | undefined {
    if (!option) return;
    const sortOptions: SortOptions = {};
    switch (option) {
      case ProductSort.PRICE_ASC:
        sortOptions.price = 1;
        break;
      case ProductSort.PRICE_DESC:
        sortOptions.price = -1;
        break;
      case ProductSort.NAME_ASC:
        sortOptions.name = 1;
        break;
      case ProductSort.NAME_DESC:
        sortOptions.name = -1;
        break;
      case ProductSort.STOCK_ASC:
        sortOptions.stock = -1;
        break;
      case ProductSort.STOCK_DESC:
        sortOptions.stock = 1;
        break;
      case ProductSort.SALE_ASC:
        sortOptions.sale = 1;
        break;
      default:
        break;
    }
    return sortOptions;
  }

  async listProducts(
    filter: ListProductsByUserFilter,
    userId: Types.ObjectId,
    favorite?: boolean | undefined,
    sortOption?: ProductSort
  ): Promise<Product[]> {
    const products = await this.productRepository
      .find(filter)
      .sort(this.getSort(sortOption))
      .exec();
    return products;
  }
}
