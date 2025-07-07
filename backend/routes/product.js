const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

router.post("/upload", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ message: "Product Uploaded" });
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

module.exports = router;
