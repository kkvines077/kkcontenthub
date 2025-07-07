const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  items: Array,
  address: String,
  status: { type: String, default: "Placed" },
  razorpay_payment_id: String,
});

module.exports = mongoose.model("Order", orderSchema);
