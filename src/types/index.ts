/* ============================================================
   NarcoScan AI — Data Model Types
   ============================================================ */

export interface FieldTest {
  testId: string;
  caseId: string;
  officerId: string;
  reagentId: string;
  reagentName: string;
  sampleId: string;
  location: string;
  createdAt: string;
  status: 'draft' | 'image-uploaded' | 'analyzing' | 'completed';
}

export interface TestImage {
  imageId: string;
  testId: string;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  hash: string;
  capturedAt: string;
}

export interface ColourFeature {
  testId: string;
  r: number;
  g: number;
  b: number;
  L: number;
  a: number;
  labB: number;
  chroma: number;
  hue: number;
  signalStrength: number;
  extractionMethod: string;
}

export type ResultLabel = 'Positive' | 'Negative' | 'Inconclusive';

export interface AnalysisResult {
  testId: string;
  label: ResultLabel;
  confidence: number;
  explanation: string;
  rulesVersion: string;
}

export interface EvidenceRecord {
  evidenceId: string;
  testId: string;
  caseId: string;
  officerId: string;
  location: string;
  timestamp: string;
  reagent: string;
  sampleId: string;
  imageHash: string;
  colourFeatures: ColourFeature;
  result: AnalysisResult;
  createdAt: string;
  savedAt: string;
  recordVersion: string;
  gpsCoordinates?: string;
  calibrationStatus?: string;
  statutoryCitation?: string;
}

export interface TestRecord {
  test: FieldTest;
  image?: TestImage;
  colourFeatures?: ColourFeature;
  result?: AnalysisResult;
  evidence?: EvidenceRecord;
}

export interface Reagent {
  id: string;
  name: string;
  description: string;
  targetSubstance: string;
  positiveColour: string;
  hazardAlert?: string;
  kineticPeakSeconds?: number;
  secondaryRecommendation?: string;
}
