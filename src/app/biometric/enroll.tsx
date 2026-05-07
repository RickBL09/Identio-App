import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useBiometric } from '@/features/biometric/hooks/useBiometric';

export default function EnrollBiometricScreen() {
  const { enroll, isLoading } = useBiometric();

  const onEnroll = async () => {
    await enroll();
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enrolamiento facial</Text>
      <Text style={styles.text}>
        Placeholder listo para integrar camara y servicio de reconocimiento.
      </Text>
      <Pressable style={styles.button} onPress={onEnroll} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Procesando...' : 'Finalizar y entrar'}</Text>
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
    backgroundColor: '#00f5c4',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: { color: '#08101f', fontWeight: '700' },
});
