const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
    let token = req.header("Authorization");
  
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });
  
    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ error: "Token is not valid" });
    }
  };
  
  module.exports = { protect };
