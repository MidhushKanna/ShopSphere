import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Product from "../models/productsModel.js";
import { isAuth, isAdmin } from "../utils.js";

const orderRouter = express.Router();

// Admin: View all customer orders
orderRouter.get(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.send(orders);
  }),
);

orderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.send(orders);
  }),
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    if (!req.body.orderItems || req.body.orderItems.length === 0) {
      return res.status(400).send({
        message: "Cart is empty",
      });
    }

    // Verify item prices from database to prevent client-side tampering
    const productIds = req.body.orderItems.map((item) => item.product);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    const verifiedOrderItems = req.body.orderItems.map((item) => {
      const dbProduct = dbProducts.find(
        (p) => p._id.toString() === item.product.toString()
      );
      return {
        ...item,
        price: dbProduct ? dbProduct.price : item.price,
      };
    });

    const itemsPrice = verifiedOrderItems.reduce(
      (a, c) => a + c.price * c.qty,
      0
    );
    const shippingPrice = typeof req.body.shippingPrice === "number" ? req.body.shippingPrice : (itemsPrice > 500 ? 0 : 50);
    const taxPrice = typeof req.body.taxPrice === "number" ? req.body.taxPrice : Number((0.18 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const order = new Order({
      orderItems: verifiedOrderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || "Cash on Delivery",
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      user: req.user._id,
    });
    const createdOrder = await order.save();
    res
      .status(201)
      .send({ message: "New order created.", order: createdOrder });
  }),
);

orderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (order) {
      const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
      if (orderUserId !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(403).send({ message: "Not authorized to view this customer's order." });
      }
      res.send(order);
    } else {
      res.status(404).send({ message: "Order not found." });
    }
  }),
);

orderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({ message: "Order not found." });
    }
    const orderUserId = order.user.toString();
    if (orderUserId !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).send({ message: "Not your order." });
    }
    if (order.isPaid) {
      return res.status(400).send({ message: "Order is already paid." });
    }

    const txnId = req.body.id && req.body.id.trim() ? req.body.id.trim() : `TXN_${Date.now()}`;

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: txnId,
      status: req.body.status || "COMPLETED",
      update_time: new Date().toISOString(),
    };

    const updatedOrder = await order.save();
    res.send({ message: "Payment confirmed successfully.", order: updatedOrder });
  }),
);

// Admin: Mark order as delivered
orderRouter.put(
  "/:id/deliver",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // If Cash on Delivery, mark as paid upon physical delivery
      if (order.paymentMethod === "Cash on Delivery" && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: `COD_${Date.now()}`,
          status: "CASH_COLLECTED_ON_DELIVERY",
          update_time: new Date().toISOString(),
        };
      }

      const updatedOrder = await order.save();
      res.send({ message: "Order marked as delivered.", order: updatedOrder });
    } else {
      res.status(404).send({ message: "Order not found." });
    }
  }),
);

export default orderRouter;
