import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';

import { useBiometric } from '@/features/biometric/hooks/useBiometric';
import { accessTokenService } from '@/services/access-token.service';

// Generate a UUID v4 compatible with Pydantic's uuid.UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function VerifyBiometricScreen() {
  const { isLoading, verify } = useBiometric();
  const [result, setResult] = useState<string | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const onVerify = async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      if (!photo?.base64) {
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
        return;
      }

      // Generate a UUID v4 for this verification attempt
      const sessionId = generateUUID();
      
      const response = await verify(photo.base64, sessionId);
      const matched = response.result === 'MATCH';
      setIsMatch(matched);
      setResult(`${response.result} (score ${response.score.toFixed(2)})`);
      
      // Only grant access if verification was successful
      if (matched) {
        // Store the access token for NFC transmission if provided
        if (response.access_token) {
          accessTokenService.setAccessToken(response.access_token, 90);
          console.log('Access token stored for NFC transmission');
        }
        
        setTimeout(() => {
          router.replace({ pathname: '/(tabs)/home', params: { verified: 'true' } });
        }, 1500);
      } else {
        // Show error for failed verification
        setTimeout(() => {
          Alert.alert(
            'Verification Failed',
            `Face verification failed: ${response.result}. Score: ${response.score.toFixed(2)}`,
            [{ text: 'Try Again', onPress: () => { setResult(null); setIsMatch(null); } }]
          );
        }, 1500);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Verification Failed', error.message || 'Failed to verify. Please try again.');
    }
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
      <View style={styles.permissionContainer}>
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
        <CameraView ref={cameraRef} style={styles.camera} facing="front">
          <View style={styles.overlay}>
            <View style={styles.frame} />
          </View>
        </CameraView>
      </View>

      <View style={styles.footer}>
        {result ? (
          <View style={[styles.resultContainer, isMatch === false && styles.resultContainerError]}>
            <Text style={[styles.resultText, isMatch === false && styles.resultTextError]}>
              {isMatch ? '✓ ' : '✗ '}Match: {result}
            </Text>
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
  permissionContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
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
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
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
  resultContainerError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  resultText: {
    color: '#059669',
    fontWeight: '700',
  },
  resultTextError: {
    color: '#DC2626',
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

