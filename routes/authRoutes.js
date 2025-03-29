const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post("/register", async (req, res) => {
   const {name,email,password} = req.body;
   try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({message: "User registered successfully"});
    
   } catch (error) {
    res.status(500).json({message: "Error registering user"});
   }

});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({email});
      if (!user) return res.status(400).json({ error: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  module.exports = router;
