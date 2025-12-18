import React from 'react';
import { Visitor, VisitorStatus } from '../types';
import { Users, UserCheck, Clock, ShieldAlert, ChevronRight, Zap } from 'lucide-react';

interface DashboardProps {
  visitors: Visitor[];
  onOpenPreRegister: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ visitors, onOpenPreRegister }) => {
  const checkedInCount = visitors.filter(v => v.status === VisitorStatus.CHECKED_IN).length;
  const expectedCount = visitors.filter(v => v.status === VisitorStatus.PRE_REGISTERED).length;
  const totalToday = visitors.length;
  const securityAlerts = 0; 

  const StatCard = ({ title, value, icon: Icon, colorClass, borderClass }: { title: string, value: string | number, icon: any, colorClass: string, borderClass: string }) => (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4 border-t-4 ${borderClass} hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}>
      <div className={`p-4 rounded-xl ${colorClass} bg-opacity-10`}>
        <Icon className={`w-7 h-7 ${colorClass.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
           <p className="text-slate-500 mt-1">Real-time overview of visitor operations</p>
        </div>
        <div className="text-sm text-slate-400 font-medium bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm">
          {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="On-Site" 
          value={checkedInCount} 
          icon={UserCheck} 
          colorClass="bg-emerald-500" 
          borderClass="border-emerald-500"
        />
        <StatCard 
          title="Expected" 
          value={expectedCount} 
          icon={Clock} 
          colorClass="bg-blue-500" 
          borderClass="border-blue-500"
        />
        <StatCard 
          title="Total Visits" 
          value={totalToday} 
          icon={Users} 
          colorClass="bg-indigo-500" 
          borderClass="border-indigo-500"
        />
        <StatCard 
          title="Alerts" 
          value={securityAlerts} 
          icon={ShieldAlert} 
          colorClass="bg-rose-500" 
          borderClass="border-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
            <button className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold hover:underline flex items-center">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="space-y-4">
            {visitors.slice(0, 5).map(visitor => (
              <div key={visitor.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden ring-2 ring-white shadow-sm">
                      <img src={visitor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(visitor.fullName)}&background=random`} alt={visitor.fullName} className="w-full h-full object-cover" />
                    </div>
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                      visitor.status === VisitorStatus.CHECKED_IN ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}></div>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-700 transition-colors">{visitor.fullName}</p>
                    <p className="text-xs text-slate-500 font-medium">{visitor.location} • <span className="text-indigo-500">{visitor.host}</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                    ${visitor.status === VisitorStatus.CHECKED_IN ? 'bg-emerald-100 text-emerald-700' : 
                      visitor.status === VisitorStatus.CHECKED_OUT ? 'bg-slate-100 text-slate-600' :
                      'bg-blue-100 text-blue-700'}`}>
                    {visitor.status}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {visitor.checkInTime || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
            {visitors.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                No recent activity to show.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center space-x-2 mb-6">
               <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                 <Zap className="w-5 h-5" />
               </div>
               <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={onOpenPreRegister}
                className="w-full py-4 px-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-bold hover:from-indigo-600 hover:to-indigo-700 transition shadow-md shadow-indigo-200 flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                  <span>Pre-Register</span>
                </div>
                <ChevronRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full py-4 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                   <div className="bg-rose-100 text-rose-600 p-1.5 rounded-lg">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <span>Emergency Muster</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="w-full py-4 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition flex items-center justify-between group">
                 <div className="flex items-center space-x-3">
                   <div className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span>View Reports</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-80">System Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-sm font-medium">Reception Kiosk</span>
                </div>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">ONLINE</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-white/10">
                 <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-sm font-medium">Badge Printer</span>
                </div>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">READY</span>
              </div>
              <div className="flex justify-between items-center">
                 <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-sm font-medium">Cloud Sync</span>
                </div>
                <span className="text-xs text-slate-300">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};