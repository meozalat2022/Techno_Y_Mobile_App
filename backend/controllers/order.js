import Order from "../models/order.js";

export const createNewOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  const pageSize = 5;

  const page = Number(req.query.pageNumber || 1);
  const userId = req.params.userId.slice(1);
  const count = await Order.find({ userId: userId }).countDocuments();

  try {
    const orders = await Order.find({ userId: userId })
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    return res.status(200).json({
      success: true,
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(errorHandler(404, "بيانات خطأ"));
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(id.slice(1), req.body);
    await updatedOrder.save();
    return res.status(201).json("Order Updated successfully");
  } catch (error) {
    next(error);
  }
};
