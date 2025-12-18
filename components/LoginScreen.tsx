import React from 'react';
import { User, UserRole } from '../types';
import { Shield, Eye, Calendar, Utensils, Lock, Building2, CheckCircle2, ChevronRight, Mail } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const users: User[] = [
    { 
      id: '1', 
      name: 'User Manager', 
      email: 'usermanager@gmail.com',
      role: 'ADMIN', 
      avatar: 'https://ui-avatars.com/api/?name=User+Manager&background=6366f1&color=fff' 
    },
    { 
      id: '2', 
      name: 'Super 1', 
      email: 'super1@gmail.com',
      role: 'VIEWER', 
      avatar: 'https://ui-avatars.com/api/?name=Super+1&background=10b981&color=fff' 
    },
    { 
      id: '3', 
      name: 'Super 2', 
      email: 'super2@gmail.com',
      role: 'BOOKING_MANAGER', 
      avatar: 'https://ui-avatars.com/api/?name=Super+2&background=f59e0b&color=fff' 
    },
    { 
      id: '4', 
      name: 'Super 3', 
      email: 'super3@gmail.com',
      role: 'KITCHEN_MANAGER', 
      avatar: 'https://ui-avatars.com/api/?name=Super+3&background=ef4444&color=fff' 
    },
  ];

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-indigo-500" />;
      case 'VIEWER': return <Eye className="w-4 h-4 text-emerald-500" />;
      case 'BOOKING_MANAGER': return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'KITCHEN_MANAGER': return <Utensils className="w-4 h-4 text-rose-500" />;
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'ADMIN': return 'Administrator';
      case 'VIEWER': return 'Observer';
      case 'BOOKING_MANAGER': return 'Room Manager';
      case 'KITCHEN_MANAGER': return 'Kitchen Staff';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-0 md:p-4 relative">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-3xl opacity-40"></div>
        </div>

        <div className="w-full max-w-5xl bg-white md:rounded-[2rem] shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row min-h-screen md:min-h-[600px] animate-fade-in-up">
          
          {/* Left Side - Banner */}
          <div className="md:w-5/12 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                   <Building2 className="w-6 h-6 text-white" />
                 </div>
                 <span className="text-xl font-bold tracking-tight uppercase tracking-widest">B4 Management</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Facility Security Portal
              </h1>
              <p className="text-indigo-100 text-base md:text-lg opacity-90">
                Authorized personnel only. Secure access to visitor logs, room bookings, and facility analytics.
              </p>
            </div>

            <div className="relative z-10 space-y-4 mt-8 hidden md:block">
              <div className="flex items-center gap-3 text-indigo-100">
                <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                <span className="font-medium">Encrypted Data Management</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-100">
                <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                <span className="font-medium">Real-time Activity Tracking</span>
              </div>
              <div className="flex items-center gap-3 text-indigo-100">
                <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                <span className="font-medium">Identity Verification Protocols</span>
              </div>
            </div>

            <div className="relative z-10 mt-8 md:mt-12 text-xs text-indigo-300/60 font-medium tracking-widest uppercase">
              Secure Operations Command • 2024
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 p-6 md:p-10 bg-slate-50 flex flex-col justify-center">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Access Control</h2>
              <p className="text-slate-500">Select your security profile to proceed to the dashboard.</p>
            </div>

            <div className="space-y-4 max-w-md mx-auto md:mx-0 w-full">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => onLogin(user)}
                  className="w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-500 hover:ring-1 hover:ring-indigo-500 hover:shadow-md transition-all group text-left flex items-center gap-4"
                >
                  <div className="relative shrink-0">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 group-hover:border-indigo-100 transition-colors" />
                     <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      user.role === 'ADMIN' ? 'bg-indigo-500' : 
                      user.role === 'VIEWER' ? 'bg-emerald-500' :
                      user.role === 'BOOKING_MANAGER' ? 'bg-amber-500' : 'bg-rose-500'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">{user.name}</h3>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mb-1">
                      <Mail className="w-3 h-3" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors truncate uppercase tracking-wider">
                        {getRoleIcon(user.role)}
                        <span className="truncate">{getRoleLabel(user.role)}</span>
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center md:justify-start gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              <Lock className="w-3 h-3" />
              <span>TLS 1.3 Certified Connection</span>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
