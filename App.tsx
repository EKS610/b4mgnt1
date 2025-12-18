import React, { useState, useEffect } from 'react';
import { ViewState, Visitor, VisitorStatus, VisitorType, User, UserRole } from './types';
import { LayoutDashboard, ClipboardList, BarChart2, Monitor, BookOpen, Menu, X, Bell, Globe, Settings as SettingsIcon, LogOut, Users, Calendar, Utensils } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { VisitorLog } from './components/VisitorLog';
import { Analytics } from './components/Analytics';
import { Kiosk } from './components/Kiosk';
import { AIGuide } from './components/AIGuide';
import { PreRegisterModal } from './components/PreRegisterModal';
import { PublicBooking } from './components/PublicBooking';
import { Settings } from './components/Settings';
import { LoginScreen } from './components/LoginScreen';
import { RoomBooking } from './components/RoomBooking';
import { KitchenManagement } from './components/KitchenManagement';
import { UserManager } from './components/UserManager';
import { subscribeToVisitors, addVisitorToStore, updateVisitorStatus } from './services/firebase';

const App: React.FC = () => {
  // 1. Hook Declarations (Must be at the top level, before any returns)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('dashboard');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPreRegisterOpen, setIsPreRegisterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Subscribe to Firebase updates on mount (only after login)
  useEffect(() => {
    if (!currentUser) return;

    // Safety timeout to ensure app shows up even if Firebase is slow/blocked
    const timer = setTimeout(() => setIsLoading(false), 2000);

    const unsubscribe = subscribeToVisitors((data) => {
      setVisitors(data);
      setIsLoading(false);
      clearTimeout(timer);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [currentUser]);

  // Reset view when user changes to ensure they land on an allowed page
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'BOOKING_MANAGER') setView('rooms');
      else if (currentUser.role === 'KITCHEN_MANAGER') setView('kitchen');
      else setView('dashboard');
    }
  }, [currentUser]);

  // 2. Action Handlers
  const handleKioskCheckIn = async (name: string, type: VisitorType, identificationId?: string) => {
    const newVisitor: Omit<Visitor, 'id'> = {
      fullName: name,
      location: 'Unknown', 
      email: '',
      type,
      host: 'Front Desk',
      status: VisitorStatus.PENDING_APPROVAL,
      checkInTime: '',
      ndaSigned: true,
      numberOfNiyaz: 0,
      identificationId: identificationId
    };
    
    try {
      await addVisitorToStore(newVisitor);
      if (currentUser?.role === 'ADMIN' || currentUser?.role === 'VIEWER') {
        setView('log'); 
      }
    } catch (error) {
      alert("Failed to check in. Please try again.");
    }
  };

  const handlePreRegisterSubmit = async (visitorData: any) => {
    const newVisitor: Omit<Visitor, 'id'> = {
      fullName: visitorData.fullName,
      location: visitorData.location || 'Unknown',
      email: '',
      type: visitorData.type,
      host: visitorData.host || 'Front Desk',
      status: VisitorStatus.PRE_REGISTERED,
      ndaSigned: false,
      numberOfNiyaz: visitorData.numberOfNiyaz,
      expectedCheckoutDate: visitorData.expectedCheckoutDate,
      identificationId: visitorData.identificationId,
      notes: ''
    };
    
    try {
      await addVisitorToStore(newVisitor);
    } catch (error) {
      alert("Failed to pre-register. Please check your connection.");
    }
  };

  const handleStatusChange = async (id: string, newStatus: VisitorStatus) => {
    try {
      await updateVisitorStatus(id, newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update visitor status");
    }
  };

  // 3. Conditional Early Returns (Must be after hook declarations)
  if (!currentUser) {
    return <LoginScreen onLogin={setCurrentUser} />;
  }

  if (view === 'kiosk') {
    return <Kiosk onExit={() => setView('dashboard')} onCheckIn={handleKioskCheckIn} />;
  }

  // 4. Component Helpers
  const NavItem = ({ target, icon: Icon, label, allowedRoles }: { target: ViewState, icon: any, label: string, allowedRoles?: UserRole[] }) => {
    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
      return null;
    }

    return (
      <button
        onClick={() => { setView(target); setSidebarOpen(false); }}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium duration-200 group
          ${view === target 
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-200 transform translate-x-1' 
            : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}`}
      >
        <Icon className={`w-5 h-5 ${view === target ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'} transition-colors`} />
        <span>{label}</span>
      </button>
    );
  };

  const pendingApprovals = visitors.filter(v => v.status === VisitorStatus.PENDING_APPROVAL).length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <PreRegisterModal 
        isOpen={isPreRegisterOpen} 
        onClose={() => setIsPreRegisterOpen(false)} 
        onSubmit={handlePreRegisterSubmit} 
      />

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-violet-700">B4 MNGT</span>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          <NavItem target="dashboard" icon={LayoutDashboard} label="Dashboard" allowedRoles={['ADMIN', 'VIEWER']} />
          <NavItem target="log" icon={ClipboardList} label="Visitor Log" allowedRoles={['ADMIN', 'VIEWER']} />
          <NavItem target="analytics" icon={BarChart2} label="Analytics" allowedRoles={['ADMIN']} />
          
          <div className="px-4 py-3 mt-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Modules
          </div>
          <NavItem target="rooms" icon={Calendar} label="Room Booking" allowedRoles={['ADMIN', 'BOOKING_MANAGER']} />
          <NavItem target="kitchen" icon={Utensils} label="Kitchen" allowedRoles={['ADMIN', 'KITCHEN_MANAGER']} />
          
          <div className="px-4 py-3 mt-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Apps
          </div>
          <NavItem target="kiosk" icon={Monitor} label="Kiosk Mode" allowedRoles={['ADMIN']} />
          <NavItem target="online-booking" icon={Globe} label="Online Booking" allowedRoles={['ADMIN', 'VIEWER']} />
          
          <div className="px-4 py-3 mt-6 text-xs font-bold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <NavItem target="users" icon={Users} label="User Management" allowedRoles={['ADMIN']} />
          <NavItem target="guide" icon={BookOpen} label="AI Guide & Help" allowedRoles={['ADMIN', 'VIEWER']} />
          <NavItem target="settings" icon={SettingsIcon} label="Settings" allowedRoles={['ADMIN']} />
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center space-x-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-full border border-white shadow-sm" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate w-24">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider truncate w-24">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button onClick={() => setCurrentUser(null)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Sign Out">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8">
          <button className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 lg:flex-none"></div>

          <div className="flex items-center space-x-6">
             {pendingApprovals > 0 && (currentUser.role === 'ADMIN' || currentUser.role === 'VIEWER') && (
               <div className="px-4 py-1.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 animate-pulse shadow-sm flex items-center gap-2">
                 <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                 {pendingApprovals} Pending Approvals
               </div>
             )}
             <div className="h-8 w-px bg-slate-200"></div>
             <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition group">
               <Bell className="w-6 h-6" />
               <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
             {isLoading && !['rooms', 'kitchen'].includes(view) ? (
               <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                 <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                 <p className="font-medium animate-pulse">Initialising Interface...</p>
               </div>
             ) : (
               <div className="animate-fade-in-up">
                {view === 'dashboard' && (currentUser.role === 'ADMIN' || currentUser.role === 'VIEWER') && (
                  <Dashboard 
                    visitors={visitors} 
                    onOpenPreRegister={() => setIsPreRegisterOpen(true)}
                  />
                )}
                {view === 'log' && (currentUser.role === 'ADMIN' || currentUser.role === 'VIEWER') && (
                  <VisitorLog 
                    visitors={visitors} 
                    onStatusChange={handleStatusChange} 
                    onRegister={() => setIsPreRegisterOpen(true)}
                  />
                )}
                {view === 'analytics' && currentUser.role === 'ADMIN' && <Analytics visitors={visitors} />}
                {view === 'rooms' && (currentUser.role === 'ADMIN' || currentUser.role === 'BOOKING_MANAGER') && <RoomBooking />}
                {view === 'kitchen' && (currentUser.role === 'ADMIN' || currentUser.role === 'KITCHEN_MANAGER') && <KitchenManagement visitors={visitors} />}
                {view === 'users' && currentUser.role === 'ADMIN' && <UserManager />}
                {view === 'guide' && <AIGuide />}
                {view === 'online-booking' && <PublicBooking onSubmit={handlePreRegisterSubmit} />}
                {view === 'settings' && currentUser.role === 'ADMIN' && <Settings />}
               </div>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;