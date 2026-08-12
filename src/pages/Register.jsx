import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', password2: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.username?.[0] || err.response?.data?.email?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-purple-500">Join VibeTwo</h1>
        <p className="text-gray-400 text-center mb-8">Create your account</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" required placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
          <input type="email" required placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
          <input type="password" required placeholder="Password (min 8 chars)" onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
          <input type="password" required placeholder="Confirm Password" onChange={(e) => setFormData({...formData, password2: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
          
          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 mt-4">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm">Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Login</Link></p>
      </div>
    </div>
  );
}