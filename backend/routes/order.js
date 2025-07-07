const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/place", async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json({ message: "Order Placed" });
});

router.get("/user/:id", async (req, res) => {
  const orders = await Order.find({ userId: req.params.id });
  res.json(orders);
});

router.post("/cancel", async (req, res) => {
  await Order.findByIdAndUpdate(req.body.orderId, { status: "Cancelled" });
  res.json({ message: "Order Cancelled" });
});

module.exports = router;
