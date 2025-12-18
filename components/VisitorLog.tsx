import React, { useState } from 'react';
import { Visitor, VisitorStatus, VisitorType } from '../types';
import { Search, Filter, MoreHorizontal, Download, Check, X, LogOut, Plus } from 'lucide-react';

interface VisitorLogProps {
  visitors: Visitor[];
  onStatusChange?: (id: string, status: VisitorStatus) => void;
  onRegister?: () => void;
}

export const VisitorLog: React.FC<VisitorLogProps> = ({ visitors, onStatusChange, onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<VisitorType | 'All'>('All');

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || v.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Visitor Log</h2>
          <p className="text-slate-500 text-sm mt-1">Manage and track all visitor entries</p>
        </div>
        <div className="flex gap-3">
          {onRegister && (
            <button 
              onClick={onRegister}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all transform hover:-translate-y-0.5 font-semibold"
            >
              <Plus className="w-5 h-5" />
              <span>Register Visitor</span>
            </button>
          )}
          <button className="flex items-center space-x-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition shadow-sm font-semibold">
            <Download className="w-5 h-5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center space-x-2 px-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-500 uppercase">Filter:</span>
            </div>
            {(['All', ...Object.values(VisitorType)] as const).map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type as VisitorType | 'All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border
                  ${filterType === type 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Visitor</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Niyaz</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Checkout</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Check-In</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">NDA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVisitors.map(visitor => (
                <tr key={visitor.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                       <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                        <img src={visitor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(visitor.fullName)}&background=random`} alt={visitor.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-700">{visitor.fullName}</p>
                        <p className="text-xs text-slate-500 font-medium">{visitor.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide
                      ${visitor.status === VisitorStatus.CHECKED_IN ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        visitor.status === VisitorStatus.CHECKED_OUT ? 'bg-slate-50 text-slate-600 border-slate-100' :
                        visitor.status === VisitorStatus.DENIED ? 'bg-red-50 text-red-700 border-red-100' :
                        visitor.status === VisitorStatus.PENDING_APPROVAL ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {visitor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {visitor.numberOfNiyaz !== undefined ? visitor.numberOfNiyaz : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {visitor.expectedCheckoutDate || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {visitor.checkInTime || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {visitor.ndaSigned ? (
                      <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Signed</span>
                    ) : (
                      <span className="text-amber-600 text-xs font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {visitor.status === VisitorStatus.PENDING_APPROVAL && onStatusChange && (
                        <>
                          <button 
                            onClick={() => onStatusChange(visitor.id, VisitorStatus.CHECKED_IN)}
                            className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition shadow-sm"
                            title="Approve Entry"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => onStatusChange(visitor.id, VisitorStatus.DENIED)}
                            className="p-2 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition shadow-sm"
                            title="Deny Entry"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      
                      {visitor.status === VisitorStatus.CHECKED_IN && onStatusChange && (
                        <button 
                          onClick={() => onStatusChange(visitor.id, VisitorStatus.CHECKED_OUT)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                          title="Check Out"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      )}

                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredVisitors.length === 0 && (
          <div className="p-12 text-center text-slate-500 bg-slate-50/50">
            <p className="font-medium">No visitors found.</p>
            <p className="text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};