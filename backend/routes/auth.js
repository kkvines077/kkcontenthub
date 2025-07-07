const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, mobile, password: hashed });
  await user.save();
  res.json({ message: "User Registered" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Wrong Password" });

  res.json({ message: "Login Success", user });
});

module.exports = router;
    
