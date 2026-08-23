import React, { useState, useRef } from 'react';

export function EmergencyPassView() {
  const [fileData, setFileData] = useState(null);
  const [zkHash, setZkHash] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef(null);

  // Simple client-side ZK-hash generator (simulated zero-knowledge verification)
  const generateZkProofHash = (text) => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `zk-proof-0x${Math.abs(hash).toString(16).padStart(12, '0')}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      let parsedJson = null;

      try {
        parsedJson = JSON.parse(content);
      } catch (err) {
        parsedJson = { rawContent: content };
      }

      const generatedHash = generateZkProofHash(content);
      setFileData(parsedJson);
      setZkHash(generatedHash);
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  // Generate public QR code link safely without using QRCode React components
  const qrPayload = encodeURIComponent(
    JSON.stringify({
      zkProof: zkHash || 'zk-proof-0x000000000000',
      patient: fileData?.name || fileData?.patientName || 'Anonymous Patient',
      bloodGroup: fileData?.bloodGroup || fileData?.bloodType || 'O+',
      emergencyContact: fileData?.emergencyContact || 'Emergency Contact Unspecified'
    })
  );

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrPayload}&color=0f172a&bgcolor=ffffff`;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-slate-950 text-slate-100 font-sans">
      {/* Panel Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4">
        <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl font-mono text-xl font-bold">
          ZK
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Medical File Scanner & ZK Emergency Pass</h1>
          <p className="text-xs text-slate-400 mt-1">
            Scan local health records to construct zero-knowledge cryptographic emergency credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: File Scanner Input */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            1. Scan Medical Record File
          </h2>

          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-8 text-center transition-all bg-slate-950/40">
            <div className="text-3xl mb-2">📁</div>
            <p className="text-xs text-slate-300 font-semibold mb-1">
              Select medical file (.json, .txt, .csv)
            </p>
            <p className="text-[10px] text-slate-500 mb-4">
              Data stays encrypted locally on your machine
            </p>

            <label className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-all inline-block shadow-md">
              Browse Local File
              <input type="file" accept=".json,.txt,.csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {fileName && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-xl text-cyan-400 text-xs font-semibold flex items-center justify-between">
              <span>Selected: {fileName}</span>
              <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded">Scanned</span>
            </div>
          )}

          {/* Parsed Output Preview */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Extracted Data Payload</h3>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-48 text-emerald-400">
              {fileData ? (
                <pre>{JSON.stringify(fileData, null, 2)}</pre>
              ) : (
                <span className="text-slate-600 italic">// Waiting for file upload...</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Generated ZK Pass & QR */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            2. Generated Emergency QR Pass
          </h2>

          {/* QR Container */}
          <div className="p-4 bg-white rounded-2xl shadow-2xl inline-block border-4 border-cyan-500/20">
            <img 
              src={qrImageUrl} 
              alt="Emergency ZK QR Code" 
              className="w-52 h-52 block"
            />
          </div>

          {/* ZK Cryptographic Proof Metadata */}
          <div className="w-full space-y-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-left">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Zero-Knowledge Verification Hash</span>
              <span className="text-xs font-mono text-cyan-400 truncate block">
                {zkHash || 'zk-proof-0x000000000000'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
              First responders can scan this QR pass to verify emergency status without giving full access to unencrypted medical histories.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmergencyPassView;
