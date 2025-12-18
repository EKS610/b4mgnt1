import React, { useState } from 'react';
import { X, User, Calendar, Hash, MapPin, UserCheck, ScanLine } from 'lucide-react';
import { VisitorType, Visitor } from '../types';

interface PreRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (visitorData: any) => void;
}

export const PreRegisterModal: React.FC<PreRegisterModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    host: '',
    type: VisitorType.GUEST,
    numberOfNiyaz: 0,
    expectedCheckoutDate: '',
    identificationId: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({
      fullName: '',
      location: '',
      host: '',
      type: VisitorType.GUEST,
      numberOfNiyaz: 0,
      expectedCheckoutDate: '',
      identificationId: ''
    });
  };

  const handleSimulateIDScan = () => {
    // Simulate reading from an ID scanner
    setFormData({
      ...formData,
      fullName: "Michael Chang",
      identificationId: "DL-CA-9876543",
      numberOfNiyaz: 1,
      type: VisitorType.GUEST
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">New Visitor Registration</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           
           <div className="flex justify-end">
             <button type="button" onClick={handleSimulateIDScan} className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
               <ScanLine className="w-3 h-3 mr-1" />
               Simulate ID Scan
             </button>
           </div>

          <div className="space-y-4">
             {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Visitor Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="text" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                  value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="Full Name" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Niyaz */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">No. of Niyaz</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min="0" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.numberOfNiyaz} onChange={e => setFormData({...formData, numberOfNiyaz: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              
              {/* Checkout Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Checkout Date</label>
                 <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="date" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.expectedCheckoutDate} onChange={e => setFormData({...formData, expectedCheckoutDate: e.target.value})} />
                </div>
              </div>
            </div>

             {/* Type */}
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Visitor Type</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as VisitorType})}>
                {Object.values(VisitorType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Country/State & Host */}
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country, State</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Country, State" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Host</label>
                   <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                      value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} placeholder="Optional" />
                  </div>
               </div>
             </div>
             
             {formData.identificationId && (
               <div className="bg-slate-50 p-2 rounded text-xs text-slate-500 flex items-center">
                 <ScanLine className="w-3 h-3 mr-2" />
                 ID Captured: {formData.identificationId}
               </div>
             )}
          </div>
          
          <div className="pt-4 flex space-x-3">
             <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition">
               Cancel
             </button>
             <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
               Register Visitor
             </button>
          </div>
        </form>
      </div>
      <style>{`
        .animate-fade-in {
          animation: modalFadeIn 0.2s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};