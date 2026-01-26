
import React, { useState, useMemo, useEffect } from 'react';
import { SUBJECTS, CLUSTERS, GRADE_POINTS } from './constants';
import { Grade, AppStep } from './types';
import { getPointsFromGrade, calculateMeanGradeData, calculateClusterWeight } from './utils';
import { GoogleGenAI } from "@google/genai";
import CLUSTER_COURSES from './clusterCourses';
import { calculateWeightedClusterPoints, getEligibilityMessage } from './formulaCalculator';
import KUCCPS_2024_CUTOFFS from './clusterCutoffs';

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
  const [currentRequiredPasskey, setCurrentRequiredPasskey] = useState('2007');
  const [newPasskeyInput, setNewPasskeyInput] = useState('');

  // Modal states for AI
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeCluster, setActiveCluster] = useState<any>(null);
  const [generatedCourses, setGeneratedCourses] = useState<string>('');
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);

  // Summary view state
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<Array<{clusterId: number; clusterName: string; courses: string[]; points: number}>>([]);

  useEffect(() => {
    const savedCodes = localStorage.getItem('burned_codes');
    const savedStats = localStorage.getItem('app_stats');
    const savedPasskey = localStorage.getItem('current_passkey');
    
    if (savedCodes) setUsedCodes(JSON.parse(savedCodes));
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedPasskey) setCurrentRequiredPasskey(savedPasskey);

    // Real-time sync across tabs/windows: Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'current_passkey' && e.newValue) {
        setCurrentRequiredPasskey(e.newValue);
      }
      if (e.key === 'burned_codes' && e.newValue) {
        setUsedCodes(JSON.parse(e.newValue));
      }
      if (e.key === 'app_stats' && e.newValue) {
        setStats(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
    const clusterEligibility: Record<number, { isEligible: boolean; missingSubjectNames: string[] }> = {};
    
    CLUSTERS.forEach(cluster => {
      // Convert selectedGrades to points format for formula calculator
      const gradesAsPoints: Record<string, number> = {};
      Object.entries(selectedGrades).forEach(([subjectId, grade]) => {
        if (grade) {
          gradesAsPoints[subjectId] = getPointsFromGrade(grade);
        }
      });
      
      // Use the official KUCCPS formula
      const calculation = calculateWeightedClusterPoints(gradesAsPoints, cluster.id);
      clusterWeights[cluster.id] = calculation.weightedClusterPoints;
      clusterEligibility[cluster.id] = {
        isEligible: calculation.isEligible,
        missingSubjectNames: calculation.missingSubjectNames
      };
    });
    return { meanGrade, totalPoints, clusterWeights, clusterEligibility };
  }, [selectedGrades]);

  const verifyAccess = () => {
    const inputCode = transactionCode.trim();
    setAuthError(null);
    
    // Constant passkey 2007 - always valid, no usage restrictions
    setIsProcessing(true);

    setTimeout(() => {
      const isPasskeyMatch = inputCode === '2007';

      if (isPasskeyMatch) {
        updateStats();
        setIsProcessing(false);
        setShowSuccessTick(true);
        setTimeout(() => {
          setShowSuccessTick(false);
          setStep(AppStep.Results);
        }, 1200);
        setTransactionCode('');
      } else {
        setIsProcessing(false);
        setTransactionCode('');
        setAuthError("❌ Wrong Input - Please try again.");
        setTimeout(() => setAuthError(null), 3000);
      }
    }, 800);
  };

  const generateNextAdminKey = () => {
    // Passkey is constant at 2007 - no changes needed
    alert(`✅ PASSKEY CONFIGURATION\n\n🔐 Current Passkey: 2007\n\nThis is the CONSTANT passkey for all users and devices.\n\nIt will NEVER change automatically.\n\nTo change it, use the "Change Passkey" input field below.`);
  };

  const resetForNew = () => {
    setSelectedGrades({});
    setTransactionCode('');
    setAuthError(null);
    setStep(AppStep.Input);
  };

  const handleAdminLogin = () => {
    if (adminAuth.user === 'ADMIN' && adminAuth.pass === '2007') {
      setAdminAuth(prev => ({ ...prev, loggedIn: true }));
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  const resetPasskeySequence = () => {
    if (confirm("🔐 Passkey is CONSTANT at 2007.\n\nIt will work for unlimited users and devices.\n\nNo reset needed - everyone uses: 2007")) {
      localStorage.setItem('current_passkey', '2007');
      setCurrentRequiredPasskey('2007');
      alert("✅ Confirmed: Passkey is 2007 (constant for all devices)");
    }
  };

  const changePasskey = () => {
    if (!newPasskeyInput.trim()) {
      alert("❌ Please enter a new passkey");
      return;
    }
    
    const newKey = newPasskeyInput.trim();
    localStorage.setItem('current_passkey', newKey);
    setCurrentRequiredPasskey(newKey);
    setNewPasskeyInput('');
    alert(`✅ Passkey changed successfully!\n\nNew Passkey: ${newKey}\n\nAll devices will sync automatically.\n\nOld passkey (2025) is now invalid.`);
  };

  // Build fallback from dataset with real KUCCPS formula and cutoffs
  const buildFallbackFromDataset = (clusterId: number, clusterName: string, selectedGradesRecord: Record<string, Grade>) => {
    // Calculate weighted cluster points using official KUCCPS formula
    const gradePoints = Object.entries(selectedGradesRecord).reduce((acc, [subjectId, grade]) => {
      acc[subjectId] = getPointsFromGrade(grade as Grade);
      return acc;
    }, {} as Record<string, number>);

    const clusterCalc = calculateWeightedClusterPoints(gradePoints, clusterId);
    const entries = CLUSTER_COURSES[clusterId] || [];
    const cutoffData = KUCCPS_2024_CUTOFFS[clusterId];

    if (!clusterCalc.isEligible) {
      return `${getEligibilityMessage(clusterCalc)}\n\n📊 Formula Breakdown:\n- Sum of cluster subjects (r): ${clusterCalc.sumR}/48\n- Your total points (t): ${clusterCalc.totalPoints}/84\n- Calculated points: ${clusterCalc.weightedClusterPoints}\n\nYou need at least 30 points to be considered for this cluster.`;
    }

    // Build university comparison
    let universityComparison = '';
    if (cutoffData) {
      universityComparison = `\n\n📈 UNIVERSITY CUTOFFS (KUCCPS 2024)\n\nYour Score: ${clusterCalc.weightedClusterPoints.toFixed(2)} points\n\n`;
      universityComparison += cutoffData.universities
        .map(uni => {
          const status = clusterCalc.weightedClusterPoints >= uni.cutoffPoints ? '✅' : '⚠️';
          return `${status} ${uni.university}: ${uni.cutoffPoints} points (${uni.programmeCount} programmes)`;
        })
        .join('\n');
      
      universityComparison += `\n\n📋 Cluster Average Cutoff: ${cutoffData.averageCutoff.toFixed(2)} points`;
      universityComparison += `\nMinimum Eligible: ${cutoffData.minRequiredForEntry.toFixed(2)} points`;
    }

    // Build courses list
    const suggestions = entries.slice(0, 15).map((e, idx) => {
      const uniList = (e.universities || []).slice(0, 3).join(', ');
      return `${idx + 1}. ${e.course}\n   📍 ${uniList}`;
    });

    return `${getEligibilityMessage(clusterCalc)}\n\n📚 RECOMMENDED COURSES (${entries.length} Available)\n\n${suggestions.join('\n\n')}${universityComparison}`;
  };

  const viewCourses = async (cluster: any) => {
    setActiveCluster(cluster);
    setShowCourseModal(true);
    setIsGeneratingCourses(true);
    setGeneratedCourses('');

    // Build subjects array from selectedGrades
    const subjects = Object.entries(selectedGrades).map(([code, grade]) => ({ code: code.toUpperCase(), grade }));

    try {
      const resp = await fetch((import.meta as any)?.env?.VITE_API_BASE_URL ? `${(import.meta as any).env.VITE_API_BASE_URL}/api/calculate` : 'http://localhost:4000/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subjects })
      });

      if (!resp.ok) throw new Error('API error');
      const data = await resp.json();

      // Build a simple HTML table for the modal
      const rows = data.clusters.map((c: any) => `| Cluster ${c.id} | ${c.name} | ${c.points.toFixed ? c.points.toFixed(3) : c.points} | ${c.missingCore && c.missingCore.length ? 'MISSING CORE: ' + c.missingCore.join(', ') : 'OK'} |`).join('\n');

      let table = `Cluster Points Summary:\n\n`;
      table += data.clusters.map((c: any, i: number) => `${c.id}. ${c.name} — ${c.points.toFixed ? c.points.toFixed(3) : c.points}${c.missingCore && c.missingCore.length ? ' (MISSING CORE: ' + c.missingCore.join(', ') + ')' : ''}`).join('\n');

      table += `\n\nRecommended summary (per cluster):\n`;
      table += data.recommendedCourses.map((r: any, idx: number) => `- Cluster ${r.clusterId}: ${r.clusterName} — ${r.points} pts — Eligible: ${r.eligible ? 'YES' : 'NO'} (Top: ${r.topUniversities.map((u:any)=>u.university).join(', ')})`).join('\n');

      setGeneratedCourses(table);
    } catch (e) {
      console.error('viewCourses API error:', e);
      // fallback to the existing AI / local dataset flow
      try {
        const apiKey = process.env.API_KEY || (import.meta as any)?.env?.VITE_GOOGLE_API_KEY;
        if (!apiKey) {
          const fallback = buildFallbackFromDataset(cluster.id, cluster.name, selectedGrades);
          setGeneratedCourses(fallback);
        } else {
          const ai = new GoogleGenAI({ apiKey });
          const weight = calculationResults.clusterWeights[cluster.id];
          const totalPoints = calculationResults.totalPoints;
          const meanGrade = calculationResults.meanGrade;

          const prompt = `Student Profile for KUCCPS 2025 Placement:\n- PRIMARY FACTOR: Mean Grade of ${meanGrade}\n- PRIMARY FACTOR: Total Points of ${totalPoints} / 84\n- Target Cluster: "${cluster.name}" (Cluster Group ${cluster.id})\n- Calculated Cluster Weight: ${weight.toFixed(3)}\n\nTask: Act as an expert Kenyan University Placement Consultant. Based STRICTLY on the student's Mean Grade of ${meanGrade} and Total Points of ${totalPoints}, suggest 10 highly realistic degree or diploma courses within the "${cluster.name}" category.`;

          const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
          setGeneratedCourses(response.text || 'Unable to generate suggestions at this time.');
        }
      } catch (ex) {
        console.error('Error in fallback:', ex);
        setGeneratedCourses(`📖 Local Advisor Fallback\n\nApologies, the advisor is temporarily unavailable. Please try again in a moment or contact your administrator.`);
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
    <div className={`${isDarkMode ? 'dark bg-slate-900 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 text-slate-900'} min-h-screen pb-12 transition-colors flex flex-col relative`}
    style={{
      backgroundImage: !isDarkMode ? `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(0,0,0,0.03)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")` : undefined,
      backgroundAttachment: 'fixed'
    }}>
      {/* Decorative elements for graduate forum theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 dark:bg-green-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 dark:bg-yellow-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Graduation forum banner */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-600 via-blue-600 to-green-600"></div>
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-800 p-4 shadow-sm flex justify-between items-center border-b border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="bg-green-600 text-white p-2 rounded-lg"><i className="fas fa-bolt"></i></div>
          <h1 className="text-xl font-black tracking-tighter uppercase">KUCCPS<span className="text-green-600">PRO</span></h1>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center transition-transform active:scale-90">
          <i className={`fas ${isDarkMode ? 'fa-sun text-yellow-400' : 'fa-moon text-slate-600'}`}></i>
        </button>
      </nav>

      <main className="max-w-4xl mx-auto w-full px-4 mt-8 flex-1 relative z-10">
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
                    <div className="flex items-center gap-1 mb-3">
                        <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Cluster {cluster.id}</span>
                    </div>
                    <div className="flex items-start gap-2 mb-6">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                        <h3 className="font-black text-xl leading-tight text-slate-900 dark:text-white tracking-tight">{cluster.name}</h3>
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
                        disabled={false}
                        className="w-full text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-md transition-all active:scale-[0.97] flex items-center justify-center gap-3 border-2 border-transparent bg-slate-900 dark:bg-green-600 hover:bg-green-500 dark:hover:bg-green-500 hover:border-white/10 cursor-pointer"
                        title={
                          !calculationResults.clusterEligibility[cluster.id]?.isEligible 
                            ? `View courses (Missing: ${calculationResults.clusterEligibility[cluster.id]?.missingSubjectNames.join(', ')})`
                            : 'View available courses for this cluster'
                        }
                    >
                        <i className="fas fa-book-open text-[0.8em]"></i>
                        View Courses
                    </button>
                    {!calculationResults.clusterEligibility[cluster.id]?.isEligible && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                        <p className="text-[9px] font-bold text-amber-700 dark:text-amber-300">
                          ⚠️ Missing subjects: {calculationResults.clusterEligibility[cluster.id]?.missingSubjectNames.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-green-500/5 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                </div>
              ))}
            </div>

            {/* GENERAL SUMMARY BUTTON */}
            <div className="flex justify-center mt-10">
              <button
                onClick={() => {
                  // Collect all eligible clusters and their courses
                  const eligible = CLUSTERS.filter(c => calculationResults.clusterEligibility[c.id]?.isEligible);
                  const summary = eligible.map(cluster => ({
                    clusterId: cluster.id,
                    clusterName: cluster.name,
                    courses: CLUSTER_COURSES[cluster.id] || [],
                    points: calculationResults.clusterWeights[cluster.id]
                  }));
                  setSummaryData(summary);
                  setShowSummary(true);
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-black uppercase tracking-wider rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-sm"
              >
                📋 View General Summary - All Eligible Courses
              </button>
            </div>

            {/* GENERAL SUMMARY MODAL */}
            {showSummary && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-[2rem] max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
                  <div className="sticky top-0 bg-green-600 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">📋 General Summary - Your Eligible Courses</h2>
                    <button
                      onClick={() => setShowSummary(false)}
                      className="text-white hover:bg-green-700 p-2 rounded-lg transition-all"
                    >
                      <i className="fas fa-times text-xl"></i>
                    </button>
                  </div>
                  
                  <div className="p-8 space-y-6">
                    {summaryData.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">No eligible clusters found. Please check your subject selections.</p>
                      </div>
                    ) : (
                      <>
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                            ✅ You are eligible for <span className="font-black">{summaryData.length}</span> cluster{summaryData.length !== 1 ? 's' : ''} with <span className="font-black">{summaryData.reduce((sum: number, s: any) => sum + (Array.isArray(s.courses) ? s.courses.length : 0), 0)}</span> total courses
                          </p>
                        </div>

                        {summaryData.map((cluster) => (
                          <div key={cluster.clusterId} className="border-l-4 border-green-500 pl-6 py-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                                  Cluster {cluster.clusterId}: {cluster.clusterName}
                                </h3>
                                <p className="text-sm font-bold text-green-600 dark:text-green-400">
                                  Points: {cluster.points.toFixed(3)} | Courses: {Array.isArray(cluster.courses) ? cluster.courses.length : 0}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {Array.isArray(cluster.courses) && cluster.courses.length > 0 ? (
                                cluster.courses.map((courseItem: any, idx: number) => (
                                  <div key={idx} className="bg-white dark:bg-slate-800 p-3 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                    <div>✓ {typeof courseItem === 'string' ? courseItem : courseItem.course}</div>
                                    {courseItem.universities && (
                                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                        {Array.isArray(courseItem.universities) ? courseItem.universities.slice(0, 2).join(', ') : ''}
                                        {courseItem.universities && courseItem.universities.length > 2 ? '...' : ''}
                                      </div>
                                    )}
                                    {courseItem.level && (
                                      <div className="text-xs font-bold text-green-600 dark:text-green-400 mt-1 uppercase">
                                        {courseItem.level}
                                      </div>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-full text-center py-4 text-slate-500">
                                  No courses available for this cluster
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mt-8">
                          <h4 className="font-black text-green-900 dark:text-green-100 mb-2">📌 Recommendation</h4>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            You have secured access to all eligible courses above. Select your top choice based on your career interests and the competitiveness of the programme. Universities will rank candidates based on cluster points and subject performance.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

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

                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-3xl border-2 border-purple-300 dark:border-purple-700/50 shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="text-xs font-black uppercase text-purple-600 dark:text-purple-300 tracking-[0.2em] mb-2 flex items-center gap-2">
                        <i className="fas fa-lock-open"></i> Security Configuration
                      </h3>
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 font-semibold">Manage access passkey for all users</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-600">
                      <i className="fas fa-sliders-h text-lg"></i>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest mb-3 block">Current Active Passkey</label>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-white dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 font-mono font-black text-lg text-purple-600 dark:text-purple-300 text-center tracking-widest">
                          {currentRequiredPasskey}
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 text-xl">
                          <i className="fas fa-check-circle"></i>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-10 blur-lg"></div>
                      <div className="relative bg-white dark:bg-slate-900 border-2 border-purple-300 dark:border-purple-700 rounded-2xl p-6">
                        <label className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 tracking-widest mb-3 block">
                          <i className="fas fa-exclamation-triangle text-orange-500 mr-2"></i> Change To New Passkey
                        </label>
                        <div className="flex gap-3">
                          <input 
                            type="text" 
                            placeholder="Enter new passkey (e.g., 5050)" 
                            className="flex-1 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-black outline-none border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500 text-slate-900 dark:text-white text-sm"
                            value={newPasskeyInput}
                            onChange={e => setNewPasskeyInput(e.target.value)}
                          />
                          <button 
                            onClick={changePasskey}
                            className="px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 text-[10px]"
                          >
                            <i className="fas fa-sync-alt"></i> Update
                          </button>
                        </div>
                        <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-3 font-semibold">All devices will sync automatically. Previous passkey will be invalidated.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6">
                  <button 
                    onClick={resetPasskeySequence}
                    className="w-full bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[10px] font-black py-4 rounded-2xl uppercase tracking-widest hover:from-slate-200 hover:to-slate-100 hover:border-slate-300 dark:hover:border-slate-500 transition-all flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-redo"></i> Reset to 2025
                  </button>
                  <button 
                    onClick={() => setIsAdminOpen(false)}
                    className="w-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[10px] font-black py-4 rounded-2xl uppercase tracking-widest transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-times"></i> Close Panel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KUCCPS Portal Course Modal */}
      {showCourseModal && activeCluster && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl">
            
            {/* Header */}
            <div className="p-8 border-b dark:border-slate-700 bg-gradient-to-r from-green-600 to-green-500 flex justify-between items-center sticky top-0">
              <div className="text-white">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-1 block opacity-90">Cluster Placement Portal</span>
                <h2 className="text-3xl font-black uppercase tracking-tight">Cluster {activeCluster.id}: {activeCluster.name}</h2>
              </div>
              <button onClick={() => setShowCourseModal(false)} className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors text-xl">
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {isGeneratingCourses ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                  <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="animate-pulse font-black text-xs uppercase tracking-widest text-slate-400 text-center">Loading cluster information...</p>
                </div>
              ) : (
                <div className="p-8 space-y-8">
                  
                  {/* Minimum Requirements Section */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-6">
                    <h3 className="font-black text-lg text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                      <i className="fas fa-clipboard-list"></i>
                      MINIMUM SUBJECT REQUIREMENTS
                    </h3>
                    <div className="space-y-3">
                      {activeCluster.subjects.map((group: string[], idx: number) => {
                        const subjectNames = group.map(id => {
                          const subj = SUBJECTS.find(s => s.id === id);
                          return subj ? subj.name : id.toUpperCase();
                        });
                        
                        return (
                          <div key={idx} className="bg-white dark:bg-slate-700/50 p-4 rounded-lg">
                            <p className="font-black text-slate-800 dark:text-white text-sm">
                              Group {idx + 1}:
                              <span className="font-semibold text-green-600 dark:text-green-400 ml-2">
                                {subjectNames.join(' OR ')}
                              </span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                      <p className="text-[12px] font-bold text-yellow-800 dark:text-yellow-200">
                        ⚠️ You must have at least ONE subject from EACH group to qualify for this cluster
                      </p>
                    </div>
                  </div>

                  {/* Ineligibility Warning (if applicable) */}
                  {!calculationResults.clusterEligibility[activeCluster.id]?.isEligible && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6">
                      <h3 className="font-black text-lg text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        ⚠️ YOU ARE NOT CURRENTLY ELIGIBLE FOR THIS CLUSTER
                      </h3>
                      <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                        Your current subject selections do not meet all requirements for this cluster.
                      </p>
                      <p className="text-sm font-bold text-red-800 dark:text-red-200">
                        Missing: {calculationResults.clusterEligibility[activeCluster.id]?.missingSubjectNames.join(', ')}
                      </p>
                      <p className="text-[12px] text-red-700 dark:text-red-300 mt-3">
                        You can still view the available courses, but you will need to have qualifying subjects in all groups to be eligible for placement in this cluster.
                      </p>
                    </div>
                  )}

                  {/* Your Performance Section */}
                  <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg p-6">
                    <h3 className="font-black text-lg text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                      <i className="fas fa-chart-line"></i>
                      YOUR PLACEMENT SCORE FOR THIS CLUSTER
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg text-center">
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Cluster Points</p>
                        <p className={`text-3xl font-black ${calculationResults.clusterWeights[activeCluster.id] === 0 ? 'text-gray-500' : 'text-green-600'}`}>
                          {String(calculationResults.clusterWeights[activeCluster.id]).padStart(2, '0')}
                        </p>
                      </div>
                      <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg text-center">
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Total KCSE Points</p>
                        <p className="text-3xl font-black text-blue-600">{calculationResults.totalPoints}</p>
                      </div>
                      <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg text-center">
                        <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase mb-2">Mean Grade</p>
                        <p className="text-3xl font-black text-purple-600">{calculationResults.meanGrade}</p>
                      </div>
                    </div>
                  </div>

                  {/* Available Courses Section */}
                  <div className="bg-slate-50 dark:bg-slate-700/30 border-l-4 border-slate-500 rounded-lg p-6">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                      <i className="fas fa-book-open"></i>
                      AVAILABLE COURSES IN THIS CLUSTER
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {CLUSTER_COURSES[activeCluster.id] && CLUSTER_COURSES[activeCluster.id].length > 0 ? (
                        CLUSTER_COURSES[activeCluster.id].map((course: any, idx: number) => (
                          <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-green-400 transition-colors">
                            <p className="font-black text-slate-900 dark:text-white text-sm mb-2">
                              ✓ {course.course}
                            </p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400">
                              <span className="font-bold">Level:</span> {course.level}
                            </p>
                            {course.universities && course.universities.length > 0 && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                <span className="font-bold">Universities:</span><br/>
                                {course.universities.slice(0, 3).join(', ')}
                                {course.universities.length > 3 ? '...' : ''}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="col-span-full text-center text-slate-500 py-8">No courses available for this cluster</p>
                      )}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 rounded-lg p-6">
                    <h3 className="font-black text-lg text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2">
                      <i className="fas fa-lightbulb"></i>
                      KUCCPS PLACEMENT ADVICE
                    </h3>
                    <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
                      Your cluster score of <strong>{calculationResults.clusterWeights[activeCluster.id].toFixed(3)} points</strong> makes you eligible for this cluster. 
                      Select your preferred course from the list above. Universities will rank candidates based on cluster points and subject performance. 
                      Courses marked as '<strong>degree</strong>' are bachelor programs, '<strong>diploma</strong>' are 2-3 year programs, 
                      and '<strong>certificate</strong>' are specialized short courses.
                    </p>
                  </div>

                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
              <button onClick={() => setShowCourseModal(false)} className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                Close
              </button>
              <button onClick={() => setShowCourseModal(false)} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-600/20 transition-all">
                <i className="fas fa-check mr-2"></i>
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
