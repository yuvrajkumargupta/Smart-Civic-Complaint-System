import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ComplaintDetails from "./pages/ComplaintDetails";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./auth/ProtectedRoute";
import { Toaster, toast } from 'react-hot-toast';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
import AdminUsers from "./pages/AdminUsers";
import AdminSettings from "./pages/AdminSettings";
import Transparency from "./pages/Transparency";
import ComplaintMap from "./pages/ComplaintMap";
import LandingPage from "./pages/LandingPage";
import CivicBot from "./components/CivicBot";

function App() {
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const socket = io("http://localhost:5000");

      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("join_user", user._id);
      });

      socket.on("notification", (data) => {
        toast((t) => (
          <div onClick={() => window.location.href = `/complaint/${data.complaintId}`} className="cursor-pointer">
            <p className="font-bold">{data.title}</p>
            <p className="text-sm">{data.message}</p>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #e2e8f0',
            padding: '16px',
          },
          icon: '🔔',
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);
  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{
        className: 'font-sans',
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      }} />
      <CivicBot />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transparency" element={<Transparency />} />
        <Route path="/map" element={<ComplaintMap />} />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaint/:id"
          element={
            <ProtectedRoute>
              <ComplaintDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard /> {/* Reusing Dashboard for now as it lists complaints */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute adminOnly>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
