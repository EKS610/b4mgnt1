import React, { useState } from 'react';
import { generateVMSExplanation, askGeneralQuestion } from '../services/geminiService';
import { Sparkles, BookOpen, MessageCircle, ChevronRight, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Topic {
  id: string;
  title: string;
  description: string;
  prompt: string;
}

const TOPICS: Topic[] = [
  {
    id: 'pre-arrival',
    title: 'Pre-Arrival Setup',
    description: 'Pre-registration, automated notifications, and QR codes.',
    prompt: 'Describe the processes involved in pre-registration, including automated notifications to hosts and the significance of QR codes for check-ins in a VMS context.'
  },
  {
    id: 'check-in',
    title: 'Effortless Check-In',
    description: 'Kiosks, QR scanning, and facial recognition.',
    prompt: 'Detail the various check-in methods offered by VMS, such as interactive screens, QR code scanning, and automatic sign-in features using smartphones or facial recognition.'
  },
  {
    id: 'security',
    title: 'Security & Docs',
    description: 'Digital logs, badging, and NDAs.',
    prompt: 'Outline the importance of digital visitor logs, badge printing, and compliance features like digital signing of NDAs or safety waivers.'
  },
  {
    id: 'monitoring',
    title: 'Real-Time Monitoring',
    description: 'Tracking movements and host alerts.',
    prompt: 'Discuss how VMS facilitates host alerts and tracking of visitor movements within the premises for enhanced security.'
  },
  {
    id: 'management',
    title: 'Streamlined Management',
    description: 'Scheduling and emergency protocols.',
    prompt: 'Explain the tools available for schedule management, emergency protocols, and how these contribute to overall operational efficiency.'
  },
  {
    id: 'analytics',
    title: 'Insights & Analytics',
    description: 'Data trends and resource allocation.',
    prompt: 'Provide insights into how visitor data is analyzed for trends, peak hours, and resource allocation, helping organizations improve planning and workflows.'
  },
  {
    id: 'categorization',
    title: 'Visitor Categories',
    description: 'Managing different visitor types.',
    prompt: 'Categorize visitors based on their purpose of visit, level of security clearance, and frequency of visits. Explain how contractors, employees, guests, and service providers influence the process.'
  }
];

export const AIGuide: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [customQuery, setCustomQuery] = useState('');

  const handleTopicClick = async (topic: Topic) => {
    setSelectedTopic(topic);
    setLoading(true);
    setContent('');
    
    const explanation = await generateVMSExplanation(topic.title, topic.prompt);
    setContent(explanation);
    setLoading(false);
  };

  const handleCustomQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setSelectedTopic({ id: 'custom', title: 'Custom Query', description: 'Your specific question', prompt: customQuery });
    setLoading(true);
    setContent('');
    
    const response = await askGeneralQuestion(customQuery);
    setContent(response);
    setLoading(false);
    setCustomQuery('');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6">
      {/* Sidebar / Topics List */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-300" />
            <h2 className="text-xl font-bold">AI Knowledge Base</h2>
          </div>
          <p className="text-indigo-100 text-sm mb-6">
            Explore how modern VMS systems enhance security and efficiency. 
            Select a topic to generate a detailed explanation using our AI engine.
          </p>
          
          <form onSubmit={handleCustomQuery} className="relative">
             <input 
               type="text" 
               placeholder="Ask anything about VMS..."
               className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-indigo-200 text-white focus:outline-none focus:bg-white/20 transition backdrop-blur-sm"
               value={customQuery}
               onChange={(e) => setCustomQuery(e.target.value)}
             />
             <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-200 hover:text-white rounded-md hover:bg-white/10 transition">
               <MessageCircle className="w-5 h-5" />
             </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {TOPICS.map(topic => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden
                ${selectedTopic?.id === topic.id 
                  ? 'bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                  : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm'}`}
            >
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h3 className={`font-semibold ${selectedTopic?.id === topic.id ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {topic.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{topic.description}</p>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${selectedTopic?.id === topic.id ? 'text-indigo-500 translate-x-0' : 'text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 overflow-y-auto relative min-h-[500px]">
        {!selectedTopic ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <BookOpen className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Select a Topic</h3>
            <p className="text-sm">
              Click on any category on the left to learn how VMS systems handle specific workflows, security, and analytics.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in max-w-3xl mx-auto">
            <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Sparkles className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedTopic.title}</h2>
                <p className="text-sm text-slate-500">AI Generated Explanation</p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                <p className="text-slate-500 animate-pulse">Consulting knowledge base...</p>
              </div>
            ) : (
              <div className="prose prose-slate prose-indigo max-w-none">
                 <ReactMarkdown>
                   {content}
                 </ReactMarkdown>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};