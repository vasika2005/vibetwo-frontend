import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { HiMusicNote, HiLogout, HiUpload, HiHome, HiUser, HiHeart, HiViewGrid, HiSearch, HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-purple-500">
            <HiMusicNote className="text-3xl" /> VibeTwo
          </Link>
          
          {/* Desktop Nav */}
          {user && (
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link to="/" className="text-gray-300 hover:text-white flex items-center gap-1"><HiHome /> Home</Link>
              <Link to="/search" className="text-gray-300 hover:text-white flex items-center gap-1"><HiSearch /> Find Creators</Link>
              <Link to="/upload" className="text-gray-300 hover:text-white flex items-center gap-1"><HiUpload /> Upload</Link>
              <Link to="/my-songs" className="text-gray-300 hover:text-white flex items-center gap-1"><HiViewGrid /> My Songs</Link>
              <Link to="/liked-songs" className="text-gray-300 hover:text-white flex items-center gap-1"><HiHeart /> Liked</Link>
              <Link to="/profile" className="text-gray-300 hover:text-white flex items-center gap-1"><HiUser /> Profile</Link>
              {user.is_admin && <Link to="/admin" className="text-purple-400 hover:text-purple-300 flex items-center gap-1 border border-purple-500 px-2 py-1 rounded"><HiViewGrid /> Admin</Link>}
            </div>
          )}

          <div className="flex items-center gap-4">
            {user ? (
              <button onClick={handleLogout} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                <HiLogout /> <span className="hidden sm:inline">Logout</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm">Login</Link>
              </div>
            )}
            
            {/* Mobile Hamburger */}
            {user && (
              <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
                {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && user && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 pb-4 space-y-3 pt-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">Home</Link>
          <Link to="/search" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">Find Creators</Link>
          <Link to="/upload" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">Upload</Link>
          <Link to="/my-songs" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">My Songs</Link>
          <Link to="/liked-songs" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">Liked Songs</Link>
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="block text-gray-300 hover:text-white py-2">Profile</Link>
          {user.is_admin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block text-purple-400 hover:text-white py-2 font-bold">Admin Dashboard</Link>}
        </div>
      )}
    </nav>
  );
}