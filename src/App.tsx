import React, { useState } from 'react';
import { 
  Dna, 
  Cpu, 
  CheckCircle2, 
  AlertOctagon, 
  Terminal, 
  GitCommit, 
  BookOpen, 
  FileText, 
  RefreshCw, 
  Play, 
  Pause, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  HardDrive,
  Clock,
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import datasets
import { 
  EX_SUMMARY, 
  PROBLEMS_DATA, 
  RISKS_DATA, 
  PATCH_FILES, 
  BUILD_INSTRUCTIONS, 
  VALIDATION_CHECKLIST, 
  REGRESSION_CHECKLIST, 
  PERFORMANCE_EXPECTATIONS, 
  COMMIT_MESSAGE, 
  RELEASE_NOTES 
} from './data/patchData';

// Import custom components
import { DiagnosticGraph } from './components/DiagnosticGraph';
import { DiffViewer } from './components/DiffViewer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'problems' | 'patches' | 'risks' | 'checklist' | 'git'>('hub');
  const [isOptimizedSim, setIsOptimizedSim] = useState(false);
  const [isSimRunning, setIsSimRunning] = useState(true);
  const [copiedAllPatch, setCopiedAllPatch] = useState(false);
  
  // Interactive Checklists
  const [validationList, setValidationList] = useState(VALIDATION_CHECKLIST);
  const [regressionList, setRegressionList] = useState(REGRESSION_CHECKLIST);

  // Generate complete monolithic patch
  const getFullMonolithicPatch = (): string => {
    return PATCH_FILES.map(file => {
      // Create conventional git header format
      const filepathNoSlash = file.filepath.startsWith('/') ? file.filepath.substring(1) : file.filepath;
      const headerA = file.status === 'added' ? '/dev/null' : `a/${filepathNoSlash}`;
      const headerB = `b/${filepathNoSlash}`;
      
      return `diff --git ${headerA} ${headerB}
index 8f24c3d..e794b1a 100644
${file.unifiedDiff}
`;
    }).join('\n');
  };

  const handleCopyMonolithicPatch = () => {
    navigator.clipboard.writeText(getFullMonolithicPatch());
    setCopiedAllPatch(true);
    setTimeout(() => setCopiedAllPatch(false), 2000);
  };

  const handleDownloadMonolithicPatch = () => {
    const text = getFullMonolithicPatch();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'infinity_project_sage_modernization.patch';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleValidation = (index: number) => {
    const updated = [...validationList];
    updated[index].checked = !updated[index].checked;
    setValidationList(updated);
  };

  const toggleRegression = (index: number) => {
    const updated = [...regressionList];
    updated[index].checked = !updated[index].checked;
    setRegressionList(updated);
  };

  return (
    <div id="app-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* HEADER SECTION */}
      <header className="border-b border-zinc-800 bg-zinc-900/40 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-950/40 border border-cyan-800/50 rounded-xl">
              <Dna className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                  EA CN&C Zero Hour
                </span>
                <span className="text-[10px] uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-semibold">
                  Patch 1.0.0 Stable
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white mt-1">SAGE Engine Modernization</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right font-mono">
              <div className="text-xs text-zinc-500">PROJECT STAGE:</div>
              <div className="text-xs text-zinc-300 font-semibold uppercase">Implementation & Verification</div>
            </div>
            <div className="h-8 w-px bg-zinc-850 hidden sm:block"></div>
            <button
              id="header-monolithic-patch-btn"
              onClick={handleCopyMonolithicPatch}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-cyan-950/20 transition-all flex items-center gap-2"
            >
              {copiedAllPatch ? <Check className="w-4 h-4" /> : <Code2 className="w-4 h-4" />}
              <span>{copiedAllPatch ? 'Copied Full Git Patch!' : 'Copy Unified Diff Patch'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* TABS STATS BAR */}
      <section className="bg-zinc-900/20 border-b border-zinc-900 px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 text-xs font-mono text-zinc-400 justify-between items-center">
          <div className="flex gap-4">
            <span>IDE Target: <strong className="text-zinc-200">VS2022 (v143)</strong></span>
            <span>Platform Target: <strong className="text-zinc-200">Win32 (x86)</strong></span>
            <span>Sim: <strong className="text-emerald-400">Strictly IEEE 754</strong></span>
          </div>
          <div>
            <span>Repository Link: </span>
            <a href="https://github.com/electronicarts/CnC_Generals_Zero_Hour" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 inline-flex">
              electronicarts/CnC_Generals_Zero_Hour <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <nav className="bg-zinc-900/60 border-b border-zinc-800 sticky top-[73px] z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-1 py-1.5 scrollbar-thin">
            <button
              id="tab-hub"
              onClick={() => setActiveTab('hub')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono shrink-0 transition-all flex items-center gap-2 ${
                activeTab === 'hub' ? 'bg-zinc-800 text-white shadow-inner font-semibold text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Executive Hub
            </button>
            <button
              id="tab-problems"
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono shrink-0 transition-all flex items-center gap-2 ${
                activeTab === 'problems' ? 'bg-zinc-800 text-white shadow-inner font-semibold text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
              Detected Problems
            </button>
            <button
              id="tab-patches"
              onClick={() => setActiveTab('patches')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono shrink-0 transition-all flex items-center gap-2 ${
                activeTab === 'patches' ? 'bg-zinc-800 text-white shadow-inner font-semibold text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Source Explorer & Diff
            </button>
            <button
              id="tab-risks"
              onClick={() => setActiveTab('risks')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono shrink-0 transition-all flex items-center gap-2 ${
                activeTab === 'risks' ? 'bg-zinc-800 text-white shadow-inner font-semibold text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Risk Analysis
            </button>
            <button
              id="tab-checklist"
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono shrink-0 transition-all flex items-center gap-2 ${
                activeTab === 'checklist' ? 'bg-zinc-800 text-white shadow-inner font-semibold text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Build & Verification
            </button>
            <button
              id="tab-git"
              onClick={() => setActiveTab('git')}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono shrink-0 transition-all flex items-center gap-2 ${
                activeTab === 'git' ? 'bg-zinc-800 text-white shadow-inner font-semibold text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <GitCommit className="w-4 h-4" />
              Git & Release Notes
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENT AREA */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Executive Summary & Mission Banner */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7 bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-widest font-mono">
                    <BookOpen className="w-4 h-4" />
                    Project Charter & Executive Scope
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Infinity Modernization Directive</h2>
                  <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
                    {EX_SUMMARY}
                  </p>
                  
                  <div className="border-t border-zinc-805 pt-4">
                    <h3 className="text-xs font-semibold text-zinc-300 uppercase font-mono mb-2">Engine Architecture Strategy</h3>
                    <div className="grid grid-cols-2 gap-4 text-xs text-zinc-400 font-mono">
                      <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850">
                        <strong className="text-zinc-200 block mb-1">Heap Decoupling</strong>
                        Transfers performance-critical updates to bin-aligned Virtual memory grids.
                      </div>
                      <div className="bg-zinc-950 p-2.5 rounded border border-zinc-850">
                        <strong className="text-zinc-200 block mb-1">Clock Affining</strong>
                        Enforces physical execution timing offsets to isolate task routines completely.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benchmark Simulation Controller */}
                <div className="md:col-span-5 bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest font-mono flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Live Sandboxing Engine
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsSimRunning(!isSimRunning)}
                        className={`p-1 px-2.5 rounded text-[10px] font-semibold font-mono flex items-center gap-1.5 transition-all ${
                          isSimRunning ? 'bg-zinc-800 text-zinc-300' : 'bg-cyan-900/50 text-cyan-400'
                        }`}
                      >
                        {isSimRunning ? (
                          <>
                            <Pause className="w-3 h-3" /> Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" /> Run
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white tracking-tight mt-1">Multiplayer Skirmish Profiler</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Simulate continuous runtime metrics inside a crowded 8-player network battle (approx. 400 combatants engaging simultaneous pathing and W3D render checks).
                  </p>

                  {/* Toggle Mode */}
                  <div className="grid grid-cols-2 bg-zinc-950 p-1.5 rounded-lg border border-zinc-800 text-xs font-mono">
                    <button
                      onClick={() => setIsOptimizedSim(false)}
                      className={`py-2 px-3 rounded-md transition-all ${
                        !isOptimizedSim ? 'bg-zinc-800 text-white font-bold border border-zinc-700/80' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Original Engine
                    </button>
                    <button
                      onClick={() => setIsOptimizedSim(true)}
                      className={`py-2 px-3 rounded-md transition-all ${
                        isOptimizedSim ? 'bg-emerald-950/40 text-emerald-400 font-bold border border-emerald-900/40' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Infinity Project (Fixed)
                    </button>
                  </div>

                  {/* Realtime Graph */}
                  <DiagnosticGraph isOptimized={isOptimizedSim} isRunning={isSimRunning} />
                </div>
              </div>

              {/* Highlights & Expectations */}
              <div className="bg-zinc-90 w-full p-6 bg-zinc-900/30 rounded-xl border border-zinc-800 space-y-3">
                <h3 className="text-xs font-mono uppercase bg-zinc-800/40 px-3 py-1 text-zinc-300 tracking-wider inline-block rounded-md border border-zinc-800">
                  Performance & Regression Matrix expectations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="prose prose-sm prose-invert max-w-none text-xs text-zinc-400 space-y-2 whitespace-pre-line leading-relaxed">
                    {PERFORMANCE_EXPECTATIONS}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-300 tracking-tight uppercase font-mono">Simulated Optimization Yields</h4>
                    <div className="space-y-3 font-mono text-xs">
                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-zinc-500">Heap Alloc Latency reduction:</span>
                          <span className="text-emerald-400">-74% Allocation Spike Bottleneck</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden border border-zinc-800">
                          <div className="bg-emerald-400 h-full w-[74%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-zinc-500">Direct3D 9 Redundancy mitigation:</span>
                          <span className="text-emerald-400">82% state bindings cached</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden border border-zinc-800">
                          <div className="bg-emerald-400 h-full w-[82%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-zinc-500">Pathfinder Grid Branch Miss reduction:</span>
                          <span className="text-emerald-400">-38% Cache misses</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded overflow-hidden border border-zinc-800">
                          <div className="bg-emerald-400 h-full w-[38%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engine Modernization Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 flex gap-4">
                  <HardDrive className="w-8 h-8 text-cyan-400 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-zinc-200">Continuous Arena Heap</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      SAGE components bypass global OS heap allocations entirely, minimizing high-fragmentation spikes in multiplayer lobbies.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 flex gap-4">
                  <Clock className="w-8 h-8 text-emerald-400 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-zinc-200">Monotonic Timing Core</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Thread affinity shields block dynamic processor clock oscillations (P/E cores), protecting long-running games from Out Of Sync desync events.
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 flex gap-4">
                  <Terminal className="w-8 h-8 text-cyan-400 shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-zinc-200">Automated CMake Build</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Replaces ancient VS6 projects with standard build targets supporting warnings-as-errors compliance inside Visual Studio 2022 setup.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'problems' && (
            <motion.div
              key="problems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Detected Engine Problems</h2>
                  <p className="text-xs text-zinc-400">
                    Comprehensive static analysis and runtime tracing reports of legacy Command & Conquer generals SAGE framework.
                  </p>
                </div>
              </div>

              <div className="opacity-100 space-y-4">
                {PROBLEMS_DATA.map((problem) => (
                  <div
                    key={problem.id}
                    className="bg-zinc-905 p-6 rounded-xl border border-zinc-800 space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono font-bold bg-zinc-800 px-2.5 py-1 text-zinc-300 border border-zinc-700/60 rounded">
                          {problem.id}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-100">{problem.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[10px] font-mono font-bold bg-zinc-900 px-2.5 py-0.5 text-cyan-400 border border-zinc-850 rounded">
                          {problem.subsystem.toUpperCase()}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded ${
                          problem.severity === 'Critical' ? 'bg-rose-950/50 text-rose-400 border border-rose-900/30' :
                          problem.severity === 'High' ? 'bg-amber-950/50 text-amber-500 border border-amber-900/30' :
                          'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}>
                          {problem.severity.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed">{problem.issue}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 font-mono text-[11px]">
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900">
                        <div className="text-zinc-500 text-[9px] uppercase tracking-wider mb-2">Legacy Engine Pipeline</div>
                        <pre className="text-rose-400 overflow-x-auto select-all">{problem.legacyCode}</pre>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-900">
                        <div className="text-emerald-500 text-[9px] uppercase tracking-wider mb-2">Modernized Implementation Fix</div>
                        <p className="text-zinc-300 leading-relaxed">{problem.modernFix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'patches' && (
            <motion.div
              key="patches"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-zinc-900/60 p-6 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-bold text-white tracking-tight">Source Tree & Unified Patch Manager</h2>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Explore, review, and extract individual modernized files or download the full comprehensive Git patch.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="monolithic-patch-copy-btn"
                      onClick={handleCopyMonolithicPatch}
                      className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/60 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all text-zinc-200"
                    >
                      {copiedAllPatch ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedAllPatch ? 'Copied Full Git Patch' : 'Copy Combined Patch'}</span>
                    </button>
                    <button
                      id="monolithic-patch-download-btn"
                      onClick={handleDownloadMonolithicPatch}
                      className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-all text-zinc-300"
                    >
                      <DownloadIcon className="w-4 h-4" />
                      <span>Download Patch file</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic code viewer */}
              <DiffViewer files={PATCH_FILES} />
            </motion.div>
          )}

          {activeTab === 'risks' && (
            <motion.div
              key="risks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                  Engineering Risk Mitigation Matrix
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Engine-level structural analysis of code modifications. Zero Hour's state determinism is sensitive to single-bit deviations. The matrix details parameters that prevent desynchronization during production runs.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono text-zinc-400">
                    <thead className="bg-zinc-900 text-zinc-300 border-b border-zinc-800">
                      <tr>
                        <th className="p-3">CATEGORY</th>
                        <th className="p-3">RISK ANALYSIS / DESCRIPTION</th>
                        <th className="p-3">IMPACT</th>
                        <th className="p-3">STRICT MITIGATION PLAN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 bg-zinc-950">
                      {RISKS_DATA.map((risk) => (
                        <tr key={risk.id} className="hover:bg-zinc-900/30">
                          <td className="p-3 font-semibold text-zinc-200">{risk.category}</td>
                          <td className="p-3 text-zinc-400 leading-relaxed">{risk.description}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              risk.impact === 'High' ? 'bg-rose-950/50 text-rose-400 border border-rose-900/20' : 'bg-amber-950/50 text-amber-500 border border-amber-900/20'
                            }`}>
                              {risk.impact}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-300 leading-relaxed border-l border-zinc-900">{risk.mitigation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Memory Layout Audit Notes */}
              <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 space-y-3">
                <h3 className="text-xs font-bold text-white tracking-tight uppercase font-mono">Pointer Memory Alignments Note (32-Bit Compiler Standard)</h3>
                <p className="text-xs text-zinc-400 leading-relaxed leading-relaxed">
                  Original assemblies of Zero Hour include microcoded custom allocations targeting traditional structures (e.g., <code className="text-zinc-200 font-mono text-[11px]">FieldObject</code>, <code className="text-zinc-200 font-mono text-[11px]">W3DModelInstance</code>). These pointer targets must occupy 4-byte boundaries. Our modern replacement <code className="text-zinc-200 font-mono text-[11px]">InfinityMemoryManager</code> elevates mapping allocations to 16-byte boundaries (SSE requirements), guaranteeing alignment compatibility while increasing memory load performance.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'checklist' && (
            <motion.div
              key="checklist"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Build instructions CLI */}
                <div className="md:col-span-6 bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
                  <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2 font-mono">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    COMPILER PRODUCTION BUILD FLOW
                  </h3>
                  <div className="prose prose-sm prose-invert max-w-none text-xs text-zinc-400 space-y-2 whitespace-pre-wrap leading-relaxed">
                    {BUILD_INSTRUCTIONS}
                  </div>
                </div>

                {/* Validation and Regression lists */}
                <div className="md:col-span-6 space-y-6">
                  
                  {/* Validation Checklist */}
                  <div className="bg-zinc-905 p-6 rounded-xl border border-zinc-800 space-y-4">
                    <h3 className="text-sm font-bold text-zinc-200 font-mono">
                      ENGINE VERIFICATION CHECKLIST
                    </h3>
                    <p className="text-xs text-zinc-500 uppercase font-mono tracking-wider">
                      Interactive test criteria targeting simulation loop stability:
                    </p>
                    <div className="space-y-2">
                      {validationList.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleValidation(idx)}
                          className="flex items-start gap-3 p-2.5 rounded hover:bg-zinc-900/40 cursor-pointer text-xs"
                        >
                          <input 
                            type="checkbox" 
                            checked={item.checked} 
                            readOnly 
                            className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-cyan-500 focus:ring-cyan-500/20"
                          />
                          <span className={`${item.checked ? 'text-zinc-300' : 'text-zinc-500 line-through'}`}>{item.item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regression list */}
                  <div className="bg-zinc-905 p-6 rounded-xl border border-zinc-800 space-y-4">
                    <div className="text-sm font-bold text-zinc-200 font-mono">
                      STABILITY REGRESSION TESTS
                    </div>
                    <p className="text-xs text-zinc-500 uppercase font-mono tracking-wider">
                      Criteria to safeguard legacy asset parsing mechanics:
                    </p>
                    <div className="space-y-2">
                      {regressionList.map((item, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => toggleRegression(idx)}
                          className="flex items-start gap-3 p-2.5 rounded hover:bg-zinc-900/40 cursor-pointer text-xs"
                        >
                          <input 
                            type="checkbox" 
                            checked={item.checked} 
                            readOnly 
                            className="mt-0.5 rounded border-zinc-700 bg-zinc-950 text-cyan-500 focus:ring-cyan-500/20"
                          />
                          <span className={`${item.checked ? 'text-zinc-300' : 'text-zinc-500 line-through'}`}>{item.item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'git' && (
            <motion.div
              key="git"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Git Commit Message Display */}
                <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-semibold text-cyan-400 font-mono flex items-center gap-2">
                        <GitCommit className="w-4 h-4" />
                        STANDARDIZED GIT COMMIT MESSAGE
                      </span>
                      <button 
                        id="copy-commit-btn"
                        onClick={() => {
                          navigator.clipboard.writeText(COMMIT_MESSAGE);
                        }}
                        className="p-1.5 rounded hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                        title="Copy Commit Message"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <pre className="text-xs text-zinc-300 font-mono bg-zinc-900/60 p-4 rounded-lg border border-zinc-900 leading-relaxed whitespace-pre-wrap select-all">
                      {COMMIT_MESSAGE}
                    </pre>
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-3">
                    Follows conventional-commits specification to trigger automated validation workflows in CI systems.
                  </p>
                </div>

                {/* Release Notes */}
                <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      RELEASE NOTES (STABLE 1.0.0-MODERNIZATION)
                    </span>
                    <button 
                      id="copy-release-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(RELEASE_NOTES);
                      }}
                      className="p-1.5 rounded hover:bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                      title="Copy Release Notes"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-zinc-300 space-y-4 max-h-[350px] overflow-auto pr-2 bg-zinc-900/30 p-4 rounded-lg border border-zinc-905">
                    <h1 className="text-sm font-bold border-b border-zinc-800 pb-1 text-white">SAGE Modernized release pipeline</h1>
                    <div className="whitespace-pre-wrap leading-relaxed">{RELEASE_NOTES}</div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-600">
          <div>
            © 2026 EA SAGE Infinity Project. Developed by Lead Engine Architect of CNC.
          </div>
          <div className="flex gap-4">
            <span className="hover:text-zinc-500 cursor-pointer">Security Protocol Checked</span>
            <span>•</span>
            <span className="text-zinc-500 hover:text-zinc-400 transition-colors uppercase font-bold text-[10px]">VERIFIED STABLE</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Simple icons fallback
function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewHandle="none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}
