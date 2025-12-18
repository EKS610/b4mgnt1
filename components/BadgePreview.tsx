import React, { useState } from 'react';
import { Visitor, VisitorType } from '../types';
import { X, Printer, CheckCircle2, QrCode, Building2 } from 'lucide-react';

interface BadgePreviewProps {
  visitor: Visitor;
  onClose: () => void;
}

export const BadgePreview: React.FC<BadgePreviewProps> = ({ visitor, onClose }) => {
  const [printing, setPrinting] = useState(false);
  const [printed, setPrinted] = useState(false);

  const handlePrint = () => {
    setPrinting(true);
    setTimeout(() => {
      setPrinting(false);
      setPrinted(true);
      setTimeout(() => setPrinted(false), 3000);
    }, 2000);
  };

  const getTypeColor = (type: VisitorType) => {
    switch (type) {
      case VisitorType.GUEST: return 'bg-blue-600';
      case VisitorType.CONTRACTOR: return 'bg-amber-600';
      case VisitorType.MEMBER: return 'bg-emerald-600';
      case VisitorType.VOLUNTEER: return 'bg-indigo-600';
      default: return 'bg-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-badge-in">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Printer className="w-5 h-5 text-indigo-600" />
            Badge System
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 rounded-full transition text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center">
          {/* Badge Frame */}
          <div className="relative w-72 bg-white rounded-[2rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden flex flex-col items-center pb-8 animate-float">
            
            {/* Lanyard Hole Decor */}
            <div className="absolute top-4 w-12 h-3 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center">
               <div className="w-6 h-1 bg-slate-200 rounded-full"></div>
            </div>

            {/* Header / Banner */}
            <div className={`w-full h-24 ${getTypeColor(visitor.type)} flex flex-col items-center justify-center text-white px-4 pt-4`}>
                <div className="flex items-center gap-2 mb-1">
                   <Building2 className="w-4 h-4 text-white/80" />
                   <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-90">B4 MNGT</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-widest">{visitor.type}</h3>
            </div>

            {/* Photo */}
            <div className="mt-[-40px] relative">
              <div className="w-32 h-32 rounded-3xl border-8 border-white shadow-xl overflow-hidden bg-slate-200">
                <img 
                  src={visitor.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(visitor.fullName)}&background=random&size=256`} 
                  alt={visitor.fullName} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 text-center px-6">
               <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{visitor.fullName}</h4>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{visitor.location}</p>
            </div>

            <div className="mt-8 w-full px-6 flex items-center justify-between border-t border-slate-50 pt-6">
               <div className="text-left">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Valid On</span>
                  <span className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString()}</span>
               </div>
               <div className="w-12 h-12 bg-slate-50 rounded-lg p-1.5 border border-slate-100 flex items-center justify-center">
                  <QrCode className="w-full h-full text-slate-800" />
               </div>
               <div className="text-right">
                  <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Host</span>
                  <span className="text-xs font-bold text-indigo-600">{visitor.host}</span>
               </div>
            </div>

            {/* Security Foil */}
            <div className="absolute bottom-3 right-3 w-6 h-6 bg-gradient-to-br from-slate-200 via-white to-slate-200 rounded-full opacity-40 shadow-inner flex items-center justify-center overflow-hidden">
               <div className="w-full h-[1px] bg-slate-400 rotate-45 animate-pulse"></div>
            </div>
          </div>

          <div className="mt-10 w-full space-y-4">
            {printed ? (
              <div className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center justify-center gap-3 font-bold animate-fade-in">
                <CheckCircle2 className="w-6 h-6" />
                Badge Sent to Thermal Printer
              </div>
            ) : (
              <button 
                onClick={handlePrint}
                disabled={printing}
                className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                  printing 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 transform active:scale-[0.98]'
                }`}
              >
                {printing ? (
                  <>
                    <div className="w-5 h-5 border-3 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                    Generating Output...
                  </>
                ) : (
                  <>
                    <Printer className="w-6 h-6" />
                    Print Physical Badge
                  </>
                )}
              </button>
            )}
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Zebra ZC300 • ID: {visitor.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .animate-badge-in {
          animation: badgeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes badgeIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};
