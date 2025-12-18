import React, { useState, useMemo } from 'react';
import { Utensils, Coffee, CheckCircle, Clock, AlertCircle, Users, Droplets, Ticket, Zap } from 'lucide-react';
import { Visitor, VisitorStatus } from '../types';

interface Order {
  id: string;
  item: string;
  for: string;
  location: string;
  status: 'pending' | 'preparing' | 'delivered';
  time: string;
  isNiyaz?: boolean;
}

interface KitchenManagementProps {
  visitors: Visitor[];
}

export const KitchenManagement: React.FC<KitchenManagementProps> = ({ visitors }) => {
  // Manual orders for special catering requests
  const [manualOrders, setManualOrders] = useState<Order[]>([
    { id: '101', item: 'Executive Coffee & Biscuits', for: 'Meeting Room B', location: 'Level 2', status: 'pending', time: '10:05 AM' },
    { id: '102', item: 'Vegetarian Lunch Set x5', for: 'Conference Hall A', location: 'Level 2', status: 'preparing', time: '12:00 PM' },
  ]);

  // Derive Automatic Niyaz Orders from the Visitor Log (Checked In visitors with Niyaz count)
  const autoNiyazOrders = useMemo(() => {
    return visitors
      .filter(v => v.status === VisitorStatus.CHECKED_IN && (v.numberOfNiyaz || 0) > 0)
      .map(v => ({
        id: `niyaz-${v.id}`,
        item: `Niyaz Service (Headcount: ${v.numberOfNiyaz})`,
        for: v.fullName,
        location: v.location,
        status: 'pending' as const, // In a real app, this might be synced from a 'fulfilment' collection
        time: v.checkInTime || 'Just now',
        isNiyaz: true
      }));
  }, [visitors]);

  const advanceStatus = (id: string) => {
    if (id.startsWith('niyaz-')) {
      // Logic for handling automatic order status (could be sent back to a db)
      console.log(`Fulfilled Niyaz for: ${id}`);
    } else {
      setManualOrders(manualOrders.map(o => {
        if (o.id === id) {
          if (o.status === 'pending') return { ...o, status: 'preparing' };
          if (o.status === 'preparing') return { ...o, status: 'delivered' };
        }
        return o;
      }));
    }
  };

  // Calculate Real-time Visitor Stats
  const currentVisitors = visitors.filter(v => v.status === VisitorStatus.CHECKED_IN).length;
  const totalVisitorsToday = visitors.length;
  const estimatedBeverages = Math.ceil(currentVisitors * 1.5);
  const totalNiyaz = visitors.reduce((sum, v) => sum + (v.numberOfNiyaz || 0), 0);
  const activeNiyazPending = visitors.filter(v => v.status === VisitorStatus.CHECKED_IN && (v.numberOfNiyaz || 0) > 0).length;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kitchen & Hospitality</h2>
          <p className="text-slate-500 font-medium">Real-time catering based on Visitor Log entry passes.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-emerald-100 text-emerald-800 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm border border-emerald-200">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span>System Online</span>
          </div>
        </div>
      </div>

      {/* Live Visitor Insights for Kitchen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Live On-Site</p>
            <h3 className="text-3xl font-black text-slate-900">{currentVisitors}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-xl transition-all">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Utensils className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Niyaz</p>
            <h3 className="text-3xl font-black text-slate-900">{totalNiyaz}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-xl transition-all">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Pending Tasks</p>
            <h3 className="text-3xl font-black text-slate-900">{manualOrders.filter(o => o.status !== 'delivered').length + activeNiyazPending}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-xl transition-all">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
            <Droplets className="w-7 h-7" />
          </div>
          <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Beverage Demand</p>
            <h3 className="text-3xl font-black text-slate-900">{estimatedBeverages}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Orders Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">Current Queue</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auto-Synced with Visitor Log</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                {autoNiyazOrders.length + manualOrders.length} Total
              </div>
            </div>

            <div className="p-8 space-y-4">
              {/* Niyaz Orders - Automatically appearing from log */}
              {autoNiyazOrders.map(order => (
                <div key={order.id} className="p-6 rounded-3xl border-2 border-dashed border-indigo-100 bg-indigo-50/20 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-indigo-300 transition-colors animate-fade-in">
                  <div className="flex items-start gap-5 w-full">
                    <div className="p-4 bg-white rounded-2xl shadow-sm text-indigo-600 border border-indigo-100 shrink-0">
                      <Zap className="w-8 h-8" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-tighter rounded-md">LOG SYNCED</span>
                        <h4 className="font-black text-slate-900 text-lg truncate">{order.item}</h4>
                      </div>
                      <div className="text-sm text-slate-500 font-bold flex flex-wrap gap-x-4">
                        <span>Visitor: <span className="text-slate-800">{order.for}</span></span>
                        <span>Location: <span className="text-slate-800">{order.location}</span></span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100 flex items-center gap-1.5">
                           <Clock className="w-3 h-3" /> Checked In @ {order.time}
                         </span>
                         <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                           Ready for fulfilment
                         </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => advanceStatus(order.id)}
                    className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition shadow-xl shadow-slate-200 whitespace-nowrap"
                  >
                    Mark Fulfilled
                  </button>
                </div>
              ))}

              {/* Manual Orders */}
              {manualOrders.map(order => (
                <div key={order.id} className={`p-6 rounded-3xl border-2 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all animate-fade-in
                  ${order.status === 'pending' ? 'bg-slate-50 border-slate-100' : 
                    order.status === 'preparing' ? 'bg-blue-50/30 border-blue-100' : 
                    'bg-emerald-50/30 border-emerald-100 opacity-60'}`}>
                  
                  <div className="flex items-start gap-5 w-full">
                    <div className={`p-4 rounded-2xl shadow-sm shrink-0 border ${
                      order.status === 'pending' ? 'bg-white text-slate-400 border-slate-100' :
                      order.status === 'preparing' ? 'bg-white text-blue-600 border-blue-100' :
                      'bg-white text-emerald-600 border-emerald-100'
                    }`}>
                      <Coffee className="w-8 h-8" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-slate-900 text-lg truncate mb-1">{order.item}</h4>
                      <div className="text-sm text-slate-500 font-bold flex flex-wrap gap-x-4">
                        <span>For: <span className="text-slate-800">{order.for}</span></span>
                        <span>Area: <span className="text-slate-800">{order.location}</span></span>
                      </div>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded-lg border border-slate-100">
                         <Clock className="w-3 h-3" /> Request: {order.time}
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                     {order.status !== 'delivered' && (
                       <button 
                         onClick={() => advanceStatus(order.id)}
                         className="w-full px-8 py-4 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:text-indigo-600 transition shadow-lg shadow-slate-50 whitespace-nowrap"
                       >
                         {order.status === 'pending' ? 'Prepare Order' : 'Complete Delivery'}
                       </button>
                     )}
                     {order.status === 'delivered' && (
                       <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase tracking-widest px-6 py-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-sm">
                         <CheckCircle className="w-5 h-5" />
                         Completed
                       </div>
                     )}
                  </div>
                </div>
              ))}

              {autoNiyazOrders.length === 0 && manualOrders.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Utensils className="w-10 h-10 text-slate-200" />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-2">Kitchen is Clear</h4>
                  <p className="font-medium">No pending Niyaz or catering requests at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl"></div>
            <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Kitchen Insight
            </h3>
            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Arrival Rate</p>
                <div className="flex items-end gap-2">
                   <span className="text-3xl font-black">{Math.min(10, currentVisitors)}</span>
                   <span className="text-xs font-bold text-emerald-400 mb-1">Check-ins/hr</span>
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Hospitality Index</p>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                   <div className="bg-indigo-500 h-full w-[65%]" style={{ width: `${Math.min(100, (totalNiyaz/20)*100)}%` }}></div>
                </div>
                <p className="text-[10px] text-indigo-300 font-bold mt-2">Active service for {activeNiyazPending} visitors</p>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition shadow-xl shadow-indigo-900/50">
               Generate Inventory List
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Security & Hygiene</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-600">Health Certification Verified</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-600">Daily Safety Checklist Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                <span className="text-xs font-bold text-slate-600">Real-time sync with Entry Pass Log</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};