
import React from 'react';
import { User, UserRole } from '../types';
import { Shield, MoreHorizontal, UserPlus } from 'lucide-react';

export const UserManager: React.FC = () => {
  // Mock data for display
  // Fix: Adding required 'email' property to match User interface defined in types.ts
  const systemUsers: User[] = [
    { id: '1', name: 'User Manager', email: 'usermanager@gmail.com', role: 'ADMIN', avatar: 'https://ui-avatars.com/api/?name=User+Manager&background=6366f1&color=fff' },
    { id: '2', name: 'Super 1', email: 'super1@gmail.com', role: 'VIEWER', avatar: 'https://ui-avatars.com/api/?name=Super+1&background=10b981&color=fff' },
    { id: '3', name: 'Super 2', email: 'super2@gmail.com', role: 'BOOKING_MANAGER', avatar: 'https://ui-avatars.com/api/?name=Super+2&background=f59e0b&color=fff' },
    { id: '4', name: 'Super 3', email: 'super3@gmail.com', role: 'KITCHEN_MANAGER', avatar: 'https://ui-avatars.com/api/?name=Super+3&background=ef4444&color=fff' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500">Manage system access and roles.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Access Level</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {systemUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{user.role.replace('_', ' ')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.role === 'ADMIN' ? 'Full Access' : 'Restricted'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
