const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const NotificationService = require('./notification.service');
const User = require('../models/User'); // To notify admins

const initCronJobs = () => {
    console.log('⏰ Escalation Cron Job Initialized');

    // Run every hour: '0 * * * *'
    // For demo/testing, run every minute: '* * * * *'
    cron.schedule('*/5 * * * *', async () => {
        console.log('🔄 Running Escalation Check...');
        try {
            const now = new Date();
            const overdueComplaints = await Complaint.find({
                status: { $ne: 'resolved' },
                isEscalated: false, // Only escalate once
                // Logic: CreatedAt + SLA (hours) < Now
            });

            for (const complaint of overdueComplaints) {
                const slaHours = complaint.expectedResolutionTime || 72;
                const deadline = new Date(complaint.createdAt);
                deadline.setHours(deadline.getHours() + slaHours);

                if (now > deadline) {
                    console.log(`⚠️ Escalate: Complaint ${complaint._id} is overdue!`);

                    complaint.isEscalated = true;
                    // Trigger "escalated" logic - maybe auto-set to 'high' priority too?
                    if (complaint.priority !== 'urgent') {
                        complaint.priority = 'high';
                    }
                    await complaint.save();

                    // Notify Admins
                    // In real app, fetch admins. Here, hardcoded notification
                    // We can't easily get 'all admins' without a User query
                    const admins = await User.find({ role: 'admin' });
                    for (const admin of admins) {
                        await NotificationService.sendNotification(admin, 'escalation', {
                            title: 'SLA Breach Escalation',
                            message: `Complaint #${complaint._id} (${complaint.title}) has breached SLA!`
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Cron Job Error:", error);
        }
    });
};

module.exports = initCronJobs;
