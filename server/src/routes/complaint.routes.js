const express = require("express");
const router = express.Router();

const { createComplaint, getMyComplaints,
    getAllComplaints, updateComplaintStatus,
    getAnalytics, getComplaintById,
    upvoteComplaint, addComplaintFeedback
} = require("../controllers/complaint.controller");
const { protect, adminOnly } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

//  Protected route
router.post("/", protect, upload.single("image"), createComplaint);
router.get("/my", protect, getMyComplaints);
router.get("/", protect, adminOnly, getAllComplaints);
router.patch("/:id/status", protect, adminOnly, updateComplaintStatus);
router.put("/:id/upvote", protect, upvoteComplaint);
router.post("/:id/feedback", protect, addComplaintFeedback);
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/:id", protect, getComplaintById);

module.exports = router;
