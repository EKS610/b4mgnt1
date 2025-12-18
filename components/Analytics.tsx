import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Visitor, VisitorType } from '../types';

interface AnalyticsProps {
  visitors: Visitor[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Analytics: React.FC<AnalyticsProps> = ({ visitors }) => {
  // Mock data for trends (since we don't have historical data in this simple state)
  const hourlyData = [
    { name: '8am', visitors: 4 },
    { name: '9am', visitors: 12 },
    { name: '10am', visitors: 28 },
    { name: '11am', visitors: 18 },
    { name: '12pm', visitors: 14 },
    { name: '1pm', visitors: 22 },
    { name: '2pm', visitors: 16 },
    { name: '3pm', visitors: 10 },
    { name: '4pm', visitors: 6 },
    { name: '5pm', visitors: 2 },
  ];

  const typeData = Object.values(VisitorType).map(type => ({
    name: type,
    value: visitors.filter(v => v.type === type).length || Math.floor(Math.random() * 10) + 1 // Fallback mock for demo visual
  }));

  const weeklyData = [
    { name: 'Mon', visitors: 45 },
    { name: 'Tue', visitors: 52 },
    { name: 'Wed', visitors: 38 },
    { name: 'Thu', visitors: 65 },
    { name: 'Fri', visitors: 48 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Analytics & Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Peak Hours Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Peak Visitor Hours</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="visitors" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visitor Types Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Visitor Distribution by Type</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {typeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                <span className="text-xs text-slate-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-2">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Weekly Traffic Volume</h3>
             <select className="text-sm border-slate-200 rounded-lg text-slate-600 bg-slate-50 p-2 border">
               <option>Last 7 Days</option>
               <option>Last 30 Days</option>
             </select>
           </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};