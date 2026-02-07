const express = require("express");
const router = express.Router();
const { addComment, getCommentsByComplaint } = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth.middleware");

// Get comments for a complaint
router.get("/:complaintId", protect, getCommentsByComplaint);

// Add a comment to a complaint
router.post("/:complaintId", protect, addComment);

module.exports = router;
