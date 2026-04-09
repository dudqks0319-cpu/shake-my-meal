import { useCallback, useEffect, useRef, useState } from 'react';

import { Accelerometer, type AccelerometerMeasurement } from 'expo-sensors';

import { getCountdownStartState, getVectorMagnitude, normalizeAccelerationToPercent, smoothSamples } from '@/src/domain/shake-math';

type ShakeStatus = 'idle' | 'active' | 'ended' | 'unsupported';

const UPDATE_INTERVAL = 50;
const ACTIVE_THRESHOLD = 12;
const STOP_AFTER_MS = 1200;

export function useShakeSession() {
  const [status, setStatus] = useState<ShakeStatus>('idle');
  const [liveIntensity, setLiveIntensity] = useState(0);
  const [peakIntensity, setPeakIntensity] = useState(0);
  const [warning, setWarning] = useState<string | null>(null);
  const samplesRef = useRef<number[]>([]);
  const subscriptionRef = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);
  const lastMovementAtRef = useRef(0);
  const peakRef = useRef(0);

  const stopListening = useCallback(() => {
    subscriptionRef.current?.remove();
    subscriptionRef.current = null;
  }, []);

  const handleMeasurement = useCallback(
    (measurement: AccelerometerMeasurement) => {
      const magnitude = getVectorMagnitude(measurement.x, measurement.y, measurement.z);
      const adjustedMagnitude = Math.max(0, magnitude - 1);
      const { nextSamples, average } = smoothSamples(samplesRef.current, adjustedMagnitude);
      samplesRef.current = nextSamples;
      const intensity = normalizeAccelerationToPercent(average);

      setLiveIntensity(intensity);

      if (intensity >= ACTIVE_THRESHOLD) {
        lastMovementAtRef.current = Date.now();
        peakRef.current = Math.max(peakRef.current, intensity);
        setPeakIntensity(peakRef.current);
      }

      if (
        peakRef.current > 0 &&
        intensity < ACTIVE_THRESHOLD &&
        Date.now() - lastMovementAtRef.current > STOP_AFTER_MS
      ) {
        stopListening();
        setStatus('ended');
      }
    },
    [stopListening]
  );

  const startSession = useCallback(async () => {
    setWarning(null);
    const available = await Accelerometer.isAvailableAsync().catch(() => false);

    if (!available) {
      setStatus('unsupported');
      setWarning('이 기기에서는 흔들기 센서를 사용할 수 없어요.');
      return false;
    }

    stopListening();
    samplesRef.current = [];
    peakRef.current = 0;
    lastMovementAtRef.current = Date.now();
    setPeakIntensity(0);
    setLiveIntensity(0);
    setStatus('active');
    Accelerometer.setUpdateInterval(UPDATE_INTERVAL);
    subscriptionRef.current = Accelerometer.addListener(handleMeasurement);
    return true;
  }, [handleMeasurement, stopListening]);

  const resetSession = useCallback(() => {
    stopListening();
    samplesRef.current = [];
    peakRef.current = 0;
    setLiveIntensity(0);
    setPeakIntensity(0);
    setWarning(null);
    setStatus('idle');
  }, [stopListening]);

  useEffect(() => stopListening, [stopListening]);

  return {
    status,
    liveIntensity,
    peakIntensity,
    warning,
    readyForCountdown: getCountdownStartState(peakIntensity),
    startSession,
    resetSession,
  };
}
