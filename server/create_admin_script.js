require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');

const createAdmin = async () => {
    try {
        await connectDB();
        console.log("Database Connected");

        const args = process.argv.slice(2);
        const name = args[0] || "Admin User";
        const email = args[1] || "admin@example.com";
        const password = args[2] || "admin123";

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log(`User with email ${email} already exists.`);
            // Update role to admin if not already
            userExists.role = 'admin';
            // Update password
            userExists.password = password;
            await userExists.save();
            console.log(`Updated ${email} to ADMIN role and reset password.`);
        } else {
            const admin = await User.create({
                name,
                email,
                password,
                role: 'admin'
            });
            console.log(`Admin created successfully: ${admin.email}`);
        }
        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
