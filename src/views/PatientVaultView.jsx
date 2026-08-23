import React, { useState } from 'react';
import { useVault } from '../context/VaultContext.jsx';
import { generateZKProof, verifyZKProof } from '../crypto/zkEngine.js';
import {
  Lock,
  Unlock,
  ShieldCheck,
  FileText,
  UploadCloud,
  Cpu,
  Clock,
  Trash2,
  CheckCircle,
  Plus,
  Binary
} from 'lucide-react';

export function PatientVaultView() {
  const {
    patientProfile,
    records,
    addRecord,
    timedGrants,
    revokeDoctorAccess
  } = useVault();

  const [decryptedState, setDecryptedState] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Laboratory Diagnostics');
  const [newNotes, setNewNotes] = useState('');
  const [newBiomarkerKey, setNewBiomarkerKey] = useState('bloodSugar');
  const [newBiomarkerValue, setNewBiomarkerValue] = useState('95');

  const [selectedProofType, setSelectedProofType] = useState('VACCINE_STATUS');
  const [isProving, setIsProving] = useState(false);
  const [generatedProof, setGeneratedProof] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  const toggleDecrypt = (id) => {
    setDecryptedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetUploadForm = () => {
    setNewTitle('');
    setNewNotes('');
    setNewCategory('Laboratory Diagnostics');
    setNewBiomarkerKey('bloodSugar');
    setNewBiomarkerValue('95');
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsUploading(true);
    await addRecord({
      title: newTitle,
      category: newCategory,
      issuer: 'Apex Medical Lab',
      doctor: 'Dr. Katherine Wood',
      structuredData: {
        [newBiomarkerKey]: newBiomarkerValue,
        recordedAt: new Date().toISOString(),
        verifiedDoctorSignature: '0x8f9c2...valid'
      },
      confidentialNotes: newNotes || 'Encrypted client record.'
    });

    setIsUploading(false);
    setShowUploadModal(false);
    resetUploadForm();
  };

  const handleRunZKProof = async () => {
    setIsProving(true);
    setGeneratedProof(null);
    setVerificationResult(null);

    let privateInputs = {};
    let publicInputs = {};

    if (selectedProofType === 'VACCINE_STATUS') {
      privateInputs = { vaccineCode: 'VAX-COV-2024', doses: 3 };
      publicInputs = { requiredVaccineCode: 'VAX-COV-2024', minRequiredDoses: 2 };
    } else if (selectedProofType === 'METRIC_RANGE_CHECK') {
      privateInputs = { metricValue: 5.3 };
      publicInputs = { minThreshold: 4.0, maxThreshold: 5.7, metricName: 'HbA1c Glycated Hemoglobin' };
    } else if (selectedProofType === 'AGE_ELIGIBILITY') {
      privateInputs = { birthYear: 1998 };
      publicInputs = { minAge: 20, maxAge: 35, currentYear: new Date().getFullYear() };
    }

    try {
      const proof = await generateZKProof(selectedProofType, privateInputs, publicInputs);
      setGeneratedProof(proof);

      const result = await verifyZKProof(proof);
      setVerificationResult(result);
    } catch (err) {
      console.error('ZK Proof Execution Error:', err);
    } finally {
      setIsProving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Encrypted Medical Vault
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Client AES-GCM Locked
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Records are encrypted on your device with your private key and stored on IPFS.
              Third parties never see raw files—they only verify zero-knowledge mathematical proofs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Upload & Encrypt Record
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Vault Owner</span>
            <span className="font-semibold text-slate-200">{patientProfile.name}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Decentralized Wallet</span>
            <span className="font-mono text-cyan-400 font-semibold truncate block">
              {patientProfile.walletAddress.slice(0, 6)}...{patientProfile.walletAddress.slice(-4)}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Emergency Blood Group</span>
            <span className="font-semibold text-rose-400">{patientProfile.bloodGroup}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Total Encrypted Records</span>
            <span className="font-semibold text-slate-200">{records.length} Documents</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Decentralized Medical Documents ({records.length})
            </h2>
            <span className="text-xs text-slate-400">AES-256 Client-Side Ciphertexts</span>
          </div>

          <div className="space-y-4">
            {records.map((rec) => {
              const isDecrypted = decryptedState[rec.id];

              return (
                <div
                  key={rec.id}
                  className="glass-panel p-5 transition-all hover:border-slate-700/80 group"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-cyan-300 border border-cyan-500/20 font-mono">
                          {rec.category}
                        </span>
                        <span className="text-xs text-slate-400">{rec.date}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Issued by: <span className="text-slate-300">{rec.issuer}</span> • {rec.doctor}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleDecrypt(rec.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        isDecrypted
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25'
                      }`}
                    >
                      {isDecrypted ? (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Re-Lock
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" /> Decrypt View
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 py-2 px-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] font-mono mb-3">
                    <span className="text-slate-500">IPFS CID:</span>
                    <span className="text-cyan-400 truncate max-w-[140px] sm:max-w-[220px]">{rec.ipfsCID}</span>
                    <span className="text-slate-600">|</span>
                    <span className="text-slate-500">State:</span>
                    <span className={isDecrypted ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                      {isDecrypted ? '🔓 Decrypted (Local RAM)' : '🔒 AES-GCM Encrypted'}
                    </span>
                  </div>

                  {isDecrypted ? (
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs space-y-2 animate-in fade-in">
                      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                        <span className="font-semibold text-amber-300">Structured Medical Payload</span>
                        <span className="text-[10px] text-slate-400">Decrypted via Client WebCrypto API</span>
                      </div>
                      <pre className="p-2.5 rounded-lg bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-x-auto">
                        {JSON.stringify(rec.structuredData, null, 2)}
                      </pre>
                      <p className="text-[11px] text-slate-300 italic">
                        <span className="font-semibold text-slate-400">Clinical Notes: </span>
                        {rec.confidentialNotes}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                      <div className="truncate pr-2">
                        <span className="text-slate-600 mr-2">CIPHERTEXT:</span>
                        <span className="text-slate-400">
                          {rec.integrityHash.slice(0, 38)}...8f3a9e22 (AES-256 Locked)
                        </span>
                      </div>
                      <span className="text-slate-500 text-[10px] whitespace-nowrap">Zero-Knowledge Ready</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5 border-cyan-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                ZK Prover Sandbox
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono">
                Groth16 / BN254
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Generate a cryptographic proof verifying your medical condition without disclosing underlying lab values or certificates.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  Select Verification Circuit:
                </label>
                <select
                  value={selectedProofType}
                  onChange={(e) => setSelectedProofType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="VACCINE_STATUS">Proof of 3-Dose Booster (VAX-COV-2024)</option>
                  <option value="METRIC_RANGE_CHECK">Proof of HbA1c Normal Range (4.0% - 5.7%)</option>
                  <option value="AGE_ELIGIBILITY">Proof of Age Bracket (20 - 35 Years)</option>
                </select>
              </div>

              <button
                onClick={handleRunZKProof}
                disabled={isProving}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Computing Groth16 Curve Points...
                  </>
                ) : (
                  <>
                    <Binary className="w-3.5 h-3.5" />
                    Generate & Verify ZK Proof
                  </>
                )}
              </button>
            </div>

            {generatedProof && (
              <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">
                    {generatedProof.circuit}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Proved in {generatedProof.provingTimeMs}ms
                  </span>
                </div>

                {verificationResult && (
                  <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-300 text-xs block">
                        Mathematical Proof VERIFIED
                      </span>
                      <span className="text-[10px] text-emerald-400/80">
                        Condition met without disclosing private health values!
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono">Public Signals:</span>
                  <div className="flex flex-wrap gap-1">
                    {generatedProof.publicSignals.map((sig, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                      >
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
                  <div>Proof Hash: <span className="text-cyan-300">{generatedProof.proofHash}</span></div>
                  <div>pi_a[0]: <span className="text-slate-300">{generatedProof.pi_a[0].slice(0, 16)}...</span></div>
                </div>
              </div>
            )}
          </div>

          <div className="glass-panel p-5 border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Active Timed Doctor Grants
              </h2>
              <span className="text-[10px] text-slate-400">Smart Contract Locks</span>
            </div>

            <div className="space-y-3">
              {timedGrants.map((grant) => {
                const isActive = grant.status === 'ACTIVE';

                return (
                  <div
                    key={grant.id}
                    className={`p-3 rounded-xl border text-xs ${
                      isActive
                        ? 'bg-slate-900/80 border-blue-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-200">{grant.doctorName}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {grant.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mb-2">{grant.hospital}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                      <span className="text-slate-400">
                        {isActive ? 'Auto-revokes in ~85 min' : 'Expired'}
                      </span>

                      {isActive && (
                        <button
                          onClick={() => revokeDoctorAccess(grant.id)}
                          className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" /> Revoke Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" />
                Encrypt & Anchor New Medical File
              </h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  resetUploadForm();
                }}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Annual Echocardiogram & Lipid Panel"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Laboratory Diagnostics">Laboratory Diagnostics</option>
                    <option value="Immunization">Immunization</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="General Health">General Health</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Key Metric Value</label>
                  <input
                    type="text"
                    value={newBiomarkerValue}
                    onChange={(e) => setNewBiomarkerValue(e.target.value)}
                    placeholder="e.g., 95 (mg/dL) or VAX-OK"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Confidential Clinical Notes</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Personal observations, physician comments..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300">
                🔒 Web Crypto will encrypt this in browser memory with AES-GCM-256 before generating an IPFS CID.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? 'Encrypting...' : 'Encrypt & Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
