import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { theme } from '@/src/styles/theme';

export default function RootLayout() {
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.colors.canvas,
      card: theme.colors.canvas,
      border: theme.colors.line,
      primary: theme.colors.bowl,
      text: theme.colors.ink,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.colors.canvas,
          },
        }}
      />
    </ThemeProvider>
  );
}
