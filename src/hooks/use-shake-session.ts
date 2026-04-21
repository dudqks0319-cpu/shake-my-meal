import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { Accelerometer, type AccelerometerMeasurement } from 'expo-sensors';

import { SHAKE_CONFIG } from '@/src/config/shake-config';
import { getCountdownStartState, getVectorMagnitude, normalizeAccelerationToPercent, smoothSamples } from '@/src/domain/shake-math';

type ShakeStatus = 'idle' | 'active' | 'ended' | 'unsupported';

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

      if (intensity >= SHAKE_CONFIG.activeThresholdPercent) {
        lastMovementAtRef.current = Date.now();
        peakRef.current = Math.max(peakRef.current, intensity);
        setPeakIntensity(peakRef.current);
      }

      if (
        peakRef.current > 0 &&
        intensity < SHAKE_CONFIG.activeThresholdPercent &&
        Date.now() - lastMovementAtRef.current > SHAKE_CONFIG.stopAfterMs
      ) {
        stopListening();
        setStatus('ended');
      }
    },
    [stopListening]
  );

  const startSession = useCallback(async () => {
    setWarning(null);

    if (Platform.OS === 'web') {
      setStatus('unsupported');
      setWarning('웹 미리보기에서는 흔들기 센서를 사용할 수 없어요. 실제 기기에서 확인해 주세요.');
      return false;
    }

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
    Accelerometer.setUpdateInterval(SHAKE_CONFIG.updateIntervalMs);
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
