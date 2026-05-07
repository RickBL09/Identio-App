import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

import { useBiometric } from '@/features/biometric/hooks/useBiometric';

export default function VerifyBiometricScreen() {
  const { isLoading, verify } = useBiometric();
  const [result, setResult] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();

  const onVerify = async () => {
    const response = await verify();
    setResult(`${response.event_type} (score ${response.confidence_score.toFixed(2)})`);
    
    // After short delay, go back to home with verified state
    setTimeout(() => {
      router.replace({ pathname: '/(tabs)/home', params: { verified: 'true' } });
    }, 1500);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Camera Access Required</Text>
        <Text style={styles.text}>We need your permission to show the camera for facial recognition.</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Facial Verification</Text>
        <Text style={styles.subtitle}>Please position your face within the frame</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="front" />
        <View style={styles.overlay}>
          <View style={styles.frame} />
        </View>
      </View>

      <View style={styles.footer}>
        {result ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Match: {result}</Text>
          </View>
        ) : null}

        <Pressable 
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]} 
          onPress={onVerify} 
          disabled={isLoading}
        >
          <View style={styles.gradientButton}>
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Scanning...' : 'Scan Face'}
            </Text>
          </View>
        </Pressable>
        
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: { 
    color: '#0F172A', 
    fontSize: 24, 
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
  },
  text: { 
    color: '#64748B', 
    textAlign: 'center', 
    marginBottom: 24 
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 24,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#38BDF8',
    position: 'relative',
    backgroundColor: '#F8FAFC',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  frame: {
    width: 250,
    height: 300,
    borderWidth: 3,
    borderColor: '#38BDF8',
    borderRadius: 150,
    borderStyle: 'dashed',
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  resultContainer: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  resultText: {
    color: '#059669',
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#38BDF8',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
    marginHorizontal: 24,
  },
  buttonText: { 
    color: '#FFFFFF', 
    fontWeight: '700',
    fontSize: 16,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    paddingVertical: 16,
  },
  secondaryButtonText: { 
    color: '#64748B', 
    fontWeight: '600',
    fontSize: 16,
  },
});

