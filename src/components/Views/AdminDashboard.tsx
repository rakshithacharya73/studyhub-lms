import React from 'react';

export const AdminDashboard: React.FC = () => (
  <div className="p-8 max-w-7xl mx-auto">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-1">Admin Control Panel</h2>
      <p className="text-gray-500">System overview and user management</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <div className="text-3xl font-bold text-brand-indigo mb-1">1,204</div>
        <div className="text-sm text-gray-500 font-medium">Total Users</div>
      </div>
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <div className="text-3xl font-bold text-green-500 mb-1">98.2%</div>
        <div className="text-sm text-gray-500 font-medium">Server Uptime</div>
      </div>
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <div className="text-3xl font-bold text-purple-500 mb-1">$45k</div>
        <div className="text-sm text-gray-500 font-medium">Monthly Revenue</div>
      </div>
      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
        <div className="text-3xl font-bold text-red-500 mb-1">2</div>
        <div className="text-sm text-gray-500 font-medium">Active Alerts</div>
      </div>
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">User Management</h3>
        <button className="text-brand-blue text-sm font-semibold">+ Add User</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
              <th className="px-6 py-3 font-medium">Name / Email</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {['admin@studyhub.com', 'teacher@studyhub.com', 'student@studyhub.com'].map((email, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{email}</td>
                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{email.split('@')[0]}</td>
                <td className="px-6 py-4 text-sm">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Active</span>
                </td>
                <td className="px-6 py-4 text-sm text-brand-blue font-semibold cursor-pointer hover:underline">Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
