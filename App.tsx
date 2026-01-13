
import React, { useState, useMemo, useEffect } from 'react';
import { SUBJECTS, CLUSTERS, GRADE_POINTS } from './constants';
import { Grade, AppStep } from './types';
import { getPointsFromGrade, calculateMeanGradeData, calculateClusterWeight } from './utils';
import { GoogleGenAI } from "@google/genai";
import CLUSTER_COURSES from './clusterCourses';

const App: React.FC = () => {
  const [selectedGrades, setSelectedGrades] = useState<Record<string, Grade>>({});
  const [step, setStep] = useState<AppStep>(AppStep.Input);
  const [transactionCode, setTransactionCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Admin & Security States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminAuth, setAdminAuth] = useState({ user: '', pass: '', loggedIn: false });
  const [stats, setStats] = useState({ totalCalculations: 0 });
  const [currentRequiredPasskey, setCurrentRequiredPasskey] = useState('2025');

  // Modal states for AI
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeCluster, setActiveCluster] = useState<any>(null);
  const [generatedCourses, setGeneratedCourses] = useState<string>('');
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);

  useEffect(() => {
    const savedCodes = localStorage.getItem('burned_codes');
    const savedStats = localStorage.getItem('app_stats');
    const savedPasskey = localStorage.getItem('current_passkey');
    
    if (savedCodes) setUsedCodes(JSON.parse(savedCodes));
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedPasskey) setCurrentRequiredPasskey(savedPasskey || '2025');
  }, []);

  const updateStats = () => {
    const newStats = { totalCalculations: (stats.totalCalculations || 0) + 1 };
    setStats(newStats);
    localStorage.setItem('app_stats', JSON.stringify(newStats));
  };

  const handleGradeChange = (subjectId: string, grade: Grade) => {
    setSelectedGrades(prev => ({ ...prev, [subjectId]: grade }));
  };

  const calculationResults = useMemo(() => {
    const { meanGrade, totalPoints } = calculateMeanGradeData(selectedGrades);
    const clusterWeights: Record<number, number> = {};
    CLUSTERS.forEach(cluster => {
      let r = 0;
      let valid = true;
      for (const group of cluster.subjects) {
        const groupPoints = group
          .map(id => selectedGrades[id] ? getPointsFromGrade(selectedGrades[id]) : 0)
          .sort((a, b) => b - a)[0];
        if (groupPoints === 0) { valid = false; break; }
        r += groupPoints;
      }
      clusterWeights[cluster.id] = valid ? calculateClusterWeight(r, totalPoints) : 0;
    });
    return { meanGrade, totalPoints, clusterWeights };
  }, [selectedGrades]);

  const verifyAccess = () => {
    const inputCode = transactionCode.trim();
    setAuthError(null);
    
    if (usedCodes.includes(inputCode)) {
      setAuthError("PASSKEY ALREADY EXPIRED");
      setTransactionCode('');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const isPasskeyMatch = inputCode === currentRequiredPasskey;

      if (isPasskeyMatch) {
        const newBurned = [...usedCodes, inputCode];
        setUsedCodes(newBurned);
        localStorage.setItem('burned_codes', JSON.stringify(newBurned));
        
        const nextKey = (parseInt(currentRequiredPasskey) + 1).toString();
        setCurrentRequiredPasskey(nextKey);
        localStorage.setItem('current_passkey', nextKey);

        updateStats();
        setIsProcessing(false);
        setShowSuccessTick(true);
        setTimeout(() => {
          setShowSuccessTick(false);
          setStep(AppStep.Results);
        }, 1200);
      } else {
        setIsProcessing(false);
        setTransactionCode('');
        setAuthError("ACCESS DENIED: INVALID PASSKEY");
        setTimeout(() => setAuthError(null), 3000);
      }
    }, 800);
  };

  const generateNextAdminKey = () => {
    const current = parseInt(currentRequiredPasskey);
    const nextKey = (current + 1).toString();
    
    if (!usedCodes.includes(currentRequiredPasskey)) {
        const newBurned = [...usedCodes, currentRequiredPasskey];
        setUsedCodes(newBurned);
        localStorage.setItem('burned_codes', JSON.stringify(newBurned));
    }
    
    setCurrentRequiredPasskey(nextKey);
    localStorage.setItem('current_passkey', nextKey);
    alert(`Passkey issued. New active key is now ${nextKey}`);
  };

  const resetForNew = () => {
    setSelectedGrades({});
    setTransactionCode('');
    setAuthError(null);
    setStep(AppStep.Input);
  };

  const handleAdminLogin = () => {
    if (adminAuth.user === 'ADMIN' && adminAuth.pass === '2025') {
      setAdminAuth(prev => ({ ...prev, loggedIn: true }));
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  const resetPasskeySequence = () => {
    if (confirm("Reset passkey sequence back to 2025? This will clear all history.")) {
      setUsedCodes([]);
      setCurrentRequiredPasskey('2025');
      localStorage.setItem('burned_codes', JSON.stringify([]));
      localStorage.setItem('current_passkey', '2025');
    }
  };

  const viewCourses = async (cluster: any) => {
    setActiveCluster(cluster);
    setShowCourseModal(true);
    setIsGeneratingCourses(true);
    setGeneratedCourses('');
    
    try {
      const apiKey = process.env.API_KEY || (import.meta as any)?.env?.VITE_GOOGLE_API_KEY;

      const buildFallbackFromDataset = (clusterId: number, clusterName: string, meanGrade: string | number, totalPoints: number, weight: number) => {
        const entries = CLUSTER_COURSES[clusterId] || [];
        const profileTier = totalPoints >= 60 ? 'Strong candidate for degree programmes' : totalPoints >= 40 ? 'May qualify for degree or higher diploma' : 'More suitable for diploma or certificate programmes';

        if (entries.length === 0) {
          // Generic fallback if dataset is missing for this cluster
          return `Local Advisor Suggestions (fallback) for ${clusterName}: No curated data available for this cluster.`;
        }

        const suggestions = entries.slice(0, 10).map((e, idx) => {
          const uniList = (e.universities || []).slice(0, 3).join(', ');
          const why = `${profileTier}. With ${totalPoints} points and a cluster weight of ${weight.toFixed(3)}, this student is a good match for ${e.course} at institutions such as ${uniList}.`;
          return `${idx + 1}. ${e.course}\n   - Universities: ${uniList}\n   - Why: ${why}`;
        });

        return `Local Advisor Suggestions (fallback) for ${clusterName}:\n\n${suggestions.join('\n\n')}`;
      };

      if (!apiKey) {
        const weight = calculationResults.clusterWeights[cluster.id];
        const totalPoints = calculationResults.totalPoints;
        const meanGrade = calculationResults.meanGrade;
        const fallback = buildFallbackFromDataset(cluster.id, cluster.name, meanGrade, totalPoints, weight);
        setGeneratedCourses(fallback);
        setIsGeneratingCourses(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const weight = calculationResults.clusterWeights[cluster.id];
      const totalPoints = calculationResults.totalPoints;
      const meanGrade = calculationResults.meanGrade;

      const prompt = `Student Profile for KUCCPS 2025 Placement:
- PRIMARY FACTOR: Mean Grade of ${meanGrade}
- PRIMARY FACTOR: Total Points of ${totalPoints} / 84
- Target Cluster: "${cluster.name}" (Cluster Group ${cluster.id})
- Calculated Cluster Weight: ${weight.toFixed(3)}

Task: Act as an expert Kenyan University Placement Consultant. Based STRICTLY on the student's Mean Grade of ${meanGrade} and Total Points of ${totalPoints}, suggest 10 highly realistic degree or diploma courses within the "${cluster.name}" category.

Guidelines:
1. Ensure the courses listed are actually attainable for someone with a Mean Grade of ${meanGrade}. (e.g., if grade is below C+, focus on Diploma courses).
2. For each suggestion, provide:
   - Course Name
   - 2-3 specific Kenyan Universities/Colleges offering it.
   - A brief justification explaining how their ${totalPoints} total points and ${weight.toFixed(3)} cluster weight makes them a strong candidate for this specific placement.
3. Be professional, accurate to current KUCCPS trends, and encouraging.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      
      setGeneratedCourses(response.text || 'Unable to generate suggestions at this time.');
    } catch (e) {
      console.error(e);
      // On any error, fall back to a local (real) advisor suggestions list so user always gets actionable guidance
      try {
        const weight = calculationResults.clusterWeights[cluster.id];
        const totalPoints = calculationResults.totalPoints;
        const meanGrade = calculationResults.meanGrade;

        setGeneratedCourses(buildFallbackFromDataset(cluster.id, cluster.name, meanGrade, totalPoints, weight));
      } catch (ex) {
        setGeneratedCourses('Error connecting to the Advisor. Please try again.');
      }
    } finally {
      setIsGeneratingCourses(false);
    }
  };

  if (showSuccessTick) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
          <i className="fas fa-check text-white text-4xl"></i>
        </div>
        <h2 className="mt-8 text-2xl font-black text-slate-800 dark:text-white uppercase tracking-widest text-center">Authenticated</h2>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-slate-900'} min-h-screen pb-12 transition-colors flex flex-col`}>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 p-4 shadow-sm flex justify-between items-center border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white p-2 rounded-lg"><i className="fas fa-bolt"></i></div>
          <h1 className="text-xl font-black tracking-tighter uppercase">KUCCPS<span className="text-green-600">PRO</span></h1>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center transition-transform active:scale-90">
          <i className={`fas ${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-slate-600'}`}></i>
        </button>
      </nav>

      <main className="max-w-4xl mx-auto w-full px-4 mt-8 flex-1">
        {step === AppStep.Input && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 space-y-8">
            <h2 className="text-3xl font-black uppercase tracking-tight">Grade Entry</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {SUBJECTS.map(subj => (
                <div key={subj.id}>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">{subj.name}</label>
                  <select
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-green-500 rounded-xl p-3 font-bold transition-all outline-none text-slate-900 dark:text-white"
                    value={selectedGrades[subj.id] || ''}
                    onChange={(e) => handleGradeChange(subj.id, e.target.value as Grade)}
                  >
                    <option value="">Select Grade</option>
                    {Object.keys(GRADE_POINTS).map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(AppStep.Payment)}
              disabled={Object.keys(selectedGrades).length < 7}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              Next: Verify Access
            </button>
          </div>
        )}

        {step === AppStep.Payment && (
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 space-y-10 animate-in slide-in-from-bottom-4 text-center overflow-hidden">
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tight">Access Verification</h2>
              
              {authError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border-2 border-red-500/50 animate-bounce">
                    <p className="font-black text-red-600 dark:text-red-400 text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        {authError}
                    </p>
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <p className="font-bold text-slate-500 dark:text-slate-400 text-sm">Please enter the Passkey provided by the administrator.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block ml-1">Current Passkey</label>
                <input
                  type="text"
                  placeholder="Enter Passkey"
                  className={`w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 font-black outline-none border-2 transition-all uppercase tracking-[0.5em] text-slate-900 dark:text-white text-center text-4xl shadow-inner ${authError ? 'border-red-500 ring-4 ring-red-500/10' : 'border-transparent focus:border-green-500'}`}
                  value={transactionCode}
                  onChange={e => {
                    setTransactionCode(e.target.value);
                    if(authError) setAuthError(null);
                  }}
                />
              </div>
              <button
                onClick={verifyAccess}
                disabled={isProcessing || !transactionCode}
                className={`w-full text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-lg active:scale-[0.98] ${authError ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
              >
                {isProcessing ? (
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                    </div>
                ) : (
                    authError ? 'Try Again' : 'Unlock Results'
                )}
              </button>
            </div>
          </div>
        )}

        {step === AppStep.Results && (
          <div className="space-y-8 animate-in zoom-in-95">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-xl border-t-[12px] border-green-600 flex flex-col md:flex-row justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mean Grade</p>
                <h2 className="text-8xl font-black text-green-600 tracking-tighter">{calculationResults.meanGrade}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Points</p>
                <h2 className="text-8xl font-black tracking-tighter">{calculationResults.totalPoints}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CLUSTERS.map(cluster => (
                <div key={cluster.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 hover:border-green-500 shadow-xl flex flex-col justify-between items-stretch transition-all group relative overflow-hidden">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <h3 className="font-black text-[10px] uppercase text-slate-400 tracking-widest">{cluster.name}</h3>
                    </div>
                    
                    <div className="flex items-end gap-2">
                        <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                            {calculationResults.clusterWeights[cluster.id].toFixed(3)}
                        </p>
                        <span className="text-[10px] font-black text-green-600 uppercase mb-2">Weight</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                        onClick={() => viewCourses(cluster)} 
                        className="w-full bg-slate-900 dark:bg-green-600 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-green-500 dark:hover:bg-green-500 shadow-md transition-all active:scale-[0.97] flex items-center justify-center gap-3 border-2 border-transparent hover:border-white/10"
                    >
                        <i className="fas fa-magic text-[0.8em]"></i>
                        View My Courses
                    </button>
                  </div>
                  
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                </div>
              ))}
            </div>

            {/* CAREER GUIDANCE AND PRO TIPS SECTION */}
            <div className="mt-20 space-y-10">
              <div className="flex flex-col items-center text-center space-y-2">
                <h3 className="text-xs font-black uppercase text-green-600 tracking-[0.4em]">Student Resource Center</h3>
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Pro Tips & Career Guidance</h2>
                <div className="h-1 w-20 bg-green-600 rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-compass"></i>
                  </div>
                  <h4 className="font-black text-sm uppercase mb-3 tracking-widest text-slate-800 dark:text-white">Strategic Selection</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    When applying, prioritize courses where your calculated weight is at least <strong>2-3 points above</strong> the previous year's cut-off. This creates a safety net for fluctuating trends.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-2xl flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <h4 className="font-black text-sm uppercase mb-3 tracking-widest text-slate-800 dark:text-white">Future Markets</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Clusters in <strong>IT, Data Science, and Green Energy</strong> are currently seeing the highest graduate employability rates in Kenya. Consider these for long-term career stability.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center mb-6 text-xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h4 className="font-black text-sm uppercase mb-3 tracking-widest text-slate-800 dark:text-white">University Choice</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Don't just chase the name. Research universities that have specialized labs or partnerships with industry leaders for your specific cluster group to gain a competitive edge.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 dark:bg-green-600/10 p-10 rounded-[3rem] border border-slate-800 dark:border-green-500/20 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">2025 Placement Cycle</span>
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Need to try a different scenario?</h3>
                  <p className="text-slate-400 text-sm max-w-md font-medium">
                    You can recalculate as many times as you need within this session. Experiment with different subject combinations to see how your cluster weights change.
                  </p>
                </div>
                <button 
                  onClick={resetForNew} 
                  className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-green-500 hover:text-white transition-all shadow-2xl active:scale-95 whitespace-nowrap"
                >
                  New Calculation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-12 text-center border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest hover:text-green-500 transition-colors"
        >
          System Administration • Official KUCCPS 2025 Algorithm
        </button>
      </footer>

      {/* Admin Portal Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 border-b dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center"><i className="fas fa-user-shield"></i></div>
                <h2 className="text-xl font-black uppercase tracking-widest text-slate-800 dark:text-white">Admin Control</h2>
              </div>
              <button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {!adminAuth.loggedIn ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Username</label>
                  <input 
                    type="text" 
                    placeholder="ADMIN" 
                    className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-red-500 text-slate-900 dark:text-white"
                    value={adminAuth.user}
                    onChange={e => setAdminAuth(prev => ({...prev, user: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••" 
                    className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-red-500 text-slate-900 dark:text-white"
                    value={adminAuth.pass}
                    onChange={e => setAdminAuth(prev => ({...prev, pass: e.target.value}))}
                  />
                </div>
                <button onClick={handleAdminLogin} className="w-full bg-slate-900 text-white font-black py-4 rounded-xl uppercase tracking-widest mt-4">Sign In</button>
              </div>
            ) : (
              <div className="space-y-6 overflow-y-auto pr-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-3xl border-2 border-green-500/30 text-center shadow-lg shadow-green-600/10">
                  <h3 className="text-xs font-black uppercase text-green-600 tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
                    <i className="fas fa-key"></i> Active Passkey
                  </h3>
                  <div className="relative group">
                    <p className="text-6xl font-black tracking-[0.2em] text-slate-800 dark:text-white drop-shadow-sm mb-6">
                      {currentRequiredPasskey}
                    </p>
                  </div>
                  <button 
                    onClick={generateNextAdminKey}
                    className="w-full bg-green-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-plus-circle"></i> Generate Next Passkey
                  </button>
                  <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-wider">Hand this code to the user for one-time access</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Calculations</p>
                    <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.totalCalculations || 0}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-100 dark:border-slate-700">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Archived Keys</p>
                    <p className="text-4xl font-black text-red-500">{usedCodes.length}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Used Key Archive</h3>
                    <span className="text-[8px] font-bold text-red-400 uppercase">Burned / Expired</span>
                  </div>
                  <div className="max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                    {usedCodes.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {usedCodes.map((code, idx) => (
                          <span key={idx} className="text-[10px] font-black font-mono bg-slate-200 dark:bg-slate-800 p-2 rounded text-center border dark:border-slate-700 text-slate-500 line-through decoration-red-500/50">
                            {code}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 text-center py-4 font-bold">No history yet.</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-6 border-t dark:border-slate-700">
                  <button 
                    onClick={resetPasskeySequence}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black py-4 rounded-xl uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all"
                  >
                    Reset Sequence to 2025
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            <div className="p-8 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-1 block">Admin Course Advisor</span>
                <h2 className="text-xl font-black uppercase tracking-tight text-slate-800 dark:text-white">{activeCluster?.name}</h2>
              </div>
              <button onClick={() => setShowCourseModal(false)} className="w-10 h-10 rounded-full hover:bg-white dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="p-8 overflow-y-auto whitespace-pre-wrap font-medium leading-relaxed text-slate-700 dark:text-slate-300 scrollbar-thin">
              {isGeneratingCourses ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="animate-pulse font-black text-xs uppercase tracking-widest text-slate-400 text-center">Finding qualifying courses...</p>
                </div>
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {generatedCourses}
                </div>
              )}
            </div>
            <div className="p-6 border-t dark:border-slate-700 flex justify-end">
              <button onClick={() => setShowCourseModal(false)} className="bg-green-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-600/20 transition-all hover:bg-green-700">Close Advisor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
