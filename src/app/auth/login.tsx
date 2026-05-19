import { Link, router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export default function LoginScreen() {
  const { auth, login, clearError } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeAnim, translateYAnim]);

  const onLogin = async () => {
    if (!email.trim() || !password.trim()) {
      clearError();
      return;
    }

    const result = await login(email.trim(), password.trim());
    if (result.meta.requestStatus === 'fulfilled') {
      router.replace('/(tabs)/home');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@domain.com"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                secureTextEntry
              />
            </View>

            {auth.error ? <Text style={styles.error}>{auth.error}</Text> : null}

            <Pressable 
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed
              ]} 
              onPress={onLogin} 
              disabled={auth.isLoading}
            >
              <View style={styles.primaryButton}>
                <Text style={styles.buttonText}>{auth.isLoading ? 'Authenticating...' : 'Sign In'}</Text>
              </View>
            </Pressable>
            
            <View style={styles.footerLinks}>
              <Link href="/auth/register" style={styles.link}>
                Create an account
              </Link>
              <Link href="/biometric/verify" style={styles.link}>
                Face ID
              </Link>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: { 
    color: '#0F172A', 
    fontSize: 36, 
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: { 
    color: '#64748B', 
    fontSize: 16,
    fontWeight: '400',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 16,
    color: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  primaryButton: {
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingHorizontal: 8,
  },
  link: { 
    color: '#38BDF8', 
    fontSize: 14,
    fontWeight: '600',
  },
  error: { 
    color: '#EF4444',
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  hintContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  hintText: { 
    color: '#94A3B8', 
    fontSize: 12,
  },
});