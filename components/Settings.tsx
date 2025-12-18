import React, { useState } from 'react';
import { Save, Key, Code, Terminal, Server } from 'lucide-react';

export const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">System Configuration</h2>
        {saved && (
          <span className="text-emerald-600 font-medium text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Changes Saved Successfully
          </span>
        )}
      </div>

      {/* Integration Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 rounded-lg">
             <Key className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">API Access & Integrations</h3>
            <p className="text-slate-500 text-xs">Manage connections to external access control and identity systems.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Access Control API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="ac_live_892301..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              />
            </div>
            <p className="text-xs text-slate-400">Used to sync with Lenel, Paxton, or HID systems.</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Webhook URL</label>
            <div className="relative">
              <Server className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.company.com/webhooks/vms"
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm"
              />
            </div>
             <p className="text-xs text-slate-400">Trigger events on visitor check-in/out.</p>
          </div>
        </div>
      </div>

      {/* Code Injection */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-4">
           <div className="p-2 bg-emerald-50 rounded-lg">
             <Code className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Custom Kiosk Logic</h3>
             <p className="text-slate-500 text-xs">Inject custom JavaScript to modify the kiosk visitor flow.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Script Editor</label>
          <div className="relative">
            <div className="absolute top-0 left-0 bottom-0 w-8 bg-slate-50 border-r border-slate-200 rounded-l-lg flex flex-col items-center pt-3 gap-1 text-xs text-slate-400 select-none">
              <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
            </div>
            <textarea
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="// Example:
// window.onCheckIn = function(visitor) {
//   console.log('Custom logic for', visitor.name);
// }"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm h-48 resize-y leading-6"
              spellCheck={false}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
             <Terminal className="w-3 h-3" />
             Warning: Custom scripts run with full privileges on the kiosk device.
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg shadow-indigo-200"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>
      
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};