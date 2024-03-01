import express from "express";
import * as UserController from "../controller/userController";
import { verifyJWT } from "../middleware/verifyJWT";

const router = express.Router();

router.get("/", verifyJWT, UserController.getAuthenticatedUser);
router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", verifyJWT, UserController.logout);
router.get(
  "/favoriteProducts",
  verifyJWT,
  UserController.getUserFavoriteProducts
);
router.post("/favoriteProduct", verifyJWT, UserController.favoriteProduct);
router.get(
  "/favoriteProduct/:productId",
  verifyJWT,
  UserController.getUsersByFavoriteProduct
);
router.get("/favoriteStores", verifyJWT, UserController.getUserFavoriteStores);
router.post("/favoriteStores", verifyJWT, UserController.favoriteStores);
router.post("/unFavoriteProduct", verifyJWT, UserController.unFavoriteProduct);
router.post("/unFavoriteStores", verifyJWT, UserController.unFavoriteStores);
router.patch("/", verifyJWT, UserController.updateUser);

export default router;
