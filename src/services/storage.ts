/* ============================================================
   NarcoScan AI — Local Storage Service
   Persistence layer using localStorage
   ============================================================ */

import { TestRecord } from '../types';

const STORAGE_KEY = 'narcoscan_tests';

/**
 * Get all saved test records
 */
export function getAllTests(): TestRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TestRecord[];
  } catch {
    return [];
  }
}

/**
 * Save a test record (upsert by testId)
 */
export function saveTest(record: TestRecord): void {
  const tests = getAllTests();
  const idx = tests.findIndex(t => t.test.testId === record.test.testId);
  if (idx >= 0) {
    tests[idx] = record;
  } else {
    tests.unshift(record);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
}

/**
 * Get a single test by ID
 */
export function getTestById(testId: string): TestRecord | undefined {
  return getAllTests().find(t => t.test.testId === testId);
}

/**
 * Get test statistics
 */
export function getTestStats(): {
  total: number;
  inconclusive: number;
  evidenceRecords: number;
} {
  const tests = getAllTests();
  return {
    total: tests.length,
    inconclusive: tests.filter(t => t.result?.label === 'Inconclusive').length,
    evidenceRecords: tests.filter(t => t.evidence).length,
  };
}

/**
 * Delete a single test by ID
 */
export function deleteTest(testId: string): void {
  const tests = getAllTests().filter(t => t.test.testId !== testId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
}

/**
 * Clear all test records (for testing and administrative reset)
 */
export function clearAllTests(): void {
  localStorage.removeItem(STORAGE_KEY);
}

