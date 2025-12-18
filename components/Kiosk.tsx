import React, { useState, useRef, useEffect } from 'react';
import { VisitorType } from '../types';
import { Camera, QrCode, PenTool, CheckCircle, ArrowRight, X, ScanLine, CreditCard, Clock, Printer, Building2, QrCode as QrIcon, Home, ChevronLeft } from 'lucide-react';

interface KioskProps {
  onExit: () => void;
  onCheckIn: (name: string, type: VisitorType, identificationId?: string) => void;
}

export const Kiosk: React.FC<KioskProps> = ({ onExit, onCheckIn }) => {
  const [step, setStep] = useState<'welcome' | 'method' | 'details' | 'photo' | 'success'>('welcome');
  const [method, setMethod] = useState<'qr' | 'manual' | 'id'>('manual');
  const [formData, setFormData] = useState({ name: '', location: '', host: '', type: VisitorType.GUEST, identificationId: '' });
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera error:", err));
    }
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
    };
  }, [cameraActive, step]);

  const handleSimulateScan = () => {
    setTimeout(() => {
      if (method === 'qr') {
        setFormData({ 
          name: "Alex Rivera", 
          location: "New York, NY", 
          host: "Sarah Connor",
          type: VisitorType.CONTRACTOR,
          identificationId: ''
        });
      } else if (method === 'id') {
         setFormData({ 
          name: "Jessica Jones", 
          location: "Austin, TX", 
          host: "Luke Cage",
          type: VisitorType.GUEST,
          identificationId: 'ID-8829103'
        });
      }
      setStep('success');
      onCheckIn(
        method === 'id' ? "Jessica Jones" : "Alex Rivera", 
        method === 'id' ? VisitorType.GUEST : VisitorType.CONTRACTOR,
        method === 'id' ? "ID-8829103" : undefined
      );
    }, 2000);
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('photo');
    setCameraActive(true);
  };

  const handlePhotoTaken = () => {
    setCameraActive(false);
    setStep('success');
    onCheckIn(formData.name, formData.type);
  };

  const handleBack = () => {
    setCameraActive(false);
    if (step === 'method') setStep('welcome');
    else if (step === 'details') setStep('method');
    else if (step === 'photo') {
      if (method === 'manual') setStep('details');
      else setStep('method');
    }
  };

  const resetToHome = () => {
    setCameraActive(false);
    setStep('welcome');
    setFormData({ name: '', location: '', host: '', type: VisitorType.GUEST, identificationId: '' });
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
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative min-h-[650px] animate-fade-in-up">
        
        <div className="h-16 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-8">
          <div className="flex items-center space-x-4">
            <button 
              onClick={resetToHome}
              className={`p-2 rounded-xl transition-all ${step === 'welcome' ? 'text-slate-300' : 'text-slate-500 hover:bg-slate-200 hover:text-indigo-600'}`}
              title="Home"
              disabled={step === 'welcome'}
            >
              <Home className="w-5 h-5" />
            </button>
            {step !== 'welcome' && step !== 'success' && (
              <button 
                onClick={handleBack}
                className="flex items-center gap-1.5 px-3 py-1.5 text-slate-500 hover:bg-slate-200 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
          <button onClick={onExit} className="text-slate-400 hover:text-slate-900 text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-slate-200 rounded-xl transition-all">Exit Kiosk</button>
        </div>

        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center overflow-y-auto">
          
          {step === 'welcome' && (
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-indigo-200">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl font-black text-slate-900 tracking-tight">Welcome to B4 MNGT</h1>
                <p className="text-slate-500 text-xl font-medium">Please check in to proceed.</p>
              </div>
              <button 
                onClick={() => setStep('method')}
                className="px-12 py-5 bg-slate-900 text-white text-2xl font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-2xl shadow-slate-200 transform hover:-translate-y-1 active:scale-95 flex items-center gap-3 mx-auto"
              >
                Start Check-In
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          )}

          {step === 'method' && (
            <div className="space-y-8 w-full max-w-lg animate-fade-in">
               <h2 className="text-3xl font-black text-slate-900">Select Method</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button onClick={() => { setMethod('qr'); setStep('photo'); setCameraActive(true); handleSimulateScan(); }}
                   className="flex flex-col items-center p-8 border-2 border-slate-100 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50 transition group">
                   <QrCode className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 mb-4" />
                   <span className="font-bold text-slate-700">QR Scan</span>
                 </button>
                 <button onClick={() => { setMethod('id'); setStep('photo'); setCameraActive(true); handleSimulateScan(); }}
                   className="flex flex-col items-center p-8 border-2 border-slate-100 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50 transition group">
                   <CreditCard className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 mb-4" />
                   <span className="font-bold text-slate-700">ID Scan</span>
                 </button>
                 <button onClick={() => { setMethod('manual'); setStep('details'); }}
                   className="flex flex-col items-center p-8 border-2 border-slate-100 rounded-3xl hover:border-indigo-600 hover:bg-indigo-50 transition group">
                   <PenTool className="w-10 h-10 text-slate-400 group-hover:text-indigo-600 mb-4" />
                   <span className="font-bold text-slate-700">Manual</span>
                 </button>
               </div>
            </div>
          )}

          {step === 'details' && (
            <div className="w-full max-w-md animate-fade-in text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-8">Your Profile</h2>
              <form onSubmit={handleSubmitDetails} className="space-y-5">
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-bold" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-bold" 
                   value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Location (State, Country)" />
                <input required type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-bold" 
                   value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} placeholder="Host Name" />
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 font-bold"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as VisitorType})}>
                  {Object.values(VisitorType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition transform active:scale-95">
                  Confirm & Take Photo
                </button>
              </form>
            </div>
          )}

          {step === 'photo' && (
            <div className="space-y-6 animate-fade-in w-full max-w-md">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                {method === 'qr' ? 'Scanning QR...' : method === 'id' ? 'Verifying ID...' : 'Identity Capture'}
              </h2>
              <div className="relative w-full aspect-square bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                {cameraActive && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />}
                <div className="absolute inset-0 border-[20px] border-slate-900/10 pointer-events-none"></div>
                {(method === 'qr' || method === 'id') && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-1/2 border-2 border-emerald-400 rounded-3xl animate-pulse flex items-center justify-center">
                       <ScanLine className="w-12 h-12 text-emerald-400" />
                       <div className="absolute inset-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan-y"></div>
                    </div>
                  </div>
                )}
              </div>
              {method === 'manual' && (
                <button onClick={handlePhotoTaken} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition flex items-center justify-center gap-3">
                  <Camera className="w-6 h-6" />
                  Capture & Submit
                </button>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-8 animate-fade-in w-full flex flex-col items-center">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-black text-slate-900">Success!</h2>
                  <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Entry Pass Generated</p>
                </div>
              </div>

              {/* Real Pass Preview */}
              <div className="relative w-72 bg-white rounded-[2.5rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden flex flex-col items-center pb-8 animate-float mb-4">
                <div className="absolute top-4 w-12 h-3 bg-slate-100 rounded-full border border-slate-200"></div>
                <div className={`w-full h-24 ${getTypeColor(formData.type)} flex flex-col items-center justify-center text-white px-4 pt-4`}>
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-90 mb-1">B4 MNGT PASS</span>
                    <h3 className="text-2xl font-black uppercase tracking-widest">{formData.type}</h3>
                </div>
                <div className="mt-[-40px] relative">
                  <div className="w-32 h-32 rounded-3xl border-8 border-white shadow-xl overflow-hidden bg-slate-100">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Visitor')}&background=random&size=256`} alt={formData.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="mt-6 text-center px-6">
                   <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{formData.name || 'Alex Rivera'}</h4>
                   <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{formData.location || 'New York, NY'}</p>
                </div>
                <div className="mt-6 w-full px-6 flex items-center justify-between border-t border-slate-50 pt-4">
                   <div className="text-left"><span className="text-[10px] font-bold text-slate-700">{new Date().toLocaleDateString()}</span></div>
                   <QrIcon className="w-10 h-10 text-slate-800" />
                   <div className="text-right text-indigo-600 font-bold text-[10px] uppercase tracking-widest">{formData.host || 'Front Desk'}</div>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-4">
                 <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3 text-indigo-700 text-sm font-bold">
                   <Printer className="w-5 h-5 animate-pulse" />
                   Printing entry pass... please collect from dispenser.
                 </div>
                 <button onClick={resetToHome} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition">
                   Done / Back to Welcome
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes scan-y {
           0% { transform: translateY(0); }
           100% { transform: translateY(160px); }
        }
        .animate-scan-y { animation: scan-y 2s infinite linear; }
        .animate-fade-in-up { animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } }
      `}</style>
    </div>
  );
};