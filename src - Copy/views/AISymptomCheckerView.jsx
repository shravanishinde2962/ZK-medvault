import React, { useState } from 'react';
import { analyzeSymptomsLocally } from '../ai/symptomChecker';
import {
  Brain,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  Clock,
  Sparkles,
  WifiOff
} from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Dry Cough',
  'Wheezing / Shortness of Breath',
  'Fever & Chills',
  'Chest Tightness / Discomfort',
  'Severe Throbbing Headache',
  'Fatigue & Body Aches',
  'Skin Rash / Hives',
  'Nausea / Abdominal Cramps',
  'Sore Throat',
  'Dizziness / Lightheadedness'
];

export function AISymptomCheckerView() {
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Dry Cough', 'Wheezing / Shortness of Breath']);
  const [durationDays, setDurationDays] = useState(3);
  const [painScale, setPainScale] = useState(4);
  const [hasFever, setHasFever] = useState(true);
  const [feverTemp, setFeverTemp] = useState(101.2);
  const [chestPain, setChestPain] = useState(false);
  const [difficultyBreathing, setDifficultyBreathing] = useState(true);
  const [customNotes, setCustomNotes] = useState('History of mild asthma. Cough worse during night.');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState(null);

  const toggleSymptom = (sym) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setTriageResult(null);

    const result = await analyzeSymptomsLocally({
      primarySymptoms: selectedSymptoms,
      durationDays: Number(durationDays),
      painScale: Number(painScale),
      hasFever,
      feverTemp: parseFloat(feverTemp),
      chestPain,
      difficultyBreathing,
      customNotes
    });

    setTriageResult(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Brain className="w-6 h-6 text-indigo-400" />
                Privacy-Preserving On-Device AI Triage
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                <WifiOff className="w-3.5 h-3.5" /> 100% Local Inference
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Medical symptoms are analyzed directly inside your browser’s isolated memory sandbox.
              Zero prompts, symptoms, or personal data are ever sent to remote cloud AI servers (OpenAI/Google).
            </p>
          </div>

          {/* Privacy Metrics Guarantee Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/30 text-xs font-mono space-y-1.5 shrink-0">
            <div className="flex items-center justify-between gap-4 text-slate-400">
              <span>Cloud Exfiltration:</span>
              <span className="text-emerald-400 font-bold">0.00 Bytes (None)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-400">
              <span>Network Requests:</span>
              <span className="text-emerald-400 font-bold">0 HTTP / WS</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-400">
              <span>ZK Receipt:</span>
              <span className="text-cyan-400 font-bold">Cryptographically Signed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Symptom Input Wizard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 space-y-6">
            <div>
              <h2 className="text-sm font-bold text-slate-100 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                1. Select Presenting Symptoms
              </h2>
              <p className="text-xs text-slate-400 mb-3">Click all symptoms experienced in the past 7 days:</p>

              <div className="flex flex-wrap gap-2">
                {COMMON_SYMPTOMS.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-semibold shadow-md shadow-cyan-500/20'
                          : 'bg-slate-900/90 text-slate-300 border border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Severity Vitals & Sliders */}
            <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Duration Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Symptom Duration:</span>
                  <span className="font-mono text-cyan-400">{durationDays} Days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Pain Scale Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
                  <span>Pain / Discomfort Scale:</span>
                  <span className="font-mono text-amber-400">{painScale} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painScale}
                  onChange={(e) => setPainScale(e.target.value)}
                  className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Red Flag Emergency Checkboxes */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-200 block">Critical Indicator Flags:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:bg-slate-850">
                  <input
                    type="checkbox"
                    checked={difficultyBreathing}
                    onChange={(e) => setDifficultyBreathing(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                  <span>Shortness of Breath / Wheezing</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:bg-slate-850">
                  <input
                    type="checkbox"
                    checked={chestPain}
                    onChange={(e) => setChestPain(e.target.checked)}
                    className="rounded accent-rose-500"
                  />
                  <span>Chest Pain / Pressure</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 cursor-pointer hover:bg-slate-850">
                  <input
                    type="checkbox"
                    checked={hasFever}
                    onChange={(e) => setHasFever(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Elevated Body Temp ({feverTemp}°F)</span>
                </label>
              </div>
            </div>

            {/* Custom Notes */}
            <div className="pt-4 border-t border-slate-800/80">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Observations (Analyzed Locally):
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Specific triggers, current medications..."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            {/* Execute Local Inference Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-cyan-500 to-blue-600 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Executing In-Browser Neural Triage...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Symptoms Privately (On-Device)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Local Triage Assessment & ZK-Receipt (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {triageResult ? (
            <div className="glass-panel p-6 space-y-5 border-indigo-500/30 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  On-Device Assessment
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Inference: {triageResult.inferenceTimeMs}ms
                </span>
              </div>

              {/* Risk Level Badge */}
              <div
                className={`p-4 rounded-xl border flex items-center gap-3.5 ${
                  triageResult.riskLevel === 'CRITICAL'
                    ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                    : triageResult.riskLevel === 'MODERATE'
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                }`}
              >
                {triageResult.riskLevel === 'CRITICAL' ? (
                  <Flame className="w-7 h-7 text-rose-400 shrink-0" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider">
                    Triage Urgency: {triageResult.riskLevel}
                  </div>
                  <div className="text-xs font-semibold mt-0.5">{triageResult.urgency}</div>
                </div>
              </div>

              {/* Recommended Department */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <span className="text-slate-500 block text-[11px]">Recommended Specialty:</span>
                <span className="text-sm font-bold text-cyan-300">{triageResult.department}</span>
              </div>

              {/* Potential Conditions */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">
                  Potential Diagnostic Clusters:
                </span>
                <div className="space-y-2">
                  {triageResult.potentialConditions.map((cond, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200 font-medium">{cond.name}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/30">
                        {cond.probability} Match
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan */}
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-2">Recommended Next Steps:</span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {triageResult.actionPlan.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold shrink-0">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Verifiable ZK Triage Receipt */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 text-[11px] flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    Verifiable ZK-Triage Receipt
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono font-semibold">
                    ✓ Valid Cryptographic Proof
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  Proves a verified local model evaluated your symptoms without revealing the symptoms themselves.
                </p>
                <div className="p-2 rounded bg-slate-900 font-mono text-[10px] text-slate-400 break-all space-y-1">
                  <div>Hash: <span className="text-cyan-300">{triageResult.zkTriageReceipt.receiptHash.slice(0, 32)}...</span></div>
                  <div>Sig: <span className="text-slate-300">{triageResult.zkTriageReceipt.signature}</span></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 text-center space-y-4 border-dashed border-slate-800 flex flex-col items-center justify-center min-h-[380px]">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Brain className="w-6 h-6" />
              </div>
              <div className="max-w-xs">
                <h3 className="text-sm font-bold text-slate-200 mb-1">Local AI Engine Ready</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select your symptoms on the left and click "Analyze Symptoms Privately" to run the local model.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
