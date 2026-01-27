
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
  const [showSuccessTick, setShowSuccessTick] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Admin & Security States
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminAuth, setAdminAuth] = useState({ user: '', pass: '', loggedIn: false });
  const [stats, setStats] = useState({ totalCalculations: 0 });
  const currentRequiredPasskey = '2007';

  // Modal states for AI
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [activeCluster, setActiveCluster] = useState<any>(null);
  const [generatedCourses, setGeneratedCourses] = useState<string>('');
  const [isGeneratingCourses, setIsGeneratingCourses] = useState(false);

  useEffect(() => {
    const savedStats = localStorage.getItem('app_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
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
    setIsProcessing(true);

    setTimeout(() => {
      const isPasskeyMatch = inputCode === currentRequiredPasskey;

      if (isPasskeyMatch) {
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
        setAuthError("❌ ACCESS DENIED: Invalid passkey.");
        setTimeout(() => setAuthError(null), 3000);
      }
    }, 800);
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

    // Always show courses - removed eligibility check
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
    
    try {
      const apiKey = process.env.API_KEY || (import.meta as any)?.env?.VITE_GOOGLE_API_KEY;

      if (!apiKey) {
        const fallback = buildFallbackFromDataset(cluster.id, cluster.name, selectedGrades);
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
      console.error('Error in viewCourses:', e);
      // On any error, fall back to local dataset with real formula
      try {
        const fallback = buildFallbackFromDataset(cluster.id, cluster.name, selectedGrades);
        setGeneratedCourses(fallback);
      } catch (ex) {
        console.error('Error in fallback:', ex);
        setGeneratedCourses(`📖 Local Advisor Fallback\n\nApologies, the advisor is temporarily unavailable. Please try again in a moment or contact your administrator.\n\nError details: ${ex instanceof Error ? ex.message : 'Unknown error'}`);
      }
    } finally {
      setIsGeneratingCourses(false);
    }
  };

  if (showSuccessTick) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900">
        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
          <i className="fas fa-check text-white text-4xl"></i>
        </div>
        <h2 className="mt-8 text-2xl font-black text-slate-800 dark:text-white uppercase tracking-widest text-center">Authenticated</h2>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-slate-800'} min-h-screen pb-12 transition-colors flex flex-col relative`}
    style={{
      backgroundImage: !isDarkMode ? `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(99,102,241,0.08)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)'/%3E%3C/svg%3E")` : undefined,
      backgroundAttachment: 'fixed'
    }}>
      {/* Professional blue decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500/20 dark:bg-blue-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-indigo-400/20 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-purple-500/20 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>
      {/* Professional gradient banner */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 shadow-2xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-white text-blue-600 p-3 rounded-xl shadow-lg animate-pulse"><i className="fas fa-graduation-cap font-bold text-2xl"></i></div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">KUCCPS<span className="text-yellow-300">PRO</span></h1>
            <p className="text-[8px] text-blue-100 uppercase tracking-widest">Official 2025 Calculator</p>
          </div>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white/30 active:scale-90">
          <i className={`fas ${isDarkMode ? 'fa-sun text-yellow-300' : 'fa-moon text-white'} text-lg`}></i>
        </button>
      </nav>

            <main className="max-w-4xl mx-auto w-full px-4 mt-8 flex-1 relative z-10">
        {step === AppStep.Input && (
          <div className="relative min-h-screen rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700 space-y-8 overflow-hidden" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"1200\" height=\"800\" viewBox=\"0 0 1200 800\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cdefs%3E%3ClinearGradient id=\"grad1\" x1=\"0%25\" y1=\"0%25\" x2=\"100%25\" y2=\"100%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:%23dc2626;stop-opacity:0.9\" /%3E%3Cstop offset=\"50%25\" style=\"stop-color:%23f87171;stop-opacity:0.7\" /%3E%3Cstop offset=\"100%25\" style=\"stop-color:%23fca5a5;stop-opacity:0.5\" /%3E%3C/linearGradient%3E%3ClinearGradient id=\"grad2\" x1=\"100%25\" y1=\"0%25\" x2=\"0%25\" y2=\"100%25\"%3E%3Cstop offset=\"0%25\" style=\"stop-color:%23ffffff;stop-opacity:0.8\" /%3E%3Cstop offset=\"50%25\" style=\"stop-color:%23f5f5f5;stop-opacity:0.6\" /%3E%3Cstop offset=\"100%25\" style=\"stop-color:%23fef2f2;stop-opacity:0.4\" /%3E%3C/linearGradient%3E%3Cfilter id=\"blur\"%3E%3CfeGaussianBlur in=\"SourceGraphic\" stdDeviation=\"3\" /%3E%3C/filter%3E%3C/defs%3E%3Crect width=\"1200\" height=\"800\" fill=\"url(%23grad1)\" /%3E%3Crect width=\"1200\" height=\"800\" fill=\"url(%23grad2)\" opacity=\"0.6\" /%3E%3Ccircle cx=\"100\" cy=\"100\" r=\"200\" fill=\"%23fecaca\" opacity=\"0.3\" filter=\"url(%23blur)\" /%3E%3Ccircle cx=\"1100\" cy=\"700\" r=\"250\" fill=\"%23dc2626\" opacity=\"0.15\" filter=\"url(%23blur)\" /%3E%3Ccircle cx=\"600\" cy=\"400\" r=\"300\" fill=\"%23ffffff\" opacity=\"0.1\" filter=\"url(%23blur)\" /%3E%3Cpath d=\"M0,0 Q300,100 600,50 T1200,100 L1200,0 Z\" fill=\"%23ffffff\" opacity=\"0.2\" /%3E%3Cpath d=\"M0,800 Q300,700 600,750 T1200,700 L1200,800 Z\" fill=\"%23dc2626\" opacity=\"0.15\" /%3E%3C/svg%3E")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}>
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-transparent to-slate-900/15 rounded-[2.5rem] pointer-events-none"></div>
            <div className="absolute inset-0 backdrop-blur-sm rounded-[2.5rem] pointer-events-none"></div>
            <div className="relative z-20 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-[2.5rem] p-8 shadow-2xl border border-blue-200/50 dark:border-blue-700/30 space-y-8">
              <h2 className="text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">📝 Grade Entry Portal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {SUBJECTS.map(subj => (
                  <div key={subj.id}>
                    <label className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-300 block mb-2">{subj.name}</label>
                    <select
                      className="w-full bg-white dark:bg-slate-800 border-2 border-blue-200 focus:border-blue-500 dark:border-slate-600 dark:focus:border-blue-400 rounded-xl p-3 font-bold transition-all outline-none text-slate-900 dark:text-white shadow-sm hover:shadow-md"
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
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 uppercase tracking-widest active:scale-[0.98] shadow-blue-500/30"
              >
                Next: Verify Access
              </button>
            </div>
          </div>
        )}

        {step === AppStep.Payment && (
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800/90 dark:to-slate-900/90 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-blue-200 dark:border-blue-700/50 space-y-10 animate-in slide-in-from-bottom-4 text-center overflow-hidden">
            <div className="space-y-4">
              <h2 className="text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">🔐 Access Verification</h2>
              
              {authError ? (
                <div className="bg-orange-100 dark:bg-orange-900/40 p-6 rounded-2xl border-2 border-orange-500 animate-bounce shadow-lg">
                    <p className="font-black text-orange-700 dark:text-orange-300 text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        {authError}
                    </p>
                </div>
              ) : (
                <div className="bg-blue-50 dark:bg-indigo-950/30 p-6 rounded-2xl border-2 border-dashed border-blue-300 dark:border-indigo-600">
                    <p className="font-bold text-blue-700 dark:text-indigo-300 text-sm">Please enter the Passkey provided by the administrator.</p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-300 tracking-widest block ml-1">Current Passkey</label>
                <input
                  type="text"
                  placeholder="Enter Passkey"
                  className={`w-full bg-white dark:bg-slate-800 rounded-2xl p-6 font-black outline-none border-2 transition-all uppercase tracking-[0.5em] text-slate-800 dark:text-white text-center text-4xl shadow-inner ${authError ? 'border-red-400 ring-4 ring-red-500/20' : 'border-blue-300 dark:border-blue-600 focus:border-blue-500 dark:focus:border-blue-400'}`}
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
                className={`w-full text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest text-lg active:scale-[0.98] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 shadow-blue-500/30`}
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
            <div className="bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-10 shadow-2xl border-2 border-blue-500 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                <div className="inline-block bg-blue-500/10 px-4 py-1 rounded-full mb-3">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-300 uppercase tracking-widest">Mean Grade</p>
                </div>
                <h2 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tighter">{calculationResults.meanGrade}</h2>
              </div>
              <div className="h-20 w-px bg-gradient-to-b from-transparent via-blue-300 to-transparent hidden md:block"></div>
              <div className="flex-1 text-right">
                <div className="inline-block bg-indigo-500/10 px-4 py-1 rounded-full mb-3">
                  <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">Total Points</p>
                </div>
                <h2 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tracking-tighter">{calculationResults.totalPoints}</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CLUSTERS.map(cluster => (
                <div key={cluster.id} className="bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl border-2 border-blue-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl shadow-lg flex flex-col justify-between items-stretch transition-all duration-300 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                  
                  <div className="mb-6 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Cluster {cluster.id}</span>
                      </div>
                      <div className="px-3 py-1 bg-blue-500/10 rounded-full">
                        <span className="text-[8px] font-black text-blue-600 dark:text-blue-400 uppercase">2025</span>
                      </div>
                    </div>
                    <h3 className="font-black text-xs uppercase text-slate-700 dark:text-slate-200 tracking-wide leading-tight mb-4">{cluster.name}</h3>
                    
                    <div className="flex items-baseline gap-3">
                        <p className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 tracking-tighter leading-none">
                            {calculationResults.clusterWeights[cluster.id].toFixed(2)}
                        </p>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase">Points</span>
                          <span className="text-[8px] font-bold text-slate-400">/ 48</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 relative z-10">
                    <button 
                        onClick={() => viewCourses(cluster)}
                        className="w-full text-white py-4 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-xl"
                    >
                        <i className="fas fa-sparkles text-sm"></i>
                        <span>Explore Courses</span>
                        <i className="fas fa-arrow-right text-sm"></i>
                    </button>
                  </div>
                  
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500"></div>
                </div>
              ))}
            </div>

            {/* CAREER GUIDANCE AND PRO TIPS SECTION */}
            <div className="mt-20 space-y-10">
              <div className="flex flex-col items-center text-center space-y-2">
                <h3 className="text-xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-[0.4em]">Student Resource Center</h3>
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Pro Tips & Career Guidance</h2>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
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

              <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <div className="space-y-4 text-white">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
                    <span className="text-xs font-black uppercase tracking-widest">2025 Placement Cycle</span>
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tight">Try Different Scenarios</h3>
                  <p className="text-blue-100 text-sm max-w-md font-medium">
                    Experiment with different subject combinations to see how your cluster weights change and discover new opportunities.
                  </p>
                </div>
                <button 
                  onClick={resetForNew} 
                  className="bg-white text-blue-600 px-12 py-6 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-yellow-300 hover:text-blue-900 transition-all shadow-2xl active:scale-95 whitespace-nowrap flex items-center gap-3"
                >
                  <i className="fas fa-redo text-lg"></i>
                  <span>New Calculation</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-8 text-center border-t border-blue-200 dark:border-slate-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="space-y-2">
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 mx-auto"
          >
            <i className="fas fa-shield-alt"></i>
            <span>System Administration</span>
          </button>
          <p className="text-[10px] text-slate-400 font-bold">Official KUCCPS 2025 Algorithm • Powered by KUCCPSPRO</p>
        </div>
      </footer>

      {/* Admin Portal Modal */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[2rem] p-8 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-8 border-b dark:border-slate-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100/20 text-emerald-500 rounded-xl flex items-center justify-center"><i className="fas fa-user-shield"></i></div>
                <h2 className="text-xl font-black uppercase tracking-widest text-slate-800 dark:text-white">Admin Control</h2>
              </div>
              <button onClick={() => setIsAdminOpen(false)} className="w-10 h-10 rounded-full hover:bg-slate-700 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors">
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
                    className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 text-slate-900 dark:text-white"
                    value={adminAuth.user}
                    onChange={e => setAdminAuth(prev => ({...prev, user: e.target.value}))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                  <input 
                    type="password" 
                    placeholder="••••" 
                    className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-xl font-bold outline-none border-2 border-transparent focus:border-emerald-500 text-slate-900 dark:text-white"
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
                    onClick={() => alert(`✅ Passkey is constant: 2007\n\nThis passkey never expires and can be used multiple times.`)}
                    className="w-full bg-green-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-info-circle"></i> View Passkey Info
                  </button>
                  <p className="text-[9px] font-bold text-slate-400 mt-4 uppercase tracking-wider">Hand this code to the user for one-time access</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl text-center border border-slate-100 dark:border-slate-700">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Calculations</p>
                  <p className="text-4xl font-black text-slate-800 dark:text-white">{stats.totalCalculations || 0}</p>
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
