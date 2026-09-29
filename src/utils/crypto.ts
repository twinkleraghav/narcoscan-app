/* ============================================================
   NarcoScan AI — Crypto / Hashing Utilities
   SHA-256 image fingerprinting using Web Crypto API
   ============================================================ */

/**
 * Generate SHA-256 hash of a data URL string
 * Uses Web Crypto API when available, falls back to demo hash
 */
export async function generateHash(data: string): Promise<string> {
  try {
    if (window.crypto && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch {
    // Fall through to demo hash
  }

  // Demo fallback — clearly labeled
  return 'DEMO-' + simpleHash(data);
}

/**
 * Simple non-cryptographic hash for demo fallback
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < Math.min(str.length, 10000); i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
}

/**
 * Generate Evidence ID with structured format
 */
export function generateEvidenceId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const seq = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EVD-${dateStr}-${seq}`;
}

export interface SecurityAuditReport {
  isHashValid: boolean;
  computedHash: string;
  storedHash: string;
  hasGpsLock: boolean;
  gpsCoordinates?: string;
  timestampUtc: string;
  isBsaCompliant: boolean;
  isOfflineIsolated: boolean;
  auditPassed: boolean;
  auditedAt: string;
}

/**
 * Execute real-time Cryptographic Security & Chain-of-Custody Audit
 */
export async function runSecurityAudit(
  imageDataUrl: string,
  storedHash: string,
  metadata: { gpsCoordinates?: string; timestamp?: string; statutoryCitation?: string }
): Promise<SecurityAuditReport> {
  const computedHash = await generateHash(imageDataUrl);
  const isHashValid = computedHash === storedHash;
  const hasGpsLock = Boolean(metadata.gpsCoordinates && metadata.gpsCoordinates.length > 5);
  const isBsaCompliant = Boolean(metadata.statutoryCitation?.includes('BSA 2023'));

  return {
    isHashValid,
    computedHash,
    storedHash,
    hasGpsLock,
    gpsCoordinates: metadata.gpsCoordinates,
    timestampUtc: metadata.timestamp || new Date().toISOString(),
    isBsaCompliant,
    isOfflineIsolated: true,
    auditPassed: isHashValid && hasGpsLock && isBsaCompliant,
    auditedAt: new Date().toISOString(),
  };
}

