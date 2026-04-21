import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/src/styles/theme';

export function BowlMascot({ size = 96 }: { size?: number }) {
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: size * 0.26,
        },
      ]}
      accessibilityElementsHidden
    >
      <Text style={[styles.bowl, { fontSize: size * 0.48 }]}>🍚</Text>
      <Text style={[styles.spark, styles.left, { fontSize: size * 0.18 }]}>⌁</Text>
      <Text style={[styles.spark, styles.right, { fontSize: size * 0.18 }]}>⌁</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.line,
    shadowColor: theme.colors.shadow,
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  bowl: {
    includeFontPadding: false,
  },
  spark: {
    position: 'absolute',
    color: theme.colors.bowlDeep,
    fontWeight: '900',
  },
  left: {
    left: 10,
  },
  right: {
    right: 10,
  },
});
