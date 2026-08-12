import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreatorProfile from './pages/CreatorProfile';
import Upload from './pages/Upload';
import MySongs from './pages/MySongs';
import LikedSongs from './pages/LikedSongs';
import Search from './pages/Search';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminSongs from './pages/admin/AdminSongs';
import AdminModeration from './pages/admin/AdminModeration';
import AdminPayments from './pages/admin/AdminPayments';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  return (user && user.is_admin) ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/creator/:username" element={<ProtectedRoute><CreatorProfile /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/my-songs" element={<ProtectedRoute><MySongs /></ProtectedRoute>} />
        <Route path="/liked-songs" element={<ProtectedRoute><LikedSongs /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/songs" element={<AdminRoute><AdminSongs /></AdminRoute>} />
        <Route path="/admin/moderation" element={<AdminRoute><AdminModeration /></AdminRoute>} />
        <Route path="/admin/payments" element={<AdminRoute><AdminPayments /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <MusicPlayer />
    </div>
  );
}