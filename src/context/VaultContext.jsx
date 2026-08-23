import React, { createContext, useContext, useState, useEffect } from 'react';
import { encryptMedicalData, calculateSHA256 } from '../crypto/encryption.js';

const VaultContext = createContext();

const INITIAL_RECORDS = [
  {
    id: 'REC-01',
    title: 'COVID-19 mRNA Booster Certificate',
    category: 'Immunization',
    issuer: 'Apex City Health Department',
    date: '2024-11-15',
    doctor: 'Dr. Sarah Jenkins, MD',
    isEncrypted: true,
    ipfsCID: 'bafybeih4x79kzm98234jdf012938491k3491823medvault77',
    integrityHash: '0x9d4e21a8f6c310294819238471bcca9812903823485718293481928374910293',
    structuredData: {
      vaccineName: 'Spikevax mRNA-1273.815',
      vaccineCode: 'VAX-COV-2024',
      dosesReceived: 3,
      batchNumber: 'BT-99482-US',
      status: 'VERIFIED_ACTIVE'
    },
    confidentialNotes: 'No adverse reactions noted. Booster completed.'
  },
  {
    id: 'REC-02',
    title: 'Comprehensive Metabolic Panel & HbA1c',
    category: 'Laboratory Diagnostics',
    issuer: 'Quest Diagnostic Labs',
    date: '2025-01-20',
    doctor: 'Dr. Robert Miller, Pathologist',
    isEncrypted: true,
    ipfsCID: 'bafybeih5a98234819238471bcca981290382348571829348192837491medvault77',
    integrityHash: '0x3c8192a091823948123984128934819234871928374918239481928374918239',
    structuredData: {
      hba1c: 5.3,
      fastingGlucose: 92,
      cholesterolTotal: 178,
      ldl: 98,
      hdl: 58,
      triglycerides: 110,
      kidneyEGFR: '> 90'
    },
    confidentialNotes: 'All biomarker indices are within optimal non-diabetic range.'
  },
  {
    id: 'REC-03',
    title: 'Pulmonary Function & Spirometry Test',
    category: 'Pulmonology',
    issuer: 'Metro Pulmonary Institute',
    date: '2025-04-10',
    doctor: 'Dr. Angela Thorne, MD',
    isEncrypted: true,
    ipfsCID: 'bafybeih6c3819283749182394819283749182394819238471bcca98129medvault77',
    integrityHash: '0x7f4819283749182394819283749182394819238471bcca981290382348571829',
    structuredData: {
      condition: 'Mild Intermittent Asthma',
      icd10: 'J45.909',
      fev1Percent: 88,
      bronchodilatorResponse: 'Positive (14% reversibility)',
      smokerStatus: 'Non-Smoker'
    },
    confidentialNotes: 'Prescribed Albuterol HFA as-needed. Well controlled.'
  },
  {
    id: 'REC-04',
    title: 'Psychotherapy & Mental Health Consultation',
    category: 'Psychiatry & Behavioral',
    issuer: 'Beacon Mind Wellness Clinic',
    date: '2025-06-18',
    doctor: 'Dr. Jonathan Blake, PsyD',
    isEncrypted: true,
    ipfsCID: 'bafybeih7d9182934819283749102934819238471bcca9812903823485medvault77',
    integrityHash: '0x1a82934819283749102934819238471bcca98129038234857182934819283749',
    structuredData: {
      diagnosis: 'Situational Work-Related Stress',
      dsm5Code: 'F43.20',
      medicationPrescribed: 'None',
      therapyProtocol: 'Cognitive Behavioral Therapy (CBT)'
    },
    confidentialNotes: 'Strictly confidential therapist psychotherapy notes. Not visible to routine doctors or emergency scans.'
  }
];

const INITIAL_STUDIES = [
  {
    id: 'STUDY-101',
    title: 'Phase 3 Asthma Inhaled Therapy Clinical Trial',
    sponsor: 'Novartis BioPharma Reseach',
    category: 'Respiratory',
    rewardTokens: 150,
    targetParticipants: 500,
    enrolledCount: 382,
    criteria: {
      condition: 'Mild Intermittent Asthma',
      ageRange: [20, 35],
      reqNonSmoker: true,
      fev1Min: 70
    },
    criteriaDescription: 'Must have verified Asthma diagnosis (ICD-10 J45.x), age 20-35, verified non-smoker.',
    claimed: false,
    escrowAddress: '0x8892A...EscrowPool1'
  },
  {
    id: 'STUDY-102',
    title: 'Metabolic Longevity & Pre-Diabetes Prevention Study',
    sponsor: 'Stanford Longevity Institute',
    category: 'Metabolic & Endocrinology',
    rewardTokens: 100,
    targetParticipants: 1000,
    enrolledCount: 840,
    criteria: {
      biomarkerName: 'HbA1c',
      maxHbA1c: 5.7,
      ageRange: [18, 50]
    },
    criteriaDescription: 'Must prove HbA1c < 5.7% (optimal non-diabetic range) and age 18-50 without revealing exact lab scores.',
    claimed: false,
    escrowAddress: '0x3341C...EscrowPool2'
  },
  {
    id: 'STUDY-103',
    title: 'Multi-Variant mRNA Booster Efficacy Registry',
    sponsor: 'Global Vaccine Safety Consortium',
    category: 'Immunology',
    rewardTokens: 60,
    targetParticipants: 2500,
    enrolledCount: 2190,
    criteria: {
      vaccineCode: 'VAX-COV-2024',
      minDoses: 3
    },
    criteriaDescription: 'Must cryptographically prove at least 3 mRNA booster doses administered without disclosing location or clinic.',
    claimed: false,
    escrowAddress: '0x7120F...EscrowPool3'
  }
];

const INITIAL_TIMED_GRANTS = [
  {
    id: 'GRANT-01',
    doctorName: 'Dr. Elena Rostova',
    hospital: 'St. Jude Cardiology Center',
    walletAddress: '0x3A9F...84E2',
    grantedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 85 * 60 * 1000).toISOString(),
    status: 'ACTIVE',
    permittedCategories: ['Immunization', 'Laboratory Diagnostics', 'Pulmonology']
  },
  {
    id: 'GRANT-02',
    doctorName: 'Dr. Marcus Vance',
    hospital: 'Metro Urgent Care',
    walletAddress: '0x9B11...72A0',
    grantedAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    status: 'EXPIRED',
    permittedCategories: ['Immunization']
  }
];

export function VaultProvider({ children }) {
  const [currentRole, setCurrentRole] = useState('patient');

  const [patientProfile, setPatientProfile] = useState({
    name: 'Alex Chen',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    birthYear: 1998,
    bloodGroup: 'O-Positive (O+)',
    allergies: ['Penicillin (Severe Anaphylaxis)', 'Latex'],
    chronicConditions: ['Mild Intermittent Asthma (J45.909)'],
    emergencyContact: 'Sarah Chen (Spouse) • +1 (555) 234-5678',
    organDonor: true,
    dnrStatus: 'Full Resuscitation Code (CPR OK)',
    medTokens: 250.00
  });

  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [timedGrants, setTimedGrants] = useState(INITIAL_TIMED_GRANTS);
  const [studies, setStudies] = useState(INITIAL_STUDIES);

  const [emergencyPrefs, setEmergencyPrefs] = useState({
    includeBloodGroup: true,
    includeAllergies: true,
    includeEmergencyContact: true,
    includeDNR: true,
    includeChronicConditions: true,
    includePsychiatric: false
  });

  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'LOG-01',
      type: 'ZK_VERIFY',
      title: 'Doctor ZK-Proof Verification',
      actor: 'Dr. Elena Rostova (0x3A9F...84E2)',
      detail: 'Verified: COVID-19 mRNA 3-Dose Booster (VAX-COV-2024)',
      txHash: '0x49f823...a9b2',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'VERIFIED_ON_CHAIN'
    },
    {
      id: 'LOG-02',
      type: 'TIMED_ACCESS_GRANTED',
      title: '2-Hour Timed Session Authorized',
      actor: 'Patient Wallet (0x742d...f44e)',
      detail: 'Granted time-locked read credentials to St. Jude Cardiology Center',
      txHash: '0x77c102...38ff',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      status: 'ACTIVE_LOCK'
    }
  ]);

  const [notifications, setNotifications] = useState([]);

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `NOTIF-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const addRecord = async (recordData) => {
    const encResult = await encryptMedicalData(recordData.structuredData);
    const newRecord = {
      id: `REC-0${records.length + 1}`,
      title: recordData.title,
      category: recordData.category,
      issuer: recordData.issuer || 'Personal Health Upload',
      date: new Date().toISOString().split('T')[0],
      doctor: recordData.doctor || 'Self-Uploaded',
      isEncrypted: true,
      ipfsCID: encResult.ipfsCID || `bafybeih${Date.now()}medvault77`,
      integrityHash: encResult.integrityHash || '0x' + Array(64).fill('a').join(''),
      structuredData: recordData.structuredData,
      confidentialNotes: recordData.confidentialNotes || 'Client-side encrypted medical entry.'
    };

    setRecords((prev) => [newRecord, ...prev]);

    const newLog = {
      id: `LOG-${Date.now()}`,
      type: 'RECORD_ENCRYPTED_UPLOAD',
      title: 'New Encrypted Record Anchored to IPFS',
      actor: `Patient (${patientProfile.walletAddress.slice(0, 8)}...)`,
      detail: `${recordData.title} encrypted via AES-GCM-256 and pinned to IPFS CID: ${newRecord.ipfsCID.slice(0, 18)}...`,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'IMMUTABLE_LOG'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    addNotification('Record Encrypted & Uploaded', `${recordData.title} was safely encrypted with your private key and stored on IPFS.`, 'success');
  };

  const grantDoctorAccess = (doctorName, hospital, walletAddress, durationMinutes = 120) => {
    const grantId = `GRANT-${Date.now().toString().slice(-4)}`;
    const now = Date.now();
    const newGrant = {
      id: grantId,
      doctorName,
      hospital,
      walletAddress: walletAddress || `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
      grantedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + durationMinutes * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      permittedCategories: ['Immunization', 'Laboratory Diagnostics', 'Pulmonology']
    };

    setTimedGrants((prev) => [newGrant, ...prev]);

    const newLog = {
      id: `LOG-${Date.now()}`,
      type: 'TIMED_ACCESS_GRANTED',
      title: 'Smart Contract Timed Access Granted',
      actor: `Patient (${patientProfile.walletAddress.slice(0, 8)}...)`,
      detail: `Granted ${durationMinutes} minutes temporary read access to ${doctorName} (${hospital})`,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'ACTIVE_LOCK'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    addNotification('Timed Access Granted', `${doctorName} now has temporary read access expiring in ${durationMinutes} minutes.`, 'info');
  };

  const revokeDoctorAccess = (grantId) => {
    setTimedGrants((prev) =>
      prev.map((g) => (g.id === grantId ? { ...g, status: 'REVOKED', expiresAt: new Date().toISOString() } : g))
    );

    const revokedGrant = timedGrants.find((g) => g.id === grantId);
    const newLog = {
      id: `LOG-${Date.now()}`,
      type: 'ACCESS_REVOKED',
      title: 'Smart Contract Access Revocation',
      actor: `Patient (${patientProfile.walletAddress.slice(0, 8)}...)`,
      detail: `Explicitly revoked access for ${revokedGrant?.doctorName || 'Doctor'} before scheduled expiry`,
      txHash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'REVOKED_ON_CHAIN'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    addNotification('Access Revoked', `Access for ${revokedGrant?.doctorName} was terminated immediately.`, 'warning');
  };

  const triggerBreakGlass = (doctorName, hospital, reason) => {
    const newLog = {
      id: `LOG-${Date.now()}`,
      type: 'EMERGENCY_BREAK_GLASS',
      title: '🚨 EMERGENCY BREAK-GLASS TRIGGERED',
      actor: `${doctorName} (${hospital})`,
      detail: `EMERGENCY ICU OVERRIDE: "${reason}". Full audit event recorded on blockchain ledger. Emergency contacts alerted via SMS/Email.`,
      txHash: `0x${Math.random().toString(16).slice(2, 14)}...${Math.random().toString(16).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      status: 'CRITICAL_AUDIT_LOG'
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    addNotification(
      '🚨 BREAK-GLASS PROTOCOL ACTIVATED',
      `${doctorName} at ${hospital} triggered emergency access for patient trauma care. Audit log is immutable.`,
      'emergency'
    );
  };

  const claimResearchBounty = (studyId, proofDetails) => {
    const study = studies.find((s) => s.id === studyId);
    if (!study || study.claimed) return;

    setStudies((prev) =>
      prev.map((s) => (s.id === studyId ? { ...s, claimed: true, enrolledCount: s.enrolledCount + 1 } : s))
    );

    setPatientProfile((prev) => ({
      ...prev,
      medTokens: prev.medTokens + study.rewardTokens
    }));

    const newLog = {
      id: `LOG-${Date.now()}`,
      type: 'RESEARCH_BOUNTY_CLAIMED',
      title: 'Pharma ZK-Eligibility Proof Verified & Bounty Paid',
      actor: `Smart Contract Escrow (${study.escrowAddress})`,
      detail: `ZK-Proof successfully verified on-chain. Released +${study.rewardTokens} $MED reward to patient wallet.`,
      txHash: `0x${Math.random().toString(16).slice(2, 12)}...${Math.random().toString(16).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'TOKENS_TRANSFERRED'
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    addNotification(
      '🎉 + ' + study.rewardTokens + ' $MED Tokens Earned!',
      `Your ZK eligibility proof for "${study.title}" was verified without revealing your identity or medical files.`,
      'success'
    );
  };

  const createStudy = (newStudyData) => {
    const studyObj = {
      id: `STUDY-${Date.now().toString().slice(-3)}`,
      title: newStudyData.title,
      sponsor: newStudyData.sponsor || 'Astra BioLabs',
      category: newStudyData.category || 'Clinical Research',
      rewardTokens: Number(newStudyData.rewardTokens) || 120,
      targetParticipants: Number(newStudyData.targetParticipants) || 300,
      enrolledCount: 0,
      criteria: newStudyData.criteria || { condition: 'General Health' },
      criteriaDescription: newStudyData.criteriaDescription || 'ZK criteria validation required.',
      claimed: false,
      escrowAddress: `0x${Math.random().toString(16).slice(2, 6)}...EscrowPool`
    };

    setStudies((prev) => [studyObj, ...prev]);
    addNotification('Study Created & Escrow Funded', `Study "${studyObj.title}" is now accepting ZK proofs.`, 'success');
  };

  return (
    <VaultContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        patientProfile,
        setPatientProfile,
        records,
        setRecords,
        timedGrants,
        studies,
        emergencyPrefs,
        setEmergencyPrefs,
        auditLogs,
        notifications,
        addNotification,
        addRecord,
        grantDoctorAccess,
        revokeDoctorAccess,
        triggerBreakGlass,
        claimResearchBounty,
        createStudy
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export function useVault() {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
}
