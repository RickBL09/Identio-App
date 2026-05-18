import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Image } from 'expo-image';

import { useAppSelector } from '@/store';

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);
  const { verified } = useLocalSearchParams<{ verified: string }>();
  
  const [isNfcActive, setIsNfcActive] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Update date and time every second
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (verified === 'true') {
      setIsNfcActive(true);
      // Keep NFC active for 90 seconds
      const timeout = setTimeout(() => {
        setIsNfcActive(false);
        router.setParams({ verified: 'false' });
      }, 90000);
      return () => clearTimeout(timeout);
    } else {
      setIsNfcActive(false);
    }
  }, [verified]);

  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: '2-digit',
    year: 'numeric'
  }).toUpperCase();

  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Text style={styles.timeText}>{formattedTime}</Text>
        </View>

        <View style={styles.idCardContainer}>
          <View style={styles.profileImageContainer}>
            <Image 
              source={require('@/assets/images/profile.svg')} 
              style={styles.profileIconPlaceholder}
              tintColor="#64748B"
              contentFit="cover"
            />
          </View>
          
          <Text style={styles.userName}>{user?.full_name?.toUpperCase() ?? 'Jhon Doe'}</Text>

          <View style={styles.roleBanner}>
            <Text style={styles.roleText}>ESTUDIANTE</Text>
          </View>

          <View style={styles.universityContainer}>
            <Text style={styles.universityText}>UNIVERSIDAD</Text>
            <Text style={styles.universityTextBold}>DEL NORTE</Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          {isNfcActive ? (
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Please hold your device near the NFC sensor to gain access.
              </Text>
            </View>
          ) : null}

          <Pressable 
            style={({ pressed }) => [
              styles.mainActionButton, 
              pressed && styles.mainActionButtonPressed,
              isNfcActive && styles.mainActionButtonActive
            ]} 
            onPress={() => {
              if (!isNfcActive) {
                router.push('/biometric/verify');
              }
            }}
          >
            <Image 
              source={isNfcActive ? require('@/assets/images/nfc.svg') : require('@/assets/images/facial_recognition.svg')} 
              style={styles.actionIcon}
              contentFit="contain"
              tintColor={isNfcActive ? '#FFFFFF' : '#38BDF8'}
            />
          </Pressable>
        </View>

        {/* Spacer for bottom tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 60,
    alignItems: 'center',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  dateText: { 
    color: '#64748B', 
    fontSize: 14, 
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 4,
  },
  timeText: { 
    color: '#38BDF8', 
    fontSize: 20, 
    fontWeight: '700',
  },
  idCardContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileIconPlaceholder: {
    width: 60,
    height: 60,
  },
  userName: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  userId: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 24,
  },
  roleBanner: {
    backgroundColor: '#38BDF8',
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
  },
  universityContainer: {
    alignItems: 'center',
  },
  universityText: {
    color: '#334155',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  universityTextBold: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  actionSection: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  instructionContainer: {
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  instructionText: {
    color: '#0369A1',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  mainActionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  mainActionButtonActive: {
    backgroundColor: '#38BDF8',
  },
  mainActionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  actionIcon: {
    width: 36,
    height: 36,
  },
});

