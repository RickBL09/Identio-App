import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MOCK_CREDENTIALS } from '@/mocks/data';
import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export default function LoginScreen() {
  const { auth, login, clearError } = useAuthActions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesion</Text>
      <Text style={styles.subtitle}>Acceso mock (frontend)</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@dominio.com"
        placeholderTextColor="#8b93a7"
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="contrasena"
        placeholderTextColor="#8b93a7"
        style={styles.input}
        secureTextEntry
      />

      {auth.error ? <Text style={styles.error}>{auth.error}</Text> : null}

      <Pressable style={styles.button} onPress={onLogin} disabled={auth.isLoading}>
        <Text style={styles.buttonText}>{auth.isLoading ? 'Entrando...' : 'Entrar'}</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.push('/biometric/verify')}>
        <Text style={styles.secondaryButtonText}>Login facial (placeholder)</Text>
      </Pressable>

      <Link href="/auth/register" style={styles.link}>
        Crear cuenta
      </Link>
      <Text style={styles.hint}>
        Demo: {MOCK_CREDENTIALS.email} / {MOCK_CREDENTIALS.password}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  title: { color: '#e9eef7', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#8b93a7', marginBottom: 8 },
  input: {
    backgroundColor: '#0d1529',
    borderColor: '#1d2a4f',
    borderWidth: 1,
    borderRadius: 10,
    color: '#e9eef7',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#00f5c4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#08101f', fontWeight: '700' },
  secondaryButton: {
    borderRadius: 10,
    borderColor: '#2b3d6f',
    borderWidth: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#d3dbec' },
  error: { color: '#ff7070' },
  link: { color: '#00f5c4', marginTop: 8 },
  hint: { color: '#8b93a7', marginTop: 4, fontSize: 12 },
});