import Product from '../models/product.js';

export const addProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductByCategory = async (req, res, next) => {
  const pageSize = 10;
  const catId = req.params.catId;
  const id = catId.slice(2);
  const page = Number(req.query.pageNumber || 1);
  const count = await Product.find({category: id}).countDocuments();

  try {
    const productsList = await Product.find({category: id})
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    return res.status(200).json({
      success: true,
      productsList,
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getSingleProduct = async (req, res, next) => {
  try {
    const prodId = req.params.productId;
    const id = prodId.slice(2);
    const product = await Product.findById(id);
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const products = await Product.find({
      title: {$regex: searchTerm, $options: 'i'},
    })
      .sort({[sort]: order})
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
