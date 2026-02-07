const Comment = require("../models/Comment");
const Complaint = require("../models/Complaint");

// Add a new comment
exports.addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { complaintId } = req.params;

        const complaint = await Complaint.findById(complaintId);
        if (!complaint) {
            return res.status(404).json({ message: "Complaint not found" });
        }

        const comment = await Comment.create({
            text,
            complaint: complaintId,
            user: req.user._id,
        });

        const populatedComment = await Comment.findById(comment._id).populate("user", "name role");

        res.status(201).json({ comment: populatedComment });
    } catch (error) {
        console.error("🔥 Add Comment Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get comments for a complaint
exports.getCommentsByComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;

        const comments = await Comment.find({ complaint: complaintId })
            .populate("user", "name role")
            .sort({ createdAt: 1 }); // Oldest first (chronological conversation)

        res.status(200).json({ comments });
    } catch (error) {
        console.error("🔥 Get Comments Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
