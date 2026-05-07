import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useBiometric } from '@/features/biometric/hooks/useBiometric';

export default function VerifyBiometricScreen() {
  const { isLoading, verify } = useBiometric();
  const [result, setResult] = useState('Resultado pendiente');

  const onVerify = async () => {
    const response = await verify();
    setResult(`${response.event_type} (score ${response.confidence_score.toFixed(2)})`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificacion facial</Text>
      <Text style={styles.text}>Resultado mock: {result}</Text>
      <Pressable style={styles.button} onPress={onVerify} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Verificando...' : 'Ejecutar verificacion'}</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Volver</Text>
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
  title: { color: '#e9eef7', fontSize: 24, fontWeight: '700' },
  text: { color: '#c3cbe0' },
  button: {
    borderWidth: 1,
    borderColor: '#2b3d6f',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: { color: '#d3dbec', fontWeight: '600' },
});
