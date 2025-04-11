import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import categoryRouter from './routes/category.js';
import productRouter from './routes/product.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/order.js';
import contactRouter from './routes/contact.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
dotenv.config();
app.use(cors());
mongoose
  .connect(process.env.MONGO_URL)
  .then(result => {
    console.log('Connected Successfully to mongoDB');
  })
  .catch(error => {
    console.log('Error connecting to MongoDB');
  });

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

//category routes

app.use('/backend/category', categoryRouter);

//product routes
app.use('/backend/product', productRouter);

//auth routes

app.use('/backend/auth', authRoute);

//user routes

app.use('/backend/user', userRoute);

//cart route
app.use('/backend/cart', cartRouter);

//order route

app.use('/backend/order', orderRouter);

// contact us

app.use('/backend/contact', contactRouter);

//error handling middleware

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error Occurred';
  return res.status(statusCode).json({success: false, statusCode, message});
});
