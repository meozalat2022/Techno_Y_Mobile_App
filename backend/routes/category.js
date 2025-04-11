import express from "express";
import { createCategory, getAllCategories } from "../controllers/category.js";

const router = express.Router();

router.post("/create", createCategory);
router.get("/categories", getAllCategories);

export default router;
