
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["system", "complaint_update", "alert"],
            default: "system",
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true,
        },
        relatedComplaintId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Complaint"
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
