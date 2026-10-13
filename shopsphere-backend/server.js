import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routers/userRouter.js";
import productRouter from "./routers/productRouter.js";
import dotenv from "dotenv";
import orderRouter from "./routers/orderRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const connection_url = process.env.MONGODB_URL;

/*mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

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

// Listening to  server

app.listen(port, () => console.log(`Listening on local host:${port}`));
