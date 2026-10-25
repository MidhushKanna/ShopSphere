import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productsModel.js";
import { products } from "../products.js";

import { isAuth, isAdmin } from "../utils.js";

const productRouter = express.Router();

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  }),
);

// Safe seed: Only populates if database has no products, preventing accidental wipe
productRouter.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.status(400).send({
        message: "Products collection already contains items. Reseeding requires admin credentials via POST /api/products/seed/reset.",
      });
    }
    const createdProducts = await Product.insertMany(products);
    res.send({ createdProducts });
  }),
);

// Admin-only force reseed
productRouter.post(
  "/seed/reset",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(products);
    res.send({ createdProducts });
  }),
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: "Product not found." });
    }
  }),
);

export default productRouter;
