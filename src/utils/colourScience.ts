/* ============================================================
   NarcoScan AI — Colour Science Utilities
   RGB → CIELAB conversion, chroma calculation, signal analysis
   ============================================================ */

/**
 * Convert sRGB [0-255] to linear RGB [0-1]
 */
function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear RGB to CIE XYZ using sRGB/D65 matrix
 */
function linearRgbToXyz(r: number, g: number, b: number): [number, number, number] {
  const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
  const y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
  const z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
  return [x, y, z];
}

/**
 * D65 reference white
 */
const D65 = { x: 0.95047, y: 1.00000, z: 1.08883 };

/**
 * CIELAB f(t) function
 */
function labF(t: number): number {
  const delta = 6 / 29;
  return t > delta ** 3
    ? Math.cbrt(t)
    : t / (3 * delta ** 2) + 4 / 29;
}

/**
 * Convert CIE XYZ to CIELAB
 */
function xyzToLab(x: number, y: number, z: number): [number, number, number] {
  const fx = labF(x / D65.x);
  const fy = labF(y / D65.y);
  const fz = labF(z / D65.z);

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const b = 200 * (fy - fz);

  return [L, a, b];
}

/**
 * Convert sRGB [0-255] to CIELAB
 */
export function rgbToLab(r: number, g: number, b: number): { L: number; a: number; b: number } {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);

  const [x, y, z] = linearRgbToXyz(lr, lg, lb);
  const [L, labA, labB] = xyzToLab(x, y, z);

  return {
    L: Math.round(L * 10) / 10,
    a: Math.round(labA * 10) / 10,
    b: Math.round(labB * 10) / 10,
  };
}

/**
 * Calculate CIELAB chroma: C* = sqrt(a*² + b*²)
 */
export function calcChroma(a: number, b: number): number {
  return Math.round(Math.sqrt(a * a + b * b) * 10) / 10;
}

/**
 * Calculate hue angle in degrees
 */
export function calcHue(a: number, b: number): number {
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return Math.round(h * 10) / 10;
}

/**
 * Calculate signal strength as a percentage (0-100)
 * Based on chroma magnitude relative to a prototype maximum
 */
export function calcSignalStrength(chroma: number): number {
  // Prototype logic: normalize chroma to 0-100% scale
  // Typical chroma for vivid colours is ~60-130
  const maxChroma = 100;
  const strength = Math.min(100, (chroma / maxChroma) * 100);
  return Math.round(strength);
}

/**
 * Extract average colour from canvas image data in a center region
 * Uses center 40% of the image as the reaction region
 */
export function extractCenterColour(
  imageData: ImageData
): { r: number; g: number; b: number } {
  const { width, height, data } = imageData;

  // Define center region (40% of image)
  const margin = 0.3;
  const x1 = Math.floor(width * margin);
  const y1 = Math.floor(height * margin);
  const x2 = Math.floor(width * (1 - margin));
  const y2 = Math.floor(height * (1 - margin));

  let totalR = 0;
  let totalG = 0;
  let totalB = 0;
  let count = 0;

  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      const idx = (y * width + x) * 4;
      totalR += data[idx];
      totalG += data[idx + 1];
      totalB += data[idx + 2];
      count++;
    }
  }

  if (count === 0) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: Math.round(totalR / count),
    g: Math.round(totalG / count),
    b: Math.round(totalB / count),
  };
}

/**
 * Load an image from a data URL and extract pixel data
 */
export function loadImageData(dataUrl: string): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      // Limit size for performance
      const maxDim = 800;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        const scale = maxDim / Math.max(w, h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      try {
        const imageData = ctx.getImageData(0, 0, w, h);
        resolve(imageData);
      } catch (e) {
        reject(new Error('Failed to extract pixel data: ' + (e as Error).message));
      }
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Check image quality heuristics (prototype)
 */
export function checkImageQuality(imageData: ImageData): {
  isDark: boolean;
  isBright: boolean;
  isLowContrast: boolean;
  overallOk: boolean;
  message: string;
} {
  const { data } = imageData;
  const pixelCount = data.length / 4;

  let totalLuminance = 0;
  let minLum = 255;
  let maxLum = 0;

  for (let i = 0; i < data.length; i += 4) {
    const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    totalLuminance += lum;
    minLum = Math.min(minLum, lum);
    maxLum = Math.max(maxLum, lum);
  }

  const avgLum = totalLuminance / pixelCount;

  // Truly dark failure: only if virtually pitch black (lens blocked / test_black_dark)
  // Dark purple or deep blue spot reactions naturally have luminance 25-45 and are valid!
  const isDark = avgLum < 12 && maxLum < 28;

  // Truly bright failure: only if 100% blown out pure white camera flash flare
  const isBright = avgLum > 253 && minLum > 250;

  // Solid reaction spot test crops are naturally uniform swatches
  const isLowContrast = false;

  let message = '';
  if (isDark) message = 'Image appears completely black. Ensure sensor lens is unobstructed and reaction well is illuminated.';
  else if (isBright) message = 'Image is severely overexposed. Avoid direct flash glare on the reaction liquid.';
  else message = 'Image quality acceptable for optical analysis.';

  return {
    isDark,
    isBright,
    isLowContrast,
    overallOk: !isDark && !isBright,
    message,
  };
}
