import React, { useState } from 'react';
import { Visitor, VisitorStatus, VisitorType } from '../types';
import { Search, Filter, MoreHorizontal, Download, Check, X, LogOut, Plus, Printer, Ticket } from 'lucide-react';
import { BadgePreview } from './BadgePreview';

interface VisitorLogProps {
  visitors: Visitor[];
  onStatusChange?: (id: string, status: VisitorStatus) => void;
  onRegister?: () => void;
}

export const VisitorLog: React.FC<VisitorLogProps> = ({ visitors, onStatusChange, onRegister }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<VisitorType | 'All'>('All');
  const [selectedVisitorForBadge, setSelectedVisitorForBadge] = useState<Visitor | null>(null);

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All' || v.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {selectedVisitorForBadge && (
        <BadgePreview 
          visitor={selectedVisitorForBadge} 
          onClose={() => setSelectedVisitorForBadge(null)} 
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Visitor Management Log</h2>
          <p className="text-slate-500 font-medium">Verified identity records and entry pass status.</p>
        </div>
        <div className="flex gap-3">
          {onRegister && (
            <button 
              onClick={onRegister}
              className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 font-black text-sm uppercase tracking-widest"
            >
              <Plus className="w-5 h-5" />
              <span>Register</span>
            </button>
          )}
          <button className="flex items-center space-x-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-700 hover:bg-slate-50 transition shadow-sm font-bold text-sm">
            <Download className="w-5 h-5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-50/30">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search database..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-bold text-slate-800 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {(['All', ...Object.values(VisitorType)] as const).map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type as VisitorType | 'All')}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border
                  ${filterType === type 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-5">Visitor Identity</th>
                <th className="px-8 py-5">Security Status</th>
                <th className="px-8 py-5">Niyaz</th>
                <th className="px-8 py-5">Expected Exit</th>
                <th className="px-8 py-5">Checked In</th>
                <th className="px-8 py-5">Credential Pass</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredVisitors.map(visitor => (
                <tr key={visitor.id} className={`group transition-all ${visitor.status === VisitorStatus.CHECKED_IN ? 'bg-indigo-50/10 hover:bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden ring-2 ring-white shadow-sm transition-transform group-hover:scale-110">
                        <img src={visitor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(visitor.fullName)}&background=random`} alt={visitor.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 group-hover:text-indigo-700 transition-colors truncate">{visitor.fullName}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{visitor.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em] border
                      ${visitor.status === VisitorStatus.CHECKED_IN ? 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-50' : 
                        visitor.status === VisitorStatus.CHECKED_OUT ? 'bg-slate-50 text-slate-500 border-slate-100' :
                        visitor.status === VisitorStatus.DENIED ? 'bg-rose-50 text-rose-700 border-rose-100' :
                        visitor.status === VisitorStatus.PENDING_APPROVAL ? 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse' :
                        'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                      {visitor.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-black text-indigo-600">
                    {visitor.numberOfNiyaz && visitor.numberOfNiyaz > 0 ? visitor.numberOfNiyaz : '-'}
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500">
                    {visitor.expectedCheckoutDate || '-'}
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-800">
                    {visitor.checkInTime || '-'}
                  </td>
                  <td className="px-8 py-5">
                    {visitor.status === VisitorStatus.CHECKED_IN ? (
                       <button 
                        onClick={() => setSelectedVisitorForBadge(visitor)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition transform active:scale-95"
                      >
                        <Ticket className="w-3.5 h-3.5" />
                        Print Pass
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Printer className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase">Locked</span>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {visitor.status === VisitorStatus.PENDING_APPROVAL && onStatusChange && (
                        <>
                          <button onClick={() => onStatusChange(visitor.id, VisitorStatus.CHECKED_IN)}
                            className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-lg shadow-emerald-100" title="Approve Identity">
                            <Check className="w-4.5 h-4.5" />
                          </button>
                          <button onClick={() => onStatusChange(visitor.id, VisitorStatus.DENIED)}
                            className="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition shadow-lg shadow-rose-100" title="Deny Access">
                            <X className="w-4.5 h-4.5" />
                          </button>
                        </>
                      )}
                      
                      {visitor.status === VisitorStatus.CHECKED_IN && onStatusChange && (
                        <button onClick={() => onStatusChange(visitor.id, VisitorStatus.CHECKED_OUT)}
                          className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition" title="Security Checkout">
                          <LogOut className="w-4.5 h-4.5" />
                        </button>
                      )}

                      <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-300 hover:text-slate-600 transition">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredVisitors.length === 0 && (
          <div className="p-20 text-center bg-slate-50/30">
            <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No Records Found</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto">No visitor matches your current security filter or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};