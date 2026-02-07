const mongoose = require("mongoose");
const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["pothole", "garbage", "water", "electricity", "road", "other"],
      default: "other",
    },
    // AI (from frontend)
    aiDetectedCategory: String,
    aiConfidence: Number,

    // SLA logic
    expectedResolutionTime: {
      type: Number, // in hours
      required: true,
    },

    location: {
      address: String,
      city: String,
      state: String,
    },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    // Advanced Features
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    sentimentScore: {
      type: Number,
      default: 0
    },
    upvotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    aiDetectedCategory: String, // Server-side or confirmed AI category
    aiConfidence: Number,
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved"],
      default: "pending",
    },
    image: {
      type: String, // Path to the uploaded image
      required: false,
    },
    resolvedAt: Date,
    // Governance Features
    feedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    },
    isEscalated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
module.exports = mongoose.model("Complaint", complaintSchema);