
const express = require("express");
const { getMyNotifications, markAsRead, markAllAsRead } = require("../controllers/notification.controller.js");
const { protect } = require("../middleware/auth.middleware.js");

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, markAsRead);
router.patch("/mark-all-read", protect, markAllAsRead);

module.exports = router;
