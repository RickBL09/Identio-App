import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';

import { store } from '@/store';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#050814' },
            animation: 'fade',
          }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="biometric/enroll" options={{ presentation: 'modal' }} />
          <Stack.Screen name="biometric/verify" options={{ presentation: 'modal' }} />
          <Stack.Screen name="nfc/scan" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </Provider>
  );
}