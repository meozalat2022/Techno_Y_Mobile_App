import express from "express";
import {
  addToCart,
  fetchCartItems,
  deleteCartItem,
  updateCartItemQty,
  clearCart,
} from "../controllers/cart.js";
import { verifyToken } from "../util/verifyUser.js";

const router = express.Router();

router.post("/addToCart", addToCart);
router.get("/getCartItems/:userId", fetchCartItems);
router.put("/updateCart", updateCartItemQty);
router.delete("/delete/:userId/:productId", deleteCartItem);
router.delete("/clearCart/", clearCart);
export default router;
