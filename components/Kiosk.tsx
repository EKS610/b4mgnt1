import React, { useState, useRef, useEffect } from 'react';
import { VisitorType } from '../types';
import { Camera, QrCode, PenTool, CheckCircle, ArrowRight, X, ScanLine, CreditCard, Clock } from 'lucide-react';

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
    // Simulate a successful scan after 2 seconds
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
      setTimeout(() => {
        onCheckIn(
          method === 'id' ? "Jessica Jones" : "Alex Rivera", 
          method === 'id' ? VisitorType.GUEST : VisitorType.CONTRACTOR,
          method === 'id' ? "ID-8829103" : undefined
        );
      }, 2000);
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
    setTimeout(() => {
      onCheckIn(formData.name, formData.type);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-4">
      {/* Kiosk Frame */}
      <div className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col relative min-h-[600px]">
        
        {/* Top Bar */}
        <div className="h-16 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-8">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <button onClick={onExit} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Exit Kiosk Mode</button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          
          {step === 'welcome' && (
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-slate-800">Welcome to B4 MNGT</h1>
                <p className="text-slate-500 text-lg">Please check in to notify your host.</p>
              </div>
              <button 
                onClick={() => setStep('method')}
                className="px-8 py-4 bg-indigo-600 text-white text-xl font-semibold rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 transform hover:-translate-y-1"
              >
                Check In Now
              </button>
              <div className="mt-8 pt-8 border-t border-slate-100 w-full">
                 <p className="text-xs text-slate-400">Powered by B4 MNGT</p>
              </div>
            </div>
          )}

          {step === 'method' && (
            <div className="space-y-8 w-full max-w-lg animate-fade-in">
               <div className="flex items-center justify-between w-full mb-4">
                 <button onClick={() => setStep('welcome')} className="text-slate-400 hover:text-slate-600"><ArrowRight className="rotate-180" /></button>
                 <h2 className="text-2xl font-bold text-slate-800">Select Check-In Method</h2>
                 <div className="w-6"></div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <button 
                   onClick={() => { setMethod('qr'); setStep('photo'); setCameraActive(true); handleSimulateScan(); }}
                   className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition group"
                 >
                   <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                     <QrCode className="w-6 h-6 text-slate-600 group-hover:text-indigo-700" />
                   </div>
                   <span className="font-semibold text-slate-700 text-sm">Scan QR</span>
                 </button>

                 <button 
                   onClick={() => { setMethod('id'); setStep('photo'); setCameraActive(true); handleSimulateScan(); }}
                   className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition group"
                 >
                   <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                     <CreditCard className="w-6 h-6 text-slate-600 group-hover:text-indigo-700" />
                   </div>
                   <span className="font-semibold text-slate-700 text-sm">Scan ID Card</span>
                 </button>

                 <button 
                   onClick={() => { setMethod('manual'); setStep('details'); }}
                   className="flex flex-col items-center justify-center p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition group"
                 >
                   <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                     <PenTool className="w-6 h-6 text-slate-600 group-hover:text-indigo-700" />
                   </div>
                   <span className="font-semibold text-slate-700 text-sm">Manual Entry</span>
                 </button>
               </div>
            </div>
          )}

          {step === 'details' && (
            <div className="w-full max-w-md animate-fade-in text-left">
              <div className="flex items-center justify-between w-full mb-6">
                 <button onClick={() => setStep('method')} className="text-slate-400 hover:text-slate-600"><ArrowRight className="rotate-180" /></button>
                 <h2 className="text-xl font-bold text-slate-800">Your Details</h2>
                 <div className="w-6"></div>
              </div>

              <form onSubmit={handleSubmitDetails} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Country, State</label>
                  <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                     value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="USA, CA" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Host Name</label>
                  <input required type="text" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" 
                     value={formData.host} onChange={e => setFormData({...formData, host: e.target.value})} placeholder="Who are you visiting?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                  <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as VisitorType})}
                  >
                    {Object.values(VisitorType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <button type="submit" className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition">
                  Next Step
                </button>
              </form>
            </div>
          )}

          {step === 'photo' && (
            <div className="space-y-6 animate-fade-in w-full max-w-md">
              <h2 className="text-xl font-bold text-slate-800">
                {method === 'qr' ? 'Scanning QR...' : method === 'id' ? 'Scanning ID...' : 'Take a Photo'}
              </h2>
              <div className="relative w-full aspect-[4/3] bg-black rounded-2xl overflow-hidden shadow-inner">
                {cameraActive ? (
                   <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">Camera Off</div>
                )}
                
                {method === 'qr' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white/50 rounded-lg relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-400"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-400"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-400"></div>
                      <div className="w-full h-1 bg-emerald-400/50 absolute top-0 animate-scan"></div>
                    </div>
                  </div>
                )}
                
                {method === 'id' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-40 border-2 border-white/50 rounded-xl relative bg-white/10 backdrop-blur-sm">
                      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-white"></div>
                      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-white"></div>
                      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-white"></div>
                      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-white"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-white/80 text-sm font-medium animate-pulse">
                         <ScanLine className="w-8 h-8 mb-2" />
                      </div>
                      <div className="w-full h-0.5 bg-blue-400/80 absolute top-0 animate-scan-y"></div>
                    </div>
                  </div>
                )}
              </div>

              {method === 'manual' && (
                <button onClick={handlePhotoTaken} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center justify-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </button>
              )}
               {method === 'qr' && (
                <p className="text-sm text-slate-500">Position your QR code within the frame.</p>
              )}
               {method === 'id' && (
                <p className="text-sm text-slate-500">Position your ID card within the frame.</p>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Check-In Pending</h2>
              <p className="text-slate-600 text-lg">Thank you, {formData.name}.<br/>Please wait for security approval.</p>
              {formData.identificationId && (
                 <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100 mb-2">
                   ID Submitted: {formData.identificationId}
                 </div>
              )}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 inline-block text-left mt-4 opacity-50 grayscale">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-2">Badge Preview</p>
                 <div className="bg-white border border-slate-200 rounded-lg p-4 w-64 shadow-sm flex items-center space-x-3">
                    <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{formData.name}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-wide">{formData.type}</p>
                    </div>
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
        @keyframes scan-y {
           0% { top: 10%; }
           50% { top: 90%; }
           100% { top: 10%; }
        }
        .animate-scan {
          animation: scan 2s infinite linear;
        }
        .animate-scan-y {
          animation: scan-y 3s infinite linear;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
