import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppSelector } from '@/store';

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inicio</Text>
      <Text style={styles.subtitle}>Resumen de seguridad y accesos</Text>
      <Text style={styles.subtitle}>Hola, {user?.full_name ?? 'Usuario'}.</Text>

      <Pressable style={styles.primaryButton} onPress={() => router.push('/biometric/verify')}>
        <Text style={styles.primaryButtonText}>Verificar identidad</Text>
      </Pressable>

      <Pressable style={styles.secondaryButton} onPress={() => router.push('/nfc/scan')}>
        <Text style={styles.secondaryButtonText}>Escanear acceso NFC</Text>
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
  title: { color: '#e9eef7', fontSize: 30, fontWeight: '700' },
  subtitle: { color: '#8b93a7', marginBottom: 12 },
  primaryButton: {
    backgroundColor: '#00f5c4',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  primaryButtonText: { color: '#08101f', fontWeight: '700' },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2b3d6f',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: { color: '#d3dbec' },
});
