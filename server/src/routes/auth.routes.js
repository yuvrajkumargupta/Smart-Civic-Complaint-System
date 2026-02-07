const express = require('express');
const { register, login, updateProfile, getAllUsers } = require('../controllers/auth.controller.js');
const { protect } = require('../middleware/auth.middleware.js');
const router = express.Router();

//Register route
router.post("/register", register);
router.post("/login", login);
router.put("/profile", protect, updateProfile);
router.get("/users", protect, getAllUsers); // Admin route (should ideally have admin middleware too)
module.exports = router;
