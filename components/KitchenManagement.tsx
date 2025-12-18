import React, { useState } from 'react';
import { Utensils, Coffee, CheckCircle, Clock, AlertCircle, Users, Droplets } from 'lucide-react';
import { Visitor, VisitorStatus } from '../types';

interface Order {
  id: string;
  item: string;
  for: string;
  location: string;
  status: 'pending' | 'preparing' | 'delivered';
  time: string;
}

interface KitchenManagementProps {
  visitors: Visitor[];
}

export const KitchenManagement: React.FC<KitchenManagementProps> = ({ visitors }) => {
  const [orders, setOrders] = useState<Order[]>([
    { id: '101', item: 'Coffee & Biscuits', for: 'Meeting Room B', location: 'Level 2', status: 'pending', time: '10:05 AM' },
    { id: '102', item: 'Vegetarian Lunch Set x5', for: 'Conference Hall A', location: 'Level 2', status: 'preparing', time: '12:00 PM' },
    { id: '104', item: 'Non-Veg Lunch Set x3', for: 'Executive Room', location: 'Level 3', status: 'pending', time: '12:15 PM' },
  ]);

  const advanceStatus = (id: string) => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        if (o.status === 'pending') return { ...o, status: 'preparing' };
        if (o.status === 'preparing') return { ...o, status: 'delivered' };
      }
      return o;
    }));
  };

  // Calculate Real-time Visitor Stats
  const currentVisitors = visitors.filter(v => v.status === VisitorStatus.CHECKED_IN).length;
  const totalVisitorsToday = visitors.length;
  // Simple heuristic: Estimate 1.5 beverages per current visitor
  const estimatedBeverages = Math.ceil(currentVisitors * 1.5);
  // Calculate total Niyaz count from all visitors
  const totalNiyaz = visitors.reduce((sum, v) => sum + (v.numberOfNiyaz || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Kitchen & Catering</h2>
          <p className="text-slate-500 mt-1">Manage hospitality requests and inventory.</p>
        </div>
        <div className="bg-orange-100 text-orange-800 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm border border-orange-200">
           <AlertCircle className="w-5 h-5" />
           <span>2 Pending Requests</span>
        </div>
      </div>

      {/* Live Visitor Insights for Kitchen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Currently On-Site</p>
            <h3 className="text-2xl font-bold text-slate-800">{currentVisitors}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Today</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalVisitorsToday}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Est. Demand</p>
            <h3 className="text-2xl font-bold text-slate-800">{estimatedBeverages} <span className="text-sm font-medium text-slate-400">units</span></h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">Total Niyaz</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalNiyaz}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2 bg-slate-50/50">
          <Utensils className="w-5 h-5 text-slate-500" />
          Current Orders
        </div>
        <div className="p-4 space-y-3">
          {orders.map(order => (
            <div key={order.id} className={`p-5 rounded-xl border-l-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all
              ${order.status === 'pending' ? 'bg-orange-50 border-orange-400' : 
                order.status === 'preparing' ? 'bg-blue-50 border-blue-400' : 
                'bg-emerald-50 border-emerald-400 opacity-75'}`}>
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shadow-sm ${
                  order.status === 'pending' ? 'bg-white text-orange-600' :
                  order.status === 'preparing' ? 'bg-white text-blue-600' :
                  'bg-white text-emerald-600'
                }`}>
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{order.item}</h4>
                  <div className="text-sm text-slate-600 flex flex-col sm:flex-row sm:gap-4 mt-1 font-medium">
                    <span>For: <span className="text-slate-800">{order.for}</span></span>
                    <span>Loc: <span className="text-slate-800">{order.location}</span></span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wide bg-white px-2 py-1 rounded border border-slate-100">
                     <Clock className="w-3 h-3" /> {order.time}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto self-end md:self-center">
                 {order.status !== 'delivered' && (
                   <button 
                     onClick={() => advanceStatus(order.id)}
                     className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-300 whitespace-nowrap"
                   >
                     {order.status === 'pending' ? 'Start Preparing' : 'Mark as Done'}
                   </button>
                 )}
                 {order.status === 'delivered' && (
                   <div className="flex items-center gap-2 text-emerald-600 font-bold px-4 py-2 bg-white rounded-lg border border-emerald-100">
                     <CheckCircle className="w-5 h-5" />
                     Delivered
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
           <h3 className="font-bold text-slate-800 mb-6">Inventory Levels</h3>
           <div className="space-y-6">
              {[
                { name: 'Coffee Beans', level: 75, color: 'bg-amber-600' },
                { name: 'Tea Bags', level: 40, color: 'bg-emerald-600' },
                { name: 'Bottled Water', level: 90, color: 'bg-blue-500' },
                { name: 'Snack Packs', level: 20, color: 'bg-indigo-500' }
              ].map(item => (
                <div key={item.name}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    <span className="text-xs font-medium text-slate-500">{item.level}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.level}%` }}></div>
                  </div>
                </div>
              ))}
           </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white flex flex-col justify-between shadow-xl">
           <div>
             <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-6 h-6 text-indigo-200" />
                <h3 className="font-bold text-xl">Kitchen Notices</h3>
             </div>
             <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-indigo-50 text-sm font-medium leading-relaxed">No special dietary restrictions reported for today's VIP visitors. Standard menu applies.</p>
             </div>
           </div>
           <button className="mt-6 w-full py-3 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition shadow-lg">
             View All Requests
           </button>
        </div>
      </div>
    </div>
  );
};