import { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/dashboard/stats/').then(res => setStats(res.data));
    api.get('/admin/users/').then(res => setUsers(res.data));
  }, []);

  const toggleBlock = async (id, currentStatus) => {
    const action = currentStatus ? 'unblock' : 'block';
    try {
      await api.patch(`/admin/users/${id}/${action}/`);
      setUsers(users.map(u => u.id === id ? {...u, is_blocked: !currentStatus} : u));
      toast.success(`User ${action}ed`);
    } catch (err) { toast.error('Action failed'); }
  };

  if (!stats) return <div className="pt-24 text-center text-gray-400">Loading Admin Data...</div>;

  return (
    <div className="pt-24 pb-32 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Users', val: stats.total_users, color: 'bg-blue-600' },
          { label: 'Approved Songs', val: stats.total_songs, color: 'bg-green-600' },
          { label: 'Pending Songs', val: stats.pending_songs, color: 'bg-yellow-600' },
          { label: 'Revenue (₹)', val: (stats.total_revenue / 100).toFixed(2), color: 'bg-purple-600' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} p-6 rounded-xl text-white`}>
            <p className="text-sm opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.val}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-gray-800 text-gray-300">
                <td className="px-4 py-3 font-bold text-white">{u.username}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${u.is_blocked ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                    {u.is_blocked ? 'Blocked' : 'Active'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleBlock(u.id, u.is_blocked)} className="text-purple-400 hover:underline text-sm">
                    {u.is_blocked ? 'Unblock' : 'Block'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}