import express from "express";

import {
  createNewOrder,
  getAllOrders,
  getUserOrders,
  updateOrder,
} from "../controllers/order.js";
const router = express.Router();

router.post("/userOrder", createNewOrder);
router.get("/userPurchases/:userId", getUserOrders);
router.get("/orders", getAllOrders);
router.post("/updateOrder/:id", updateOrder);
export default router;
