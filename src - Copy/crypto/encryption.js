/**
 * Client-Side Cryptographic Engine (Web Crypto API)
 * Implements true AES-GCM-256 Encryption/Decryption and SHA-256 Hashing.
 * Ensures zero plaintext medical data ever leaves the client's browser.
 */

// Generate a cryptographic key from a passphrase or seed
export async function deriveKeyFromPassphrase(passphrase = 'zk-medvault-patient-master-key-2026') {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = enc.encode('zk-medvault-deterministic-salt-48291');

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt plaintext JSON/string using AES-GCM 256-bit
export async function encryptMedicalData(plainData, customPassphrase) {
  try {
    const key = await deriveKeyFromPassphrase(customPassphrase);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const dataString = typeof plainData === 'string' ? plainData : JSON.stringify(plainData);
    const encodedData = enc.encode(dataString);

    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    // Convert to Base64 for storage
    const ciphertextArray = Array.from(new Uint8Array(ciphertextBuffer));
    const ciphertextBase64 = btoa(String.fromCharCode.apply(null, ciphertextArray));
    const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)));

    // Calculate simulated IPFS CID (Content Identifier) and on-chain SHA-256 hash
    const hash = await calculateSHA256(ciphertextBase64);
    const ipfsCID = `bafybeih${hash.substring(0, 32).toLowerCase()}medvault77`;

    return {
      success: true,
      ciphertext: ciphertextBase64,
      iv: ivBase64,
      algorithm: 'AES-GCM-256',
      ipfsCID: ipfsCID,
      integrityHash: `0x${hash}`,
      timestamp: new Date().toISOString(),
      sizeBytes: encodedData.byteLength,
    };
  } catch (error) {
    console.error('Encryption failed:', error);
    return { success: false, error: error.message };
  }
}

// Decrypt ciphertext using AES-GCM 256-bit
export async function decryptMedicalData(encryptedPayload, customPassphrase) {
  try {
    const key = await deriveKeyFromPassphrase(customPassphrase);
    const iv = new Uint8Array(
      atob(encryptedPayload.iv)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    const ciphertext = new Uint8Array(
      atob(encryptedPayload.ciphertext)
        .split('')
        .map((c) => c.charCodeAt(0))
    );

    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    const dec = new TextDecoder();
    const decryptedString = dec.decode(decryptedBuffer);

    try {
      return { success: true, data: JSON.parse(decryptedString) };
    } catch {
      return { success: true, data: decryptedString };
    }
  } catch (error) {
    console.error('Decryption failed:', error);
    return { success: false, error: 'Decryption failed: Invalid encryption key or corrupted data.' };
  }
}

// Calculate standard SHA-256 hex string
export async function calculateSHA256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
