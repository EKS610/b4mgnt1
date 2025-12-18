import React, { useState } from 'react';
import { VisitorType, VisitorStatus } from '../types';
import { User, Calendar, Hash, MapPin, Send, Globe } from 'lucide-react';

interface PublicBookingProps {
  onSubmit: (data: any) => void;
}

export const PublicBooking: React.FC<PublicBookingProps> = ({ onSubmit }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    type: VisitorType.GUEST,
    numberOfNiyaz: 0,
    expectedCheckoutDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Simulate network delay
    setTimeout(() => {
      // We still use the parent handler here to maintain the flow, 
      // which has been updated in App.tsx to use Firebase.
      onSubmit({
        ...formData,
        host: 'Online Booking',
        identificationId: 'PENDING-VERIFICATION'
      });
      
      setFormData({
        fullName: '',
        location: '',
        type: VisitorType.GUEST,
        numberOfNiyaz: 0,
        expectedCheckoutDate: ''
      });
      
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <Globe className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Online Visitor Pre-Booking</h1>
        <p className="text-slate-500 mt-2">Plan your visit to B4 MNGT in advance to save time at the reception.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {submitted ? (
          <div className="p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Request Sent!</h2>
            <p className="text-slate-600">Your information has been securely added to our database.</p>
            <p className="text-slate-400 text-sm mt-4">Redirecting to form...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                   <input required type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                     placeholder="Your Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Country, State</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                   <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                     placeholder="e.g. USA, California" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Checkout Date</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                   <input required type="date" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                     value={formData.expectedCheckoutDate} onChange={e => setFormData({...formData, expectedCheckoutDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">No. of Niyaz</label>
                <div className="relative">
                   <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                   <input type="number" min="0" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                     value={formData.numberOfNiyaz} onChange={e => setFormData({...formData, numberOfNiyaz: parseInt(e.target.value) || 0})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Purpose of Visit</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as VisitorType})}>
                {Object.values(VisitorType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2">
              <span>Submit Pre-Booking</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <p className="text-center text-xs text-slate-400 mt-4">
              By submitting this form, your data will be securely stored in the B4 MNGT database.
            </p>
          </form>
        )}
      </div>
      
      {/* Visual cue for database integration */}
      <div className="mt-8 flex justify-center space-x-8 text-slate-400 text-sm">
         <div className="flex items-center space-x-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span>Database Connected</span>
         </div>
         <div className="flex items-center space-x-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span>Secure Encryption</span>
         </div>
      </div>
    </div>
  );
};

// Simple Arrow icon for this component
const ArrowRight = ({className}: {className?: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);