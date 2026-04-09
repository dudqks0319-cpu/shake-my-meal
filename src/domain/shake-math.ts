const MAX_REFERENCE_G = 4.2;

export function getVectorMagnitude(x: number, y: number, z: number) {
  return Math.sqrt(x * x + y * y + z * z);
}

export function normalizeAccelerationToPercent(value: number, maxReferenceG = MAX_REFERENCE_G) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  const percent = (value / maxReferenceG) * 100;
  return Math.max(0, Math.min(100, Math.round(percent)));
}

export function smoothSamples(samples: number[], nextValue: number, maxSamples = 4) {
  const nextSamples = [...samples, nextValue].slice(-maxSamples);
  const average = nextSamples.reduce((sum, sample) => sum + sample, 0) / nextSamples.length;

  return {
    nextSamples,
    average,
  };
}

export function getCountdownStartState(peakIntensity: number) {
  return peakIntensity >= 15;
}
