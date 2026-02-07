# 🚀 Deployment Guide: Smart Civic Complaint System

This guide will help you deploy your full-stack application for free!

## 1. Architecture Overview
Since this is a **MERN Stack** app with **Socket.io** (Real-time features), we need two separate hosting services:
*   **Frontend (React)**: Deployed on **Vercel** (Fast, easy, free).
*   **Backend (Node/Express)**: Deployed on **Render** (Supports persistent connections for Socket.io).
*   **Database**: **MongoDB Atlas** (Already hosted in the cloud).

---

## 2. Prepare for Deployment

### A. Check Environment Variables
Make sure your `.env` files are ready.
*   **Server**: You will need to copy these variables to the Render dashboard later.
    *   `MONGO_URI`
    *   `JWT_SECRET`
    *   `PORT` (Render sets this automatically, but good to have)
*   **Client**: You will need to update the API URL after deploying the backend.

### B. Create a `vercel.json` for Client
*(I have already checked this file exists in your `client` folder. Good to go!)*

---

## 3. Deploy Backend (Render)

1.  Push your code to **GitHub**.
2.  Go to [dashboard.render.com](https://dashboard.render.com/) and create a **New Web Service**.
3.  Connect your GitHub repository.
4.  **Settings**:
    *   **Root Directory**: `server`
    *   **Build Command**: `npm install`
    *   **Start Command**: `node src/server.js`
5.  **Environment Variables** (Scroll down):
    *   Add `MONGO_URI` (Copy from your local `.env`)
    *   Add `JWT_SECRET` (Copy from your local `.env`)
    *   Add `NODE_ENV` = `production`
6.  Click **Deploy Web Service**.
7.  **Copy the URL**: Once deployed, Render will give you a URL (e.g., `https://civic-app-api.onrender.com`). **Save this!**

---

## 4. Update Frontend to use Live Backend

1.  Open `client/src/api/axios.js` (or wherever you defined your base URL).
2.  Change the `baseURL` from `http://localhost:5000` to your **Render Backend URL**.
    ```javascript
    // Example
    const API = axios.create({
      baseURL: "https://your-app-name.onrender.com/api", 
    });
    ```
3.  Commit and push this change to GitHub.

---

## 5. Deploy Frontend (Vercel)

1.  Go to [vercel.com](https://vercel.com/) and **Add New Project**.
2.  Import your GitHub repository.
3.  **Project Settings**:
    *   **Framework Preset**: Create React App (should detect automatically).
    *   **Root Directory**: `client` (Important! Click "Edit" next to Root Directory and select `client`).
4.  **Environment Variables**:
    *   If you use any `REACT_APP_` variables, add them here.
5.  Click **Deploy**.

---

## 6. Final Check
1.  Open your **Vercel URL**.
2.  Try to **Login** (this tests the Backend connection).
3.  Test **Socket.io**: Open the app in two different browsers and see if updates happen in real-time.

🎉 **Done! Your project is live!**
