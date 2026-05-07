import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch } from '@/store';
import { initializeAuthThunk } from '@/store/slices/authSlice';

export default function SplashIndex() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const boot = async () => {
      const result = await dispatch(initializeAuthThunk());
      const token = result.payload as string | null | undefined;
      router.replace(token ? '/(tabs)/home' : '/auth/login');
    };
    void boot();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDENTIO</Text>
      <ActivityIndicator size="small" color="#00f5c4" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    color: '#e9eef7',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 3,
  },
});