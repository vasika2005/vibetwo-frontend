import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { HiSearch } from 'react-icons/hi';

export default function Search() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const searchUsers = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await api.get(`/users/search/?q=${query}`);
        setUsers(res.data.results || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-32 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Find Creators</h1>
      
      <div className="relative mb-8">
        <HiSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
          className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-purple-500"
        />
      </div>

      {loading && <p className="text-gray-400 text-center mt-10">Searching...</p>}

      <div className="space-y-3">
        {users.length > 0 ? users.map(u => (
          <div 
            onClick={() => navigate(`/creator/${u.username}`)} 
            key={u.id} 
            className="bg-gray-900/50 hover:bg-gray-800/50 p-4 rounded-xl flex items-center gap-4 cursor-pointer border border-transparent hover:border-gray-700"
          >
            <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
              {u.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{u.username}</p>
              <p className="text-gray-400 text-sm">{u.total_songs} songs</p>
            </div>
          </div>
        )) : (
          !loading && query && <p className="text-gray-500 text-center mt-10">No users found.</p>
        )}
      </div>
    </div>
  );
}