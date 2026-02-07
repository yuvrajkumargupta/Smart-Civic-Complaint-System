const Complaint = require("../models/Complaint");

exports.getPublicMapData = async (req, res) => {
    try {
        const complaints = await Complaint.find({
            coordinates: { $exists: true, $ne: null }
        }).select('title category status coordinates location createdAt');

        res.status(200).json({ complaints });
    } catch (error) {
        console.error("Map Data Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getPublicStats = async (req, res) => {
    try {
        const totalComplaints = await Complaint.countDocuments();
        const resolvedComplaints = await Complaint.countDocuments({ status: 'resolved' });
        const pendingComplaints = await Complaint.countDocuments({ status: { $ne: 'resolved' } });

        // Category Breakdown
        const categoryStats = await Complaint.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Recent Activity (Anonymized)
        const recentActivity = await Complaint.find()
            .select('title category status createdAt location')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            stats: {
                total: totalComplaints,
                resolved: resolvedComplaints,
                pending: pendingComplaints,
                categories: categoryStats,
                recent: recentActivity
            }
        });
    } catch (error) {
        console.error("Public Stats Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
