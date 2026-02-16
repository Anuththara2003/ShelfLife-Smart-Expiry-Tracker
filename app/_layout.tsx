import { Stack } from 'expo-router';
import FlashMessage from "react-native-flash-message";
import { ThemeProvider } from '../constants/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" /> 
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <FlashMessage position="top" />
    </ThemeProvider>
  );
}