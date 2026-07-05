const express = require("express");
const router = express.Router();
require("dotenv").config();

// Login
router.post("/login", (req, res) => {
  
  const { username, password } = req.body;
  
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    
    req.session.loggedIn = true;
    
    return res.json({
      success: true
    });
    
  }
  
  res.json({
    success: false,
    message: "Invalid username or password."
  });
  
});

// Logout
router.get("/logout", (req, res) => {
  
  req.session.destroy(() => {
    
    res.redirect("/");
    
  });
  
});

module.exports = router;