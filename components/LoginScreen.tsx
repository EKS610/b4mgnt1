import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Shield, Lock, Building2, ChevronRight, User as UserIcon, Key, Info, UserPlus, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('VIEWER');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock Database initialized with standard system users
  const [registeredUsers, setRegisteredUsers] = useState<any[]>(() => {
    return [
      { name: 'Admin', password: 'password', role: 'ADMIN', email: 'admin@b4mngt.com' },
      { name: 'Manager', password: 'password', role: 'BOOKING_MANAGER', email: 'manager@b4mngt.com' },
      { name: 'Staff', password: 'password', role: 'KITCHEN_MANAGER', email: 'staff@b4mngt.com' },
    ];
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'login') {
      const foundUser = registeredUsers.find(
        u => u.name.toLowerCase() === username.toLowerCase() && u.password === password
      );

      if (foundUser) {
        onLogin({
          id: Math.random().toString(36).substr(2, 9),
          name: foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.name)}&background=6366f1&color=fff`
        });
      } else {
        setError('Invalid username or password. Are you registered?');
      }
    } else {
      // Registration Logic
      if (registeredUsers.some(u => u.name.toLowerCase() === username.toLowerCase())) {
        setError('Username already exists.');
        return;
      }

      const newUser = {
        name: username,
        password: password,
        role: selectedRole,
        email: `${username.toLowerCase().replace(/\s+/g, '.')}@b4mngt.com`
      };

      setRegisteredUsers([...registeredUsers, newUser]);
      setSuccess('Account created! You can now log in.');
      setMode('login');
      // Keep username for convenience
      setPassword('');
    }
  };

  const roles: { role: UserRole; label: string; description: string }[] = [
    { role: 'ADMIN', label: 'Administrator', description: 'Full system access' },
    { role: 'VIEWER', label: 'Observer', description: 'View-only access' },
    { role: 'BOOKING_MANAGER', label: 'Room Manager', description: 'Facility bookings' },
    { role: 'KITCHEN_MANAGER', label: 'Kitchen Staff', description: 'Inventory & hospitality' },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-y-auto selection:bg-indigo-100 selection:text-indigo-900 font-sans">
      <div className="min-h-screen flex items-center justify-center p-0 md:p-6 relative">
        {/* Animated Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] bg-violet-600/15 rounded-full blur-[140px] opacity-20"></div>
        </div>

        <div className="w-full max-w-4xl bg-white md:rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 flex flex-col md:flex-row min-h-screen md:min-h-[600px] animate-fade-in-up">
          
          {/* Left Side - Identity Banner */}
          <div className="md:w-5/12 bg-slate-950 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden border-r border-white/5">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600/20 to-violet-900/40 z-0"></div>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-10">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                   <Building2 className="w-7 h-7 text-white" />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xl font-black tracking-tighter uppercase">B4 MNGT</span>
                   <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] leading-none">Security Systems</span>
                 </div>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.1] mb-6 tracking-tight">
                Secure <br/><span className="text-indigo-500">Identity</span> Gateway
              </h1>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xs">
                {mode === 'login' 
                  ? 'Access the facility management network. Verified credentials required.' 
                  : 'Join the B4 Management ecosystem. Create your authorized profile.'}
              </p>
            </div>

            <div className="relative z-10 mt-12">
              <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  Protecting corporate assets through advanced identity verification and seamless visitor workflows.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Dynamic Auth Form */}
          <div className="flex-1 p-8 md:p-16 bg-white flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <div className="flex gap-4 mb-4 justify-center md:justify-start">
                <button 
                  onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  className={`text-sm font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${mode === 'login' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400'}`}
                >
                  Login
                </button>
                <button 
                  onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
                  className={`text-sm font-black uppercase tracking-widest pb-1 border-b-2 transition-all ${mode === 'register' ? 'border-indigo-600 text-slate-900' : 'border-transparent text-slate-400'}`}
                >
                  Register
                </button>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-500 font-medium">
                {mode === 'login' ? 'Sign in to manage your facility.' : 'Enter your details to register.'}
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-shake">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm font-bold animate-fade-in">
                <CheckCircle2 className="w-5 h-5" />
                {success}
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <UserIcon className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-semibold text-slate-800 placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Key className="w-5 h-5" />
                  </div>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-semibold text-slate-800 placeholder:text-slate-300"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div className="pt-2 animate-fade-in">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 block mb-3">Select System Role</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setSelectedRole(r.role)}
                        className={`p-4 rounded-xl border transition-all text-left relative overflow-hidden group ${
                          selectedRole === r.role 
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-100' 
                          : 'border-slate-100 bg-white hover:border-slate-300'
                        }`}
                      >
                        <p className={`text-xs font-black uppercase tracking-wider mb-1 ${selectedRole === r.role ? 'text-indigo-600' : 'text-slate-400'}`}>
                          {r.role.replace('_', ' ')}
                        </p>
                        <p className={`text-[10px] leading-tight ${selectedRole === r.role ? 'text-indigo-900 font-bold' : 'text-slate-500'}`}>
                          {r.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-slate-900 py-4 rounded-2xl text-white font-black text-lg shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:shadow-indigo-100 transition-all duration-300 flex items-center justify-center gap-2 group transform active:scale-[0.98]"
              >
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In to Portal
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Complete Registration
                  </>
                )}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                <Lock className="w-3.5 h-3.5" />
                <span>Encrypted Session</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase font-black tracking-widest">
                <Shield className="w-3.5 h-3.5" />
                <span>Identity Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};
