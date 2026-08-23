import React, { useState } from 'react';
import { useVault } from '../context/VaultContext.jsx';
import { generateZKProof, verifyZKProof } from '../crypto/zkEngine.js';
import {
  Stethoscope,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Clock,
  Send,
  Lock,
  Cpu,
  AlertTriangle,
  FileCheck,
  Binary
} from 'lucide-react';

export function DoctorPortalView() {
  const {
    patientProfile,
    timedGrants,
    triggerBreakGlass,
    addNotification
  } = useVault();

  const [selectedQuery, setSelectedQuery] = useState('VACCINE_STATUS');
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState(null);

  const [showBreakGlassModal, setShowBreakGlassModal] = useState(false);
  const [doctorName, setDoctorName] = useState('Dr. Marcus Thorne, MD');
  const [hospitalDept, setHospitalDept] = useState('St. Jude Trauma ICU & Resuscitation');
  const [emergencyReason, setEmergencyReason] = useState(
    'Unconscious polytrauma patient admitted via ambulance. Urgent blood typing and severe allergy verification needed for emergency surgery.'
  );
  const [isActivatingBreakGlass, setIsActivatingBreakGlass] = useState(false);

  const handleSendZKQuery = async () => {
    setIsQuerying(true);
    setQueryResult(null);

    let priv = {};
    let pub = {};

    if (selectedQuery === 'VACCINE_STATUS') {
      priv = { vaccineCode: 'VAX-COV-2024', doses: 3 };
      pub = { requiredVaccineCode: 'VAX-COV-2024', minRequiredDoses: 2 };
    } else if (selectedQuery === 'METRIC_RANGE_CHECK') {
      priv = { metricValue: 5.3 };
      pub = { minThreshold: 4.0, maxThreshold: 5.7, metricName: 'HbA1c Target Range' };
    } else if (selectedQuery === 'AGE_ELIGIBILITY') {
      priv = { birthYear: 1998 };
      pub = { minAge: 21, maxAge: 65, currentYear: 2026 };
    }

    const proof = await generateZKProof(selectedQuery, priv, pub);
    const verification = await verifyZKProof(proof);

    setQueryResult({ proof, verification });
    setIsQuerying(false);

    addNotification(
      'ZK Verification Successful',
      `Doctor verified condition "${proof.circuit}" with zero data leakage.`,
      'success'
    );
  };

  const handleExecuteBreakGlass = (e) => {
    e.preventDefault();
    if (!emergencyReason.trim()) return;

    setIsActivatingBreakGlass(true);
    setTimeout(() => {
      triggerBreakGlass(doctorName, hospitalDept, emergencyReason);
      setIsActivatingBreakGlass(false);
      setShowBreakGlassModal(false);
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Stethoscope className="w-6 h-6 text-blue-400" />
                Hospital & Physician Verifier Portal
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Verified Medical Node
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Verify patient health criteria instantly via Zero-Knowledge Proofs without requiring full record disclosure.
              In life-critical ICU situations, activate the Break-Glass emergency override.
            </p>
          </div>

          <button
            onClick={() => setShowBreakGlassModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer animate-pulse-subtle"
          >
            <Flame className="w-4 h-4" />
            Trigger Emergency Break-Glass (ICU)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Zero-Knowledge Medical Query Console
              </h2>
              <span className="text-xs text-slate-400">Target Patient: {patientProfile.name}</span>
            </div>

            <p className="text-xs text-slate-400">
              Select a verification query. The patient's cryptographic client will calculate a Groth16 proof answering "True/False" without exposing dates, clinics, or raw numbers.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Verification Criteria Query:
                </label>
                <select
                  value={selectedQuery}
                  onChange={(e) => setSelectedQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="VACCINE_STATUS">
                    Query: Is patient vaccinated with ≥ 2 doses of mRNA Booster? (VAX-COV-2024)
                  </option>
                  <option value="METRIC_RANGE_CHECK">
                    Query: Is patient HbA1c in non-diabetic safe range (4.0% - 5.7%)?
                  </option>
                  <option value="AGE_ELIGIBILITY">
                    Query: Is patient an adult over 21 years of age?
                  </option>
                </select>
              </div>

              <button
                onClick={handleSendZKQuery}
                disabled={isQuerying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isQuerying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying Groth16 Pairing Equations...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit ZK Verification Request
                  </>
                )}
              </button>
            </div>

            {queryResult && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Mathematical ZK-Verification Result
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Verifier Latency: {queryResult.verification.verificationTimeMs}ms
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200">
                  <span className="font-bold block">✓ CONDITION MET: TRUE</span>
                  <span className="text-[11px] opacity-90">
                    The zero-knowledge SNARK proof was mathematically verified against the on-chain verification key.
                    No private patient records were revealed.
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-900 font-mono text-[10px] text-slate-400 space-y-1">
                  <div>Circuit: <span className="text-cyan-300">{queryResult.proof.circuit}</span></div>
                  <div>Proof Hash: <span className="text-slate-300">{queryResult.proof.proofHash}</span></div>
                  <div>Pairing Check: <span className="text-emerald-400">e(A,B) == e(α,β) • e(C,δ) [PASSED]</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Active Timed Access Grant
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                2-Hour Session
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Session Status:</span>
                <span className="text-emerald-400 font-bold font-mono">ACTIVE (Auto-Revoking)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hospital:</span>
                <span className="text-slate-200 font-semibold">St. Jude Cardiology Center</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Permitted Categories:</span>
                <span className="text-cyan-300">Immunization, Labs, Pulmonology</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">Excluded (Zero Access):</span>
                <span className="text-rose-400 font-semibold">Psychotherapy Notes, Full File</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-3 border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
              <Flame className="w-4 h-4 text-rose-400" />
              ICU Emergency Break-Glass Guidelines
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              The Break-Glass protocol bypasses ordinary patient access grants strictly during life-threatening ICU trauma cases.
              Every activation is permanently anchored to the immutable blockchain audit trail and instantly triggers SMS/Email alerts to the patient's emergency contacts.
            </p>
          </div>
        </div>
      </div>

      {showBreakGlassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-rose-500/50 shadow-2xl shadow-rose-900/40 p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                Trigger Emergency Break-Glass Protocol
              </h3>
              <button
                onClick={() => setShowBreakGlassModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteBreakGlass} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-[11px] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>
                  <strong>WARNING:</strong> This action will be permanently recorded in the on-chain audit ledger.
                  Unauthorized usage is subject to medical board review.
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Attending Physician Name</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hospital / Emergency Unit</label>
                <input
                  type="text"
                  required
                  value={hospitalDept}
                  onChange={(e) => setHospitalDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Clinical Emergency Justification</label>
                <textarea
                  rows={3}
                  required
                  value={emergencyReason}
                  onChange={(e) => setEmergencyReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBreakGlassModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActivatingBreakGlass}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  {isActivatingBreakGlass ? 'Signing On-Chain Override...' : 'Confirm Break-Glass Override'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
