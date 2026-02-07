const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes.js");
const complaintRoutes = require("./routes/complaint.routes.js");
const commentRoutes = require("./routes/comment.routes.js");
const notificationRoutes = require("./routes/notification.routes.js");
const settingsRoutes = require("./routes/settings.routes");
const publicRoutes = require("./routes/public.routes");
const initCronJobs = require("./services/cron.service");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/uploads', express.static('uploads'));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/public", publicRoutes);

// Initialize Cron Jobs
initCronJobs();

// Health check
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const { notFound, errorHandler } = require("./middleware/error.middleware");
app.use(notFound);
app.use(errorHandler);

module.exports = app;
