import React, { useState } from 'react';
import { useVault } from '../context/VaultContext.jsx';
import { generateZKProof, verifyZKProof } from '../crypto/zkEngine.js';
import confetti from 'canvas-confetti';
import {
  FlaskConical,
  Coins,
  CheckCircle2,
  Sparkles,
  Plus,
  Building2
} from 'lucide-react';

export function ResearchMarketplaceView() {
  const {
    currentRole,
    studies,
    claimResearchBounty,
    createStudy
  } = useVault();

  const [provingStudyId, setProvingStudyId] = useState(null);
  const [showCreateStudyModal, setShowCreateStudyModal] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSponsor, setNewSponsor] = useState('Pfizer Clinical Innovation');
  const [newCategory, setNewCategory] = useState('Immunology');
  const [newReward, setNewReward] = useState(120);
  const [newParticipants, setNewParticipants] = useState(500);
  const [newCriteriaDesc, setNewCriteriaDesc] = useState('Prove age 20-40 and normal blood panel without exposing records.');

  const handleClaimStudy = async (study) => {
    setProvingStudyId(study.id);

    try {
      let proofType = 'CLINICAL_TRIAL_CRITERIA';
      let priv = {};
      let pub = {};

      if (study.id === 'STUDY-101') {
        proofType = 'CLINICAL_TRIAL_CRITERIA';
        priv = { hasCondition: 'Mild Intermittent Asthma', isNonSmoker: true, biomarkerValue: 88 };
        pub = { targetCondition: 'Mild Intermittent Asthma', reqNonSmoker: true, maxBiomarker: null };
      } else if (study.id === 'STUDY-102') {
        proofType = 'METRIC_RANGE_CHECK';
        priv = { metricValue: 5.3 };
        pub = { minThreshold: 4.0, maxThreshold: 5.7, metricName: 'HbA1c' };
      } else if (study.id === 'STUDY-103') {
        proofType = 'VACCINE_STATUS';
        priv = { vaccineCode: 'VAX-COV-2024', doses: 3 };
        pub = { requiredVaccineCode: 'VAX-COV-2024', minRequiredDoses: 3 };
      } else {
        // Fallback generic mapping for dynamically created studies
        proofType = 'CLINICAL_TRIAL_CRITERIA';
        priv = { eligible: true };
        pub = { category: study.category };
      }

      const proof = await generateZKProof(proofType, priv, pub);
      const verification = await verifyZKProof(proof);

      if (verification.verified) {
        claimResearchBounty(study.id, { proof, verification });

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('ZK Proof Generation/Verification failed:', err);
    } finally {
      setProvingStudyId(null);
    }
  };

  const handleCreateStudySubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createStudy({
      title: newTitle,
      sponsor: newSponsor,
      category: newCategory,
      rewardTokens: Number(newReward) || 0,
      targetParticipants: Number(newParticipants) || 0,
      criteriaDescription: newCriteriaDesc
    });

    setShowCreateStudyModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <FlaskConical className="w-6 h-6 text-amber-400" />
                Monetized Medical Research Marketplace
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <Coins className="w-3.5 h-3.5" /> Crypto Escrow Rewards
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Pharmaceutical sponsors fund clinical studies with automated crypto smart contracts.
              Patients prove study eligibility via Zero-Knowledge proofs and claim instant token rewards—with zero identity disclosure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentRole === 'pharma' && (
              <button
                onClick={() => setShowCreateStudyModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Post New Trial & Fund Escrow
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-400" />
            Active Clinical Trials & Bounty Pools ({studies.length})
          </h2>
          <span className="text-xs text-slate-400">All payouts guaranteed by smart contract escrow</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studies.map((study) => {
            const isClaiming = provingStudyId === study.id;
            const progressPercent = study.targetParticipants > 0 
              ? Math.round((study.enrolledCount / study.targetParticipants) * 100) 
              : 0;

            return (
              <div
                key={study.id}
                className={`glass-panel p-5 flex flex-col justify-between transition-all ${
                  study.claimed ? 'border-emerald-500/30 bg-slate-900/90' : 'hover:border-slate-700'
                }`}
              >
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-amber-300 border border-amber-500/30 font-mono">
                      {study.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-400 font-mono">
                      <Coins className="w-3.5 h-3.5" />
                      <span>+{study.rewardTokens} $MED</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug">{study.title}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {study.sponsor}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-300 block">
                      ZK Eligibility Criteria:
                    </span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {study.criteriaDescription}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Verified Cohort:</span>
                      <span className="text-slate-300">
                        {study.enrolledCount} / {study.targetParticipants} ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                  {study.claimed ? (
                    <div className="py-2.5 px-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Reward Claimed
                      </span>
                      <span className="font-mono text-[11px] text-emerald-400">+{study.rewardTokens} $MED Paid</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaimStudy(study)}
                      disabled={isClaiming}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isClaiming ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                          Generating ZK Proof...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Prove Eligibility & Claim +{study.rewardTokens} $MED
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showCreateStudyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-400" />
                Create Clinical Trial & Deposit Bounty Escrow
              </h3>
              <button
                onClick={() => setShowCreateStudyModal(false)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Study Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Phase 2 Cardiovascular Biomarker Observational Trial"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Sponsor Organization</label>
                  <input
                    type="text"
                    value={newSponsor}
                    onChange={(e) => setNewSponsor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Immunology">Immunology</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Metabolic">Metabolic</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Reward per Patient ($MED)</label>
                  <input
                    type="number"
                    value={newReward}
                    onChange={(e) => setNewReward(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cohort Target Size</label>
                  <input
                    type="number"
                    value={newParticipants}
                    onChange={(e) => setNewParticipants(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ZK Eligibility Requirements</label>
                <textarea
                  rows={2}
                  value={newCriteriaDesc}
                  onChange={(e) => setNewCriteriaDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-300">
                💰 Funding Escrow: {(Number(newReward) || 0) * (Number(newParticipants) || 0)} $MED tokens will be locked in the smart contract escrow pool.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateStudyModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Deploy Trial & Fund Escrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}