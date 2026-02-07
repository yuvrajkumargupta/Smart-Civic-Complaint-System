const nodemailer = require('nodemailer');

// Mock function to simulate sending SMS
const sendSMS = async (to, message) => {
    console.log(`📱 [SMS Simulation] To: ${to} | Message: ${message}`);
    return Promise.resolve(true);
};

// Mock function to simulate sending Email (via console in dev)
const sendEmail = async (to, subject, html) => {
    console.log(`📧 [Email Simulation] To: ${to} | Subject: ${subject}`);
    // In production, use nodemailer transport
    return Promise.resolve(true);
};

exports.sendNotification = async (user, type, data) => {
    try {
        console.log(`🔔 Sending ${type} notification to ${user.name}`);

        // 1. Socket.IO (Real-time) - Already handled in controller, but could assume here if we pass io instance

        // 2. Email Notification
        if (user.email) {
            await sendEmail(user.email, data.title, data.message);
        }

        // 3. SMS Notification (Mock - assuming we had phone number)
        const mockPhone = "+1234567890";
        await sendSMS(mockPhone, `CivicApp: ${data.message}`);

    } catch (error) {
        console.error("Notification Service Error:", error);
    }
};
