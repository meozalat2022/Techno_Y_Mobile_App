import express from "express";

import {
  signup,
  signin,
  signOut,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/signout", signOut);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
