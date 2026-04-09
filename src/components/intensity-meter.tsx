import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/styles/theme';

type IntensityMeterProps = {
  value: number;
  label?: string;
};

export function IntensityMeter({ value, label = '흔들기 강도' }: IntensityMeterProps) {
  const width = `${Math.max(0, Math.min(100, value))}%` as `${number}%`;
  const zone =
    value <= 30
      ? { label: '가볍게', color: theme.colors.mint }
      : value <= 70
        ? { label: '딱 적당해', color: theme.colors.bowl }
        : { label: '오늘은 푸짐하게', color: theme.colors.soup };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.round(value)}%</Text>
      </View>
      <View style={[styles.zonePill, { backgroundColor: `${zone.color}22` }]}>
        <Text style={[styles.zoneText, { color: zone.color }]}>{zone.label}</Text>
      </View>
      <View style={styles.track}>
        <View style={styles.zoneSegments}>
          <View style={[styles.zoneSegment, styles.zoneLight]} />
          <View style={[styles.zoneSegment, styles.zoneMedium]} />
          <View style={[styles.zoneSegment, styles.zoneHeavy]} />
        </View>
        <View style={[styles.fill, { width }]} />
      </View>
      <View style={styles.legend}>
        <Text style={styles.legendText}>살살</Text>
        <Text style={styles.legendText}>보통</Text>
        <Text style={styles.legendText}>미친듯이</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.body,
    fontWeight: '600',
  },
  zonePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 5,
    borderRadius: theme.radius.pill,
  },
  zoneText: {
    fontSize: theme.fontSize.caption,
    fontWeight: '800',
  },
  value: {
    color: theme.colors.ink,
    fontSize: theme.fontSize.bodyLarge,
    fontWeight: '800',
  },
  track: {
    height: 18,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.surfaceMuted,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.line,
  },
  zoneSegments: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  zoneSegment: {
    flex: 1,
  },
  zoneLight: {
    backgroundColor: '#DFF6E8',
  },
  zoneMedium: {
    backgroundColor: '#FFE7C7',
  },
  zoneHeavy: {
    backgroundColor: '#FFD7CF',
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.bowl,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendText: {
    color: theme.colors.inkSoft,
    fontSize: theme.fontSize.caption,
  },
});
