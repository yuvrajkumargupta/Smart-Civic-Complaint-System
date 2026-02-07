const Complaint = require("../models/Complaint");
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

// Feedback & Rating
exports.addComplaintFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    // Only allow feedback if resolved
    if (complaint.status !== 'resolved') {
      return res.status(400).json({ message: "Can only rate resolved complaints" });
    }

    // Logic could be added to ensure only the creator can rate
    if (complaint.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to rate this complaint" });
    }

    complaint.feedback = { rating, comment };
    await complaint.save();

    res.status(200).json({ message: "Feedback submitted successfully", complaint });
  } catch (error) {
    console.error("Feedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const SLA_MAP = {
  pothole: 72,
  garbage: 24,
  water: 48,
  electricity: 48,
  road: 72,
  other: 72,
};

exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      description,
      category = "other",
      location,
      aiDetectedCategory,
      aiConfidence,
      latitude,
      longitude,
    } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const expectedResolutionTime =
      SLA_MAP[category] || SLA_MAP.other;

    let imagePath = null;
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/"); // Normalize path for Windows
    }

    // 1. Sentiment Analysis
    const sentimentResult = sentiment.analyze(`${title} ${description}`);
    const sentimentScore = sentimentResult.score;
    let priority = 'medium';

    if (sentimentScore < -3) priority = 'urgent';
    else if (sentimentScore < 0) priority = 'high';

    // 2. AI Image Recognition Mock
    // In a real app, we would send 'imagePath' to an AI service here.
    let finalAiCategory = aiDetectedCategory;
    let finalAiConfidence = aiConfidence;

    if (imagePath && !finalAiCategory) {
      // Mock Logic: Detect from description keywords if image exists but no client-AI
      if (description.toLowerCase().includes("pothole")) {
        finalAiCategory = "pothole";
        finalAiConfidence = 0.95;
      } else if (description.toLowerCase().includes("garbage") || description.toLowerCase().includes("trash")) {
        finalAiCategory = "garbage";
        finalAiConfidence = 0.88;
      } else {
        finalAiCategory = "uncategorized";
        finalAiConfidence = 0.50;
      }
    }

    const complaintData = {
      user: req.user._id,
      title,
      description,
      category,
      location,
      aiDetectedCategory: finalAiCategory,
      aiConfidence: finalAiConfidence,
      priority,
      sentimentScore: sentimentScore,
      expectedResolutionTime,
      image: imagePath,
    };

    if (latitude && longitude) {
      complaintData.coordinates = {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      };
    }

    const complaint = await Complaint.create(complaintData);

    res.status(201).json({
      message: "Complaint created successfully",
      complaint,
    });
  } catch (error) {
    console.error("🔥 Create Complaint Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//now getComplaints by user
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("🔥 Get My Complaints Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//get all complaits by admin
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("🔥 Admin Complaints Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//admin Update complaint status function can be added here in future
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;

    if (status === "resolved") {
      complaint.resolvedAt = new Date();
    }

    await complaint.save();

    // Real-time Notification
    // Real-time Notification
    const io = req.app.get("io");
    const notificationData = {
      type: "complaint_update",
      title: "Complaint Updated",
      message: `Your complaint "${complaint.title}" is now ${status.replace("_", " ")}.`,
      complaintId: complaint._id,
    };

    if (io) {
      io.to(complaint.user.toString()).emit("notification", notificationData);
    }

    // Multi-channel Notification (Email/SMS)
    const NotificationService = require('../services/notification.service');
    // Ensure we have user email populated
    const user = await require('../models/User').findById(complaint.user);
    if (user) {
      await NotificationService.sendNotification(user, 'status_update', notificationData);
    }

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("🔥 Update Complaint Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Upvote Complaint
exports.upvoteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });

    const userId = req.user._id;

    // Check if already upvoted
    const isUpvoted = complaint.upvotes.includes(userId);

    if (isUpvoted) {
      // Remove upvote
      complaint.upvotes = complaint.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote
      complaint.upvotes.push(userId);
    }

    await complaint.save();

    res.json({
      upvotes: complaint.upvotes,
      count: complaint.upvotes.length,
      isUpvoted: !isUpvoted
    });

  } catch (error) {
    console.error("Upvote Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



//dashboard 
exports.getAnalytics = async (req, res) => {
  try {
    // 1. Total complaints
    const totalComplaints = await Complaint.countDocuments();

    // 2. Status counts
    const statusStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    let resolvedCount = 0;
    let pendingCount = 0;

    statusStats.forEach((stat) => {
      if (stat._id === "resolved") resolvedCount = stat.count;
      if (stat._id === "pending") pendingCount = stat.count;
    });

    // 3. Resolution rate
    const resolutionRate =
      totalComplaints === 0
        ? 0
        : ((resolvedCount / totalComplaints) * 100).toFixed(2);

    // 4. Average resolution time (hours)
    const avgResolution = await Complaint.aggregate([
      {
        $match: {
          status: "resolved",
          resolvedAt: { $exists: true },
        },
      },
      {
        $project: {
          resolutionTimeHours: {
            $divide: [
              { $subtract: ["$resolvedAt", "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: "$resolutionTimeHours" },
        },
      },
    ]);

    const avgResolutionTime =
      avgResolution.length > 0
        ? avgResolution[0].avgTime.toFixed(2)
        : 0;

    // 5. Category-wise distribution
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      totalComplaints,
      resolvedCount,
      pendingCount,
      resolutionRate,
      avgResolutionTime,
      categoryStats,
      resolutionTimeByCategory: await Complaint.aggregate([
        { $match: { status: "resolved", resolvedAt: { $exists: true } } },
        {
          $project: {
            category: 1,
            resolutionTimeHours: {
              $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60 * 60]
            }
          }
        },
        {
          $group: {
            _id: "$category",
            avgTime: { $avg: "$resolutionTimeHours" }
          }
        }
      ])
    });
  } catch (error) {
    console.error("🔥 Analytics Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.status(200).json({ complaint });
  } catch (error) {
    console.error("🔥 Get Complaint By ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
