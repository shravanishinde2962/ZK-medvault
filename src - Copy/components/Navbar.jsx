import React, { useState } from 'react';
import { useVault } from '../context/VaultContext.jsx';
import {
  Shield,
  User,
  Stethoscope,
  Ambulance,
  FlaskConical,
  Coins,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Lock
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab }) {
  const {
    currentRole,
    setCurrentRole,
    patientProfile,
    notifications
  } = useVault();

  const [showNotifications, setShowNotifications] = useState(false);

  const roles = [
    { id: 'patient', label: 'Patient Vault', icon: User, badge: 'Owner' },
    { id: 'doctor', label: 'Doctor Portal', icon: Stethoscope, badge: 'Verifier' },
    { id: 'paramedic', label: 'Paramedic EMT', icon: Ambulance, badge: 'Offline Scanner' },
    { id: 'pharma', label: 'Pharma Research', icon: FlaskConical, badge: 'Bounties' }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">ZK-MedVault</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  Zero-Knowledge v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Privacy-Preserving Decentralized Health Protocol</p>
            </div>
          </div>

          {/* Role Switcher Toolbar */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = currentRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setCurrentRole(role.id);
                    if (role.id === 'patient' && activeTab === 'doctor') setActiveTab('vault');
                    if (role.id === 'doctor') setActiveTab('doctor');
                    if (role.id === 'paramedic') setActiveTab('paramedic');
                    if (role.id === 'pharma') setActiveTab('research');
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={`Switch perspective to ${role.label}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{role.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Wallet & Notification Hub */}
          <div className="flex items-center gap-3">
            {/* $MED Token Wallet */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800/80 shadow-sm">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/20 text-amber-400">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="text-xs font-mono font-bold text-amber-300">
                  {patientProfile.medTokens.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400 ml-1 font-mono">$MED</span>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                title="Notifications & Audit Alerts"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Bell className="w-3.5 h-3.5 text-cyan-400" />
                      Live Network Alerts ({notifications.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Web3 Event Stream</span>
                  </div>
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-4">No recent notifications.</p>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-xs ${
                            n.type === 'emergency'
                              ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                              : n.type === 'success'
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-1">
                            <span className="flex items-center gap-1.5">
                              {n.type === 'emergency' && <Flame className="w-3.5 h-3.5 text-rose-400" />}
                              {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] opacity-60 font-mono">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed opacity-90">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
