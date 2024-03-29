import express from "express";
import * as ProductsController from "../controller/productsController";

const router = express.Router();

router.get("/", ProductsController.getProducts);
router.get("/list", ProductsController.getProductList);
router.get("/categories", ProductsController.getProductCategories);
router.get("/sort", ProductsController.getSortOptions);
router.get("/store/:storeId", ProductsController.listProducts);
router.get("/:productId", ProductsController.getProduct);
router.patch("/removeStock", ProductsController.removeStock);
router.post("/", ProductsController.createProducts);
router.patch("/:productId", ProductsController.updateProduct);
router.delete("/:productId", ProductsController.deleteProduct);
router.post("/getProductsList", ProductsController.getProductsList);
export default router;
