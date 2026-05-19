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
            animation: 'fade',
          }}>
          <Stack.Screen
            name="index"
            options={{
              contentStyle: { backgroundColor: '#050814' }
            }}
          />
          <Stack.Screen
            name="auth"
            options={{
              contentStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              contentStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="biometric/enroll"
            options={{
              presentation: 'modal',
              contentStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="biometric/verify"
            options={{
              presentation: 'modal',
              contentStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
          <Stack.Screen
            name="nfc/scan"
            options={{
              presentation: 'modal',
              contentStyle: { backgroundColor: '#FFFFFF' }
            }}
          />
        </Stack>
      </QueryClientProvider>
    </Provider>
  );
}