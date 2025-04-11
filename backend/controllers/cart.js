import Cart from "../models/cart.js";
import Product from "../models/product.js";
import { errorHandler } from "../util/error.js";

export const addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return next(errorHandler(404, "بيانات غير صحيحة"));
    }

    const product = await Product.findById(productId);

    if (!product) {
      return next(errorHandler(404, "لا يمكن ايجاد المنتج"));
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();
    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const fetchCartItems = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const id = userId.slice(1);

    if (!id) {
      return next(errorHandler(404, "لا يمكن ايجاد المستخدم"));
    }

    const cart = await Cart.findOne({ userId: id }).populate({
      path: "items.productId",
      select: "images title price promotionRate",
    });

    if (!cart) {
      return next(errorHandler(404, "بيانات خاطئة"));
    }

    const validItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.images[0],
      title: item.productId.title,
      price: item.productId.price,
      promotionRate: item.productId.promotionRate,
      quantity: item.quantity,
    }));
    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartItemQty = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity <= 0) {
      return next(errorHandler(400, "المستخدم غير موجود"));
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return next(errorHandler(404, "بيانات خاطئة"));
    }

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      return next(errorHandler(404, "بيانات خاطئة"));
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images title price promotionRate",
    });
    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.images[0] : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      promotionRate: item.productId ? item.productId.promotionRate : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCartItem = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return next(errorHandler(404, "المستخدم غير موجود"));
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images title price promotionRate",
    });

    if (!cart) {
      return next(errorHandler(404, "بيانات خاطئة"));
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "images title price promotionRate",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.images[0] : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      promotionRate: item.productId ? item.productId.promotionRate : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const cartItems = await Cart.findOneAndDelete(userId);
    return res.status(201).json(cartItems);
  } catch (error) {
    next(error);
  }
};
