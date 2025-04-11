import mongoose from "mongoose";
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    promotionRate: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: true,
    },
    images: {
      type: Array,
      default: [],
      required: true,
    },
    brand: {
      type: String,
    },
    specifications: {
      brand: String,
      speed: String,
      power: String,
      color: String,
      other: String,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
