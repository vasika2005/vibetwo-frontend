import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { HiCamera, HiSave } from 'react-icons/hi';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({ first_name: '', last_name: '', bio: '' });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (user) setForm({ first_name: user.first_name || '', last_name: user.last_name || '', bio: user.bio || '' });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (image) data.append('profile_image', image);

    try {
      const res = await api.patch('/auth/profile/update/', data);
      setUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error('Update failed'); }
  };

  if (!user) return null;

  return (
    <div className="pt-24 pb-32 max-w-2xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <img src={user.profile_image_url || `https://ui-avatars.com/api/?name=${user.username}&background=7c3aed&color=fff`} className="w-24 h-24 rounded-full object-cover" />
            <label className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full cursor-pointer hover:bg-purple-700">
              <HiCamera className="text-white text-sm" />
              <input type="file" hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user.username}</h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">First Name</label>
              <input value={form.first_name} onChange={(e) => setForm({...form, first_name: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Last Name</label>
              <input value={form.last_name} onChange={(e) => setForm({...form, last_name: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Bio</label>
            <textarea value={form.bio} onChange={(e) => setForm({...form, bio: e.target.value})} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500 h-24"></textarea>
          </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2">
            <HiSave /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}