import { Link, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, Animated, Easing, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { MOCK_CREDENTIALS } from '@/mocks/data';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export default function LoginScreen() {
  const { auth, login, clearError } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fadeAnim = new Animated.Value(0);
  const translateYAnim = new Animated.Value(20);

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
  }, []);

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
      <LinearGradient
        colors={['#0A192F', '#020C1B']}
        style={StyleSheet.absoluteFillObject}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          <View style={styles.glassCard}>
            <BlurView intensity={20} tint="light" style={styles.blurContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@domain.com"
                  placeholderTextColor="#64748B"
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
                  placeholderTextColor="#64748B"
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
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>{auth.isLoading ? 'Authenticating...' : 'Sign In'}</Text>
                </LinearGradient>
              </Pressable>
              
              <View style={styles.footerLinks}>
                <Link href="/auth/register" style={styles.link}>
                  Create an account
                </Link>
                <Link href="/biometric/verify" style={styles.link}>
                  Face ID
                </Link>
              </View>
            </BlurView>
          </View>

          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>
              Demo: {MOCK_CREDENTIALS.email} / {MOCK_CREDENTIALS.password}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#FFFFFF', 
    fontSize: 36, 
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: { 
    color: '#94A3B8', 
    fontSize: 16,
    fontWeight: '400',
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurContainer: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  gradientButton: {
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
    color: '#475569', 
    fontSize: 12,
  },
});