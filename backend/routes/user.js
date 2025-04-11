import express from "express";
const router = express.Router();

import {
  createUser,
  addNewAddress,
  getUserAddresses,
  updateUserProfile,
  updateUserAddress,
  deleteAddress,
} from "../controllers/user.js";

router.post("/createUser", createUser);
router.post("/addNewAddress", addNewAddress);
router.post("/update", updateUserProfile);
router.get("/userAddresses/:userId", getUserAddresses);
router.post("/updateUserAddresses/:userId/:addressId", updateUserAddress);
router.delete("/deleteAddress/:addressId", deleteAddress);

export default router;
