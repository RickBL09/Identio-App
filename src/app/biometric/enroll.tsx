import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform, Animated, Easing, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useBiometric } from '@/features/biometric/hooks/useBiometric';

export default function EnrollBiometricScreen() {
  const { enroll, isLoading } = useBiometric();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
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

  const handleStartEnrollment = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera access is required for facial enrollment.');
        return;
      }
    }

    setShowCamera(true);
  };

  const handleCapture = async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.8,
      });

      if (photo?.base64) {
        setCapturedImage(photo.base64);
        setShowCamera(false);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
    }
  };

  const handleEnroll = async () => {
    if (!capturedImage) {
      Alert.alert('No Image', 'Please capture a photo first.');
      return;
    }

    try {
      await enroll(capturedImage);
      Alert.alert('Success', 'Facial enrollment completed successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
      ]);
    } catch (error: any) {
      console.error('Enrollment error:', error);
      Alert.alert('Enrollment Failed', error.message || 'Failed to enroll. Please try again.');
      setCapturedImage(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setShowCamera(true);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#38BDF8" />
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Capture Your Face</Text>
          <Text style={styles.subtitle}>Position your face within the frame</Text>
        </View>

        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front">
            <View style={styles.overlay}>
              <View style={styles.frame} />
            </View>
          </CameraView>
        </View>

        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={handleCapture}
            disabled={isLoading}
          >
            <View style={styles.primaryButton}>
              <Text style={styles.buttonText}>Capture Photo</Text>
            </View>
          </Pressable>

          <Pressable style={styles.skipButton} onPress={() => setShowCamera(false)}>
            <Text style={styles.skipButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
          <View style={styles.header}>
            <Text style={styles.title}>Facial Enrollment</Text>
            <Text style={styles.subtitle}>Set up your biometric authentication</Text>
          </View>

          <View style={styles.card}>
            {capturedImage ? (
              <View style={styles.previewContainer}>
                <Text style={styles.instructionTitle}>Photo Captured</Text>
                <Text style={styles.instructionText}>
                  Review your photo and complete enrollment
                </Text>
                <View style={styles.previewImageContainer}>
                  <Image
                    source={{ uri: `data:image/jpeg;base64,${capturedImage}` }}
                    style={styles.previewImage}
                    contentFit="cover"
                  />
                </View>
              </View>
            ) : (
              <>
                <View style={styles.iconContainer}>
                  <Image
                    source={require('@/assets/images/facial_recognition.svg')}
                    style={styles.icon}
                    contentFit="contain"
                    tintColor="#38BDF8"
                  />
                </View>

                <Text style={styles.instructionTitle}>Ready to Enroll</Text>
                <Text style={styles.instructionText}>
                  Your facial biometric data will be securely captured and stored to enable quick and secure access to the system.
                </Text>

                <View style={styles.featureList}>
                  <View style={styles.featureItem}>
                    <View style={styles.featureBullet} />
                    <Text style={styles.featureText}>Secure facial recognition</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureBullet} />
                    <Text style={styles.featureText}>Fast authentication</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <View style={styles.featureBullet} />
                    <Text style={styles.featureText}>Privacy protected</Text>
                  </View>
                </View>
              </>
            )}

            {capturedImage ? (
              <>
                <Pressable
                  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                  onPress={handleEnroll}
                  disabled={isLoading}
                >
                  <View style={styles.primaryButton}>
                    <Text style={styles.buttonText}>
                      {isLoading ? 'Processing...' : 'Complete Enrollment'}
                    </Text>
                  </View>
                </Pressable>

                <Pressable style={styles.skipButton} onPress={handleRetake}>
                  <Text style={styles.skipButtonText}>Retake Photo</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                  onPress={handleStartEnrollment}
                  disabled={isLoading}
                >
                  <View style={styles.primaryButton}>
                    <Text style={styles.buttonText}>Start Enrollment</Text>
                  </View>
                </Pressable>

                <Pressable style={styles.skipButton} onPress={() => router.replace('/(tabs)/home')}>
                  <Text style={styles.skipButtonText}>Skip for now</Text>
                </Pressable>
              </>
            )}
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
  previewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  previewImageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#38BDF8',
    marginBottom: 24,
  },
  previewImage: {
    width: '100%',
    height: '100%',
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
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  icon: {
    width: 50,
    height: 50,
  },
  instructionTitle: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureList: {
    width: '100%',
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#38BDF8',
    marginRight: 12,
  },
  featureText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    width: '100%',
    marginTop: 8,
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
  skipButton: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
});
