# 🏙️ Smart Civic Complaint System

A modern, full-stack GovTech platform connecting citizens with municipal authorities. Features AI-powered issue detection, real-time analytics, and a premium "Smart City" dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-Production_Ready-success.svg)

## ✨ Features

### 🚀 For Citizens
*   **Smart Dashboard**: View real-time status of your reported issues.
*   **AI Auto-Dectection**: Upload a photo (e.g., Pothole), and our **TensorFlow.js** model automatically categorizes it.
*   **Live Updates**: Track complaints from *Pending* -> *In Progress* -> *Resolved*.
*   **Discussion**: Comment on complaints to provide extra details.

### 🛡️ For Admins (Authorities)
*   **City-Wide Analytics**: Monitor resolution rates and issue trends.
*   **Workflow Management**: Approve, reject, or resolve complaints.
*   **Evidence Review**: View attached images and location data.

## 🛠️ Tech Stack

*   **Frontend**: React.js, Tailwind CSS, Recharts, Framer Motion
*   **Backend**: Node.js, Express, MongoDB, Mongoose
*   **AI/ML**: TensorFlow.js (MobileNet) running on the Edge (Browser)
*   **Authentication**: JWT, bcryptjs
*   **DevOps**: Vercel (Frontend), Render (Backend)

## 🏗️ Installation & Run Locally

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas URI

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/civic-complaint-system.git
cd civic-complaint-system
```

### 2. Backend Setup
```bash
cd server
npm install
# Create .env file
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your_jwt_secret" >> .env
echo "PORT=5000" >> .env
npm start
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd client
npm install
npm start
```

Visit `http://localhost:3000` to view the app.

## 🤖 AI Features
This project uses **Edge AI** for privacy and speed.
*   **Model**: MobileNet (v2)
*   **Implementation**: `@tensorflow/tfjs`
*   **Logic**: Captures image stream/upload -> Classifies top predictions -> Maps to Civic Categories (Road, Sanitation, Water, etc).

## 📄 License
MIT License.
