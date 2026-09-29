/* ============================================================
   NarcoScan AI — Analysis Engine
   Prototype decision logic for colour-reaction screening
   ============================================================ */

import { ColourFeature, AnalysisResult, ResultLabel } from '../../types';
import {
  rgbToLab,
  calcChroma,
  calcHue,
  calcSignalStrength,
  extractCenterColour,
  loadImageData,
  checkImageQuality,
} from '../../utils/colourScience';
import { generateId } from '../../utils/crypto';

const RULES_VERSION = 'prototype-v1.0';

export interface AnalysisProgress {
  step: number;
  totalSteps: number;
  message: string;
}

export interface FullAnalysisResult {
  colourFeatures: ColourFeature;
  result: AnalysisResult;
  qualityMessage: string;
}

/**
 * Run the full colour analysis pipeline on an image
 * Returns progress callbacks for UI updates
 */
export async function analyzeImage(
  dataUrl: string,
  testId: string,
  reagentId: string,
  onProgress: (progress: AnalysisProgress) => void
): Promise<FullAnalysisResult> {
  const totalSteps = 4;

  // Step 1: Load image
  onProgress({ step: 1, totalSteps, message: 'Reading image data...' });
  await delay(600);

  let imageData: ImageData;
  try {
    imageData = await loadImageData(dataUrl);
  } catch (error) {
    // FR-05: If pixel access fails, return explicit fallback/inconclusive
    return createInconclusiveResult(
      testId,
      `Failed to read image data: ${(error as Error).message}. This may be due to browser security restrictions.`
    );
  }

  // Step 2: Extract colour
  onProgress({ step: 2, totalSteps, message: 'Extracting colour features...' });
  await delay(500);

  const quality = checkImageQuality(imageData);
  const rgb = extractCenterColour(imageData);

  // Step 3: Convert colour space
  onProgress({ step: 3, totalSteps, message: 'Converting to CIELAB colour space...' });
  await delay(500);

  const lab = rgbToLab(rgb.r, rgb.g, rgb.b);
  const chroma = calcChroma(lab.a, lab.b);
  const hue = calcHue(lab.a, lab.b);
  const signalStrength = calcSignalStrength(chroma);

  const colourFeatures: ColourFeature = {
    testId,
    r: rgb.r,
    g: rgb.g,
    b: rgb.b,
    L: lab.L,
    a: lab.a,
    labB: lab.b,
    chroma,
    hue,
    signalStrength,
    extractionMethod: 'center-region-40pct',
  };

  // Step 4: Generate result
  onProgress({ step: 4, totalSteps, message: 'Applying prototype decision rules...' });
  await delay(500);

  // Apply prototype decision logic
  const result = applyDecisionRules(colourFeatures, quality.overallOk, reagentId);

  return {
    colourFeatures,
    result,
    qualityMessage: quality.message,
  };
}

/**
 * Prototype decision engine (Section 7.5 of spec)
 * 
 * IMPORTANT: These are PROTOTYPE demonstration rules.
 * Production requires validated reference comparison and experimental thresholds.
 */
function applyDecisionRules(
  features: ColourFeature,
  imageQualityOk: boolean,
  reagentId: string
): AnalysisResult {
  const testId = features.testId;

  // Rule 1: Sensor / Lighting Failure (Pitch black or blown glare) → Inconclusive
  if (!imageQualityOk) {
    return {
      testId,
      label: 'Inconclusive',
      confidence: 0.2,
      explanation:
        'Optical sensor illumination failure: Image is completely black or severely glare-saturated. Ensure the spot plate is evenly illuminated and unobstructed, then retake photo.',
      rulesVersion: RULES_VERSION,
    };
  }

  // Rule 2: Evaluate reagent-specific presumptive rules
  const label = evaluateReagentRules(features, reagentId);
  const confidence = calculateConfidence(features);

  const explanations: Record<ResultLabel, string> = {
    Positive:
      `Presumptive Positive: Optical chroma analysis detected chromatic shift consistent with target narcotic reaction for selected reagent (Chroma: ${features.chroma}, L*: ${features.L}). Indicative finding for seizure documentation.`,
    Negative:
      `Presumptive Negative: No target chromatic transition detected. Reagent baseline colour remains unreacted (Chroma: ${features.chroma}, Signal: ${features.signalStrength}%). Sample does not exhibit presumptive characteristics of target narcotic class.`,
    Inconclusive:
      `Presumptive Inconclusive: Chromatic transition detected (Chroma: ${features.chroma}), but spectral signature does not match standard positive reaction profiles for this reagent. Possible cutting agent, adulterant, or mixed matrix. Mandatory secondary screening required under NCB SI 1/88.`,
  };

  return {
    testId,
    label,
    confidence,
    explanation: explanations[label],
    rulesVersion: RULES_VERSION,
  };
}

/**
 * Reagent-specific prototype evaluation
 * 
 * Rules:
 * - Positive: Colour coordinates match the specific chemical reaction
 * - Negative: Low chroma / baseline unreacted spot (clear/white/pale)
 * - Inconclusive: Significant colour shift (adulterant/dye) that doesn't match standard positive target
 */
function evaluateReagentRules(features: ColourFeature, reagentId: string): ResultLabel {
  const { L, a, labB, chroma } = features;

  // If low chroma, there is NO chemical reaction -> NEGATIVE
  if (chroma < 14) {
    return 'Negative';
  }

  switch (reagentId) {
    case 'marquis':
      // Marquis:
      // Opiates (Heroin/Morphine): Dark Purple / Violet (positive a*, negative b* or low L* with purple tones)
      if ((a > 2 && labB < 5 && chroma > 12) || (L < 45 && chroma > 12 && a > -5 && labB < 15)) {
        return 'Positive';
      }
      // Amphetamines / Meth: Orange-brown (positive a*, positive b*)
      if (a > 5 && labB > 10 && chroma > 15) {
        return 'Positive';
      }
      // Contaminant / Adulterated color that doesn't match Marquis target
      return 'Inconclusive';

    case 'scott':
      // Scott: Cocaine -> Vivid Cobalt Blue (negative b*, negative to neutral a*)
      if (labB < -15 && chroma > 12) {
        return 'Positive';
      }
      if (labB < -5 && a < 15 && chroma > 12) {
        return 'Positive';
      }
      return 'Inconclusive';

    case 'duquenois':
      // Duquenois-Levine: THC / Cannabis -> Violet / Purple (positive a*, negative b*)
      if (a > 3 && labB < 0 && chroma > 12) {
        return 'Positive';
      }
      return 'Inconclusive';

    case 'ehrlich':
      // Ehrlich: LSD / Indoles -> Purple / Magenta / Pink (positive a*, moderate to high chroma)
      if (a > 10 && chroma > 12) {
        return 'Positive';
      }
      if (a > 3 && labB < 8 && chroma > 12) {
        return 'Positive';
      }
      return 'Inconclusive';

    case 'mecke':
      // Mecke: Opiates / MDMA -> Blue-green / Deep Green (negative a*)
      if (a < -3 && chroma > 12) {
        return 'Positive';
      }
      if (a < 5 && labB < -5 && chroma > 12) {
        return 'Positive';
      }
      return 'Inconclusive';

    case 'mandelin':
      // Mandelin: Dark Olive / Brown / Orange (low L*, moderate chroma)
      if (L < 45 && chroma > 10) {
        return 'Positive';
      }
      return 'Inconclusive';

    case 'simon':
      // Simon: Secondary Amines -> Deep Blue (negative b*)
      if (labB < -15 && chroma > 12) {
        return 'Positive';
      }
      return 'Inconclusive';

    case 'froehde':
      // Froehde: Opiates / Opioids -> Purple / Dark Blue
      if ((a > 2 && labB < 5 && chroma > 12) || (labB < -10 && chroma > 12)) {
        return 'Positive';
      }
      return 'Inconclusive';

    default:
      if (chroma > 15) return 'Positive';
      return 'Negative';
  }
}

/**
 * Calculate a prototype confidence score (0-1)
 */
function calculateConfidence(features: ColourFeature): number {
  const chromaFactor = Math.min(1, features.chroma / 80);
  const signalFactor = features.signalStrength / 100;
  return Math.round((chromaFactor * 0.5 + signalFactor * 0.5) * 100) / 100;
}

/**
 * Create an inconclusive result for error cases
 */
function createInconclusiveResult(
  testId: string,
  explanation: string
): FullAnalysisResult {
  return {
    colourFeatures: {
      testId,
      r: 0, g: 0, b: 0,
      L: 0, a: 0, labB: 0,
      chroma: 0, hue: 0,
      signalStrength: 0,
      extractionMethod: 'fallback-error',
    },
    result: {
      testId,
      label: 'Inconclusive',
      confidence: 0,
      explanation,
      rulesVersion: RULES_VERSION,
    },
    qualityMessage: explanation,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
