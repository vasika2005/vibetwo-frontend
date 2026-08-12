import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get('/admin/payments/').then(res => setPayments(res.data));
  }, []);

  return (
    <div className="pt-24 pb-32 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">Payments</h1>
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 text-gray-300"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Amount (₹)</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-t border-gray-800 text-gray-300">
                <td className="px-4 py-3 text-white font-bold">{p.user}</td>
                <td className="px-4 py-3">{(p.amount / 100).toFixed(2)}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${p.status === 'SUCCESS' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{p.status}</span></td>
                <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}