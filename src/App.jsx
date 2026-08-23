import React, { useState } from 'react';
import { VaultProvider } from './context/VaultContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { PatientVaultView } from './views/PatientVaultView.jsx';
import { AISymptomCheckerView } from './views/AISymptomCheckerView.jsx';
import { EmergencyPassView } from './views/EmergencyPassView.jsx';
import { DoctorPortalView } from './views/DoctorPortalView.jsx';
import { ParamedicScannerView } from './views/ParamedicScannerView.jsx';
import { ResearchMarketplaceView } from './views/ResearchMarketplaceView.jsx';
import { AuditLogsView } from './views/AuditLogsView.jsx';
import {
  Shield,
  FileText,
  Brain,
  QrCode,
  Stethoscope,
  Ambulance,
  FlaskConical,
  Layers
} from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('vault');

  const navItems = [
    { id: 'vault', label: 'Encrypted Vault', icon: FileText, desc: 'AES-256 IPFS Records' },
    { id: 'ai-symptom', label: 'On-Device AI', icon: Brain, desc: 'Private Triage Engine' },
    { id: 'emergency-pass', label: 'Emergency ZK-Pass', icon: QrCode, desc: 'Lockscreen QR Card' },
    { id: 'doctor', label: 'Doctor Verifier', icon: Stethoscope, desc: 'ZK Query & Break-Glass' },
    { id: 'paramedic', label: 'Paramedic Scanner', icon: Ambulance, desc: 'Offline EMT Reader' },
    { id: 'research', label: 'Research Rewards', icon: FlaskConical, desc: 'Bounties & $MED' },
    { id: 'audit', label: 'Audit Ledger', icon: Layers, desc: 'On-Chain Event Logs' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'vault' && <PatientVaultView />}
        {activeTab === 'ai-symptom' && <AISymptomCheckerView />}
        {activeTab === 'emergency-pass' && <EmergencyPassView setActiveTab={setActiveTab} />}
        {activeTab === 'doctor' && <DoctorPortalView />}
        {activeTab === 'paramedic' && <ParamedicScannerView />}
        {activeTab === 'research' && <ResearchMarketplaceView />}
        {activeTab === 'audit' && <AuditLogsView />}
      </main>

      <footer className="border-t border-slate-800/80 py-6 bg-slate-950/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">ZK-MedVault Protocol</span>
            <span>•</span>
            <span>Zero-Knowledge & Decentralized Health Architecture</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>ZK-Groth16 Engine</span>
            <span>•</span>
            <span>WebCrypto AES-GCM</span>
            <span>•</span>
            <span>On-Device zkML</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <VaultProvider>
      <AppContent />
    </VaultProvider>
  );
}