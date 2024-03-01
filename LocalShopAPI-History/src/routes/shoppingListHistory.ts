import express from "express";
import * as ShoppingListHistoryController from "../controller/shoppingListHistoryController";

const router = express.Router();

router.get("/", ShoppingListHistoryController.getAllShoppingListsHistoryByUser);
router.get("/store", ShoppingListHistoryController.getStoreHistory);
router.get(
  "/:shoppingListId",
  ShoppingListHistoryController.getShoppingListsHistory
);
router.get(
  "/store/:storeId",
  ShoppingListHistoryController.getShoppingListsHistoryByUser
);
router.post("/", ShoppingListHistoryController.createShoppingListHistory);
export default router;
