import React from 'react';
import { useVault } from '../context/VaultContext.jsx';
import {
  Layers,
  ShieldCheck,
  Flame,
  Clock,
  Coins,
  CheckCircle2,
  Lock,
  ExternalLink,
  Binary
} from 'lucide-react';

export function AuditLogsView() {
  const { auditLogs } = useVault();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-cyan-400" />
                Immutable Blockchain Audit Ledger
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                L2 Rollup Finality
              </span>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every zero-knowledge proof verification, time-locked access authorization, break-glass ICU emergency override, and crypto bounty payment is permanently anchored to the blockchain.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Binary className="w-4 h-4 text-cyan-400" />
            On-Chain Event Stream ({auditLogs.length} Records)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Consensus State: SYNCHRONIZED</span>
        </div>

        <div className="space-y-3">
          {auditLogs.map((log) => {
            const isBreakGlass = log.type === 'EMERGENCY_BREAK_GLASS';
            const isBounty = log.type === 'RESEARCH_BOUNTY_CLAIMED';

            return (
              <div
                key={log.id}
                className={`p-4 rounded-xl border transition-all ${
                  isBreakGlass
                    ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/30'
                    : isBounty
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isBreakGlass ? (
                      <span className="p-1 rounded bg-rose-500/20 text-rose-400">
                        <Flame className="w-4 h-4" />
                      </span>
                    ) : isBounty ? (
                      <span className="p-1 rounded bg-amber-500/20 text-amber-400">
                        <Coins className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                    <h3 className={`text-sm font-bold ${isBreakGlass ? 'text-rose-300' : 'text-white'}`}>
                      {log.title}
                    </h3>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3 leading-relaxed">{log.detail}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Actor:</span>
                    <span className="text-slate-300">{log.actor}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Tx Hash:</span>
                    <span className="text-cyan-400">{log.txHash}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isBreakGlass
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
