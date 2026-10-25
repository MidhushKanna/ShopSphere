import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter, { ensureAdminUser } from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const connection_url = process.env.MONGODB_URL;

if (!connection_url) {
  console.error("ERROR: MONGODB_URL is not set in environment variables!");
} else {
  mongoose
    .connect(connection_url)
    .then(() => {
      console.log("MongoDB connected successfully!");
      ensureAdminUser();
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
    });
}

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.get("/api/config/upi", (req, res) => {
  res.send({
    vpa: process.env.UPI_ID,
    payeeName: process.env.UPI_PAYEE_NAME || "ShopSphere",
  });
});

app.get("/", (req, res) => res.status(200).send("ShopSphere API is running."));

// Central error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).send({
    message: err.message || "An unexpected server error occurred",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Listening to server
app.listen(port, () => console.log(`Listening on local host:${port}`));
