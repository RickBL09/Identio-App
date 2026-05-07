import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import { useAppSelector } from '@/store';

export default function HomeScreen() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A192F', '#020C1B']}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.full_name ?? 'User'}</Text>
          <Text style={styles.subtitle}>Security & Access Overview</Text>
        </View>

        <View style={styles.balanceCard}>
          <BlurView intensity={20} tint="light" style={styles.blurContainer}>
            <Text style={styles.balanceLabel}>Security Status</Text>
            <Text style={styles.balanceValue}>Protected</Text>
            <View style={styles.statusIndicator} />
          </BlurView>
        </View>

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <Pressable 
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]} 
            onPress={() => router.push('/biometric/verify')}
          >
            <LinearGradient
              colors={['rgba(56, 189, 248, 0.1)', 'rgba(37, 99, 235, 0.1)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionTitle}>Verify ID</Text>
              <Text style={styles.actionDesc}>Facial Recognition</Text>
            </LinearGradient>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]} 
            onPress={() => router.push('/nfc/scan')}
          >
            <LinearGradient
              colors={['rgba(56, 189, 248, 0.1)', 'rgba(37, 99, 235, 0.1)']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionIcon}>📱</Text>
              <Text style={styles.actionTitle}>NFC Scan</Text>
              <Text style={styles.actionDesc}>Physical Access</Text>
            </LinearGradient>
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
  },
  scrollContainer: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  greeting: { 
    color: '#FFFFFF', 
    fontSize: 28, 
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: { 
    color: '#94A3B8', 
    fontSize: 16, 
    marginTop: 4,
    fontWeight: '400',
  },
  balanceCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 32,
  },
  blurContainer: {
    padding: 24,
    position: 'relative',
  },
  balanceLabel: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  balanceValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
  },
  statusIndicator: {
    position: 'absolute',
    top: 24,
    right: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  actionCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  actionGradient: {
    padding: 20,
    alignItems: 'flex-start',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 12,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionDesc: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
  },
});
