import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNfcAccess } from '@/features/access/hooks/useNfcAccess';

export default function NfcScanScreen() {
  const { isLoading, scanAccess } = useNfcAccess();
  const [result, setResult] = useState('Sin lectura');

  const onScan = async () => {
    const response = await scanAccess();
    setResult(
      `${response.allowed ? 'Permitido' : 'Denegado'} en ${response.location_id}`
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escaneo NFC</Text>
      <Text style={styles.text}>{result}</Text>
      <Pressable style={styles.button} onPress={onScan} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Escaneando...' : 'Iniciar escaneo'}</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Cerrar</Text>
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
