import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuthActions } from '@/features/auth/hooks/useAuthActions';

export default function RegisterScreen() {
  const { auth, register, clearError } = useAuthActions();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const onRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      clearError();
      setLocalError('Todos los campos son obligatorios.');
      return;
    }
    if (password !== confirmPassword) {
      clearError();
      setLocalError('Las contrasenas no coinciden.');
      return;
    }
    setLocalError('');
    const result = await register(fullName, email, password);
    if (result.meta.requestStatus === 'fulfilled') {
      router.push('/biometric/enroll');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nombre completo"
        placeholderTextColor="#8b93a7"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="email@dominio.com"
        placeholderTextColor="#8b93a7"
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="contrasena"
        placeholderTextColor="#8b93a7"
        style={styles.input}
        secureTextEntry
      />
      <TextInput
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="confirmar contrasena"
        placeholderTextColor="#8b93a7"
        style={styles.input}
        secureTextEntry
      />
      {localError ? <Text style={styles.error}>{localError}</Text> : null}
      {auth.error ? <Text style={styles.error}>{auth.error}</Text> : null}
      <Pressable style={styles.button} onPress={onRegister} disabled={auth.isLoading}>
        <Text style={styles.buttonText}>
          {auth.isLoading ? 'Creando cuenta...' : 'Continuar a enrolamiento'}
        </Text>
      </Pressable>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Volver a login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: { color: '#e9eef7', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  input: {
    backgroundColor: '#0d1529',
    borderColor: '#1d2a4f',
    borderWidth: 1,
    borderRadius: 10,
    color: '#e9eef7',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  error: { color: '#ff7070' },
  button: {
    marginTop: 8,
    backgroundColor: '#00f5c4',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#08101f', fontWeight: '700' },
  backButton: { alignItems: 'center', marginTop: 8 },
  backButtonText: { color: '#00f5c4' },
});