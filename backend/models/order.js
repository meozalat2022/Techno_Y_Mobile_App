import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: String,
    cartId: String,
    cartItems: [
      {
        productId: String,
        title: String,
        image: String,
        price: String,
        quantity: Number,
      },
    ],
    addressInfo: {
      addressId: String,
      name: String,
      city: String,
      street: String,
      phone: String,
    },
    pending: {
      type: Boolean,
      default: true,
    },
    processed: {
      type: Boolean,
      default: false,
    },
    processedAt: {
      type: Date,
      default: "",
    },
    shipped: {
      type: Boolean,
      default: false,
    },
    shippedAt: {
      type: Date,
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: "",
    },
    totalAmount: Number,
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;
