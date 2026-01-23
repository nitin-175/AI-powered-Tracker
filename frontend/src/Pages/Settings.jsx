// src/pages/Settings.jsx - REFINED PREMIUM VERSION
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState({
    name: 'Your Name',
    email: 'your.email@example.com',
    phone: '',
    currentRole: 'Fresher Developer',
    targetRole: 'Software Engineer',
    location: 'Kanpur, India'
  });

  const [uploadedResume, setUploadedResume] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [goals, setGoals] = useState({ dailyTarget: 10, weeklyTarget: 50, currentWeek: 32 });
  const [preferences, setPreferences] = useState({
    defaultStatus: 'Applied',
    showDescriptions: false,
    notifications: false,
    autoRefresh: false
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedGoals = localStorage.getItem('appGoals');
    const savedPrefs = localStorage.getItem('preferences');
    
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs));
  }, []);

  const saveAllSettings = () => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('appGoals', JSON.stringify(goals));
    localStorage.setItem('preferences', JSON.stringify(preferences));
    alert('Changes saved successfully.');
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 2 * 1024 * 1024) {
      setUploadedResume({
        name: file.name,
        size: (file.size / 1024).toFixed(0) + ' KB',
        date: new Date().toLocaleDateString()
      });
    }
  };

  const progressPercentage = goals.weeklyTarget > 0 ? Math.min((goals.currentWeek / goals.weeklyTarget) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-blue-100 ml-70 mt-10">
      <main className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Navigation & Header */}
        <div className="mb-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <div className="flex items-center gap-3">
              <button 
                onClick={saveAllSettings}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-all shadow-sm active:scale-95"
              >
                Save all changes
              </button>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Configuration Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Profile Section */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Personal Information</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <InputGroup label="Full Name" value={profile.name} onChange={(v) => setProfile({...profile, name: v})} />
                <InputGroup label="Email Address" value={profile.email} onChange={(v) => setProfile({...profile, email: v})} />
                <InputGroup label="Primary Goal" value={profile.targetRole} onChange={(v) => setProfile({...profile, targetRole: v})} />
                <InputGroup label="Current City" value={profile.location} onChange={(v) => setProfile({...profile, location: v})} />
              </div>
            </section>

            {/* Resume Management */}
            <section className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Resume & CV</h2>
              </div>
              <div className="p-8">
                {!uploadedResume ? (
                  <label className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl py-12 px-6 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                    <input type="file" className="hidden" onChange={handleResumeUpload} />
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl mb-4 group-hover:scale-110 transition-transform">
                      ↑
                    </div>
                    <p className="font-medium text-slate-900">Click to upload document</p>
                    <p className="text-slate-400 text-xs mt-1">PDF or DOCX (Max 2MB)</p>
                  </label>
                ) : (
                  <div className="bg-slate-900 rounded-xl p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs uppercase">PDF</div>
                      <div>
                        <p className="text-white font-medium text-sm">{uploadedResume.name}</p>
                        <p className="text-slate-500 text-[11px] uppercase tracking-widest">{uploadedResume.size} • Verified</p>
                      </div>
                    </div>
                    <button onClick={() => setUploadedResume(null)} className="text-rose-400 hover:text-rose-300 text-xs font-medium px-4 py-2 border border-rose-400/20 rounded-lg transition-colors">Remove</button>
                  </div>
                )}
                <div className="mt-6">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Text Backup</label>
                  <textarea 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-mono text-slate-600 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none"
                    rows="4"
                    placeholder="Alternatively, paste your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Targets & Safety */}
          <div className="space-y-8">
            
            {/* Performance Widget */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-6">Weekly Progress</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-semibold text-slate-900">{progressPercentage.toFixed(0)}%</span>
                  <span className="text-slate-400 text-xs font-medium uppercase">of goal reached</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full mb-8 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }} />
                </div>
                
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Daily Target</span>
                    <input 
                      type="number" 
                      value={goals.dailyTarget} 
                      onChange={(e) => setGoals({...goals, dailyTarget: e.target.value})}
                      className="w-16 text-right font-semibold text-blue-600 bg-transparent focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Weekly Target</span>
                    <input 
                      type="number" 
                      value={goals.weeklyTarget} 
                      onChange={(e) => setGoals({...goals, weeklyTarget: e.target.value})}
                      className="w-16 text-right font-semibold text-blue-600 bg-transparent focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Utility Card */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Maintenance</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors flex justify-between items-center group">
                  Export Data Logs
                  <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button className="w-full text-left p-3 hover:bg-red-950/30 text-rose-400 rounded-lg text-sm font-medium transition-colors">
                  Purge Application History
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Refined Input
function InputGroup({ label, value, onChange, type = "text" }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}