# Civic Complaint System - Project Overview & Interview Guide

This guide details the architecture, features, and technical decisions of your **Civic Complaint System** project. Use this to update your CV and prepare for technical interviews.

---

## 🚀 Project Overview
**Name:** Smart Civic Complaint System
**Tagline:** A transparent, efficient platform for citizens to report and track civic issues.
**Tech Stack:** MERN (MongoDB, Express.js, React, Node.js) + Socket.io + TailwindCSS.

### Core Problem Solved
Traditional civic complaint methods are opaque and slow. This system provides:
1.  **Transparency**: Citizens can see all public complaints on a map.
2.  **Accountability**: Complaints have statuses (Pending, In Progress, Resolved) and deadlines.
3.  **Real-time Updates**: Instant notifications via Socket.io when a complaint status changes.

---

## 🏃‍♂️ How to Run the Project

### 1. Start backend Server
Open a terminal in the `d:\civic-complaint-system\server` folder and run:
`npm run dev`

### 2. Start Frontend Client
Open a NEW terminal in the `d:\civic-complaint-system\client` folder and run:
`npm start`

### 3. Access in Browser
Go to http://localhost:3000

---

## 🔐 Admin Management

**How to Register as Admin:**
By default, all new registrations are 'users'. To create an admin, you must use the provided server script.

**To Create a New Admin:**
1. Stop the backend server (Ctrl+C).
2. Run this command in the `server` folder:
   `node create_admin_script.js "Admin Name" "admin@email.com" "password123"`
3. Restart the backend server (`npm run dev`).
4. Log in with these credentials to access the Admin Dashboard.

### 🛡️ Admin Panel Walkthrough (What to explain)

When you log in as an admin, you see the **Admin Dashboard**. Here is what you can explain:

**1. Dashboard Overview:**
*   "The dashboard gives a bird's-eye view of the city's status. I built KPI cards to show Total Reports, Pending Actions, and Resolution Rates instantly."
*   "I used `Recharts` to visualize department performance, helping identify which teams (e.g., Sanitation, Roads) are lagging behind."

**2. Complaint Management:**
*   "In the 'Complaints' tab, admins can see a table of all issues."
*   "Admins can **filter** by status (Pending, Resolved) and **update** the status of any complaint. When they click 'Resolve', the system uses **Socket.io** to instantly notify the citizen."

**3. User Management:**
*   "The 'Users' tab lists all registered citizens. Admins can manage accounts and roles here."

**4. Settings:**
*   "I added a 'Settings' page where admins can post **System Announcements** (e.g., 'Server Maintenance at 2 AM') which appear on everyone's dashboard."

---

## 🛠 Technical Architecture

### Frontend (Client)
-   **React.js**: built with functional components and Hooks (`useState`, `useEffect`, `useContext`).
-   **State Management**: React Context / Local State.
-   **Routing**: `react-router-dom` for navigation (Dashboard, Profile, Admin Panel).
-   **Styling**: **TailwindCSS** for responsive, utility-first styling.
-   **Maps**: **Leaflet** (via `react-leaflet`) for interactive maps to pin complaint locations.
-   **Real-time**: **Socket.io-client** for receiving live updates.
-   **Charts**: **Chart.js** & **Recharts** for admin analytics.

### Backend (Server)
-   **Node.js & Express**: RESTful API architecture.
-   **Database**: **MongoDB** (with Mongoose ODM) for flexible data storage.
-   **Authentication**: **JWT (JSON Web Tokens)** for secure, stateless authentication.
-   **Real-time**: **Socket.io** server for broadcasting events (e.g., "Complaint Resolved").
-   **File Uploads**: **Multer** for handling image evidence uploads.
-   **Cron Jobs**: **node-cron** for automated tasks (e.g., escalating overdue complaints).

---

## ✨ Key Features (Talking Points)

1.  **Role-Based Access Control (RBAC)**
    *   **Citizens**: Can post complaints, view their history, and see public complaints.
    *   **Admins**: Can view all complaints, change statuses, manage users, and view analytics.
    *   *Code Highlight:* Middleware `verifyAdmin` ensures only authorized users access admin routes.

2.  **Interactive Map Integration**
    *   Users can pin the exact location of a pothole or garbage dump.
    *   *Tech:* stored as GeoJSON or lat/lng coordinates in MongoDB.

3.  **Automated Escalation System**
    *   If a complaint isn't resolved within X days, a background job (Cron) flags it or notifies higher authorities.
    *   *Code Highlight:* `cron.service.js` checks for overdue complaints every midnight.

4.  **Real-Time Notifications**
    *   When an admin updates a complaint, the user gets a popup instantly without refreshing the page.
    *   *Code Highlight:* Socket.io `emit` events on status change.

5.  **Evidence & Media**
    *   Support for uploading photos of the issue.
    *   *Tech:* Multer middleware handles multipart/form-data.

---

## ❓ Interview Questions & Answers

**Q1: Why did you choose the MERN stack?**
*   **Answer:** "I chose MERN because using JavaScript across the entire stack (Node.js backend, React frontend) allowed for faster development and context switching. MongoDB's schema-less nature was perfect for evolving data requirements like adding new complaint fields, and React's component-based architecture made the UI modular and reusable."

**Q2: How do you handle image uploads?**
*   **Answer:** "I use `Multer` as middleware in Express to handle `multipart/form-data`. The images are saved to the server's disk (or cloud storage like Cloudinary in a production env), and the file path is stored in the MongoDB `Complaint` document."

**Q3: How does the real-time notification system work?**
*   **Answer:** "I implemented a WebSocket connection using `Socket.io`. When a user logs in, they join a specific 'room' defined by their User ID. When an admin updates a complaint, the server emits an event to that specific user's room, triggering a toast notification on the frontend client."

**Q4: How did you secure the application?**
*   **Answer:** "I used JWT (JSON Web Tokens). Upon login, the server signs a token which the client stores (in localStorage/cookies). Every subsequent request includes this token in the Authorization header. Custom middleware verifies the token signature before granting access to protected routes. I also hash passwords using `bcrypt` before storing them."

**Q5: What was the most challenging part?**
*   **Answer:** (Pick one you feel comfortable with, e.g.)
    *   *The Map:* "Integrating Leaflet to correctly capture and display coordinates was tricky, especially handling the custom marker icons."
    *   *Real-time Sync:* "Ensuring the socket connection persisted and handled disconnects gracefully required careful state management."

---

## 📂 Key Files to Show in Code Reviews
*   `server/src/routes/complaint.routes.js`: Shows API structure.
*   `server/src/services/cron.service.js`: Shows backend automation logic.
*   `client/src/auth/ProtectedRoute.jsx`: Shows security implementation.
*   `client/src/pages/ComplaintMap.jsx`: Shows complex UI integration.
