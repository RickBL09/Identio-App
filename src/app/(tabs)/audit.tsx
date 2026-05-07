import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs';

export default function AuditScreen() {
  const { data, isLoading } = useAuditLogs();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={styles.subtitle}>Your access history</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#38BDF8" />
            <Text style={styles.loadingText}>Loading activity...</Text>
          </View>
        ) : data && data.length > 0 ? (
          data.map((item) => (
            <View key={item.id} style={styles.activityCard}>
              <View style={styles.activityDot} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityType}>{item.event_type}</Text>
                <Text style={styles.activityLocation}>{item.location_id}</Text>
              </View>
              <View style={styles.activityBadge}>
                <Text style={styles.activityBadgeText}>Access</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No activity recorded yet.</Text>
          </View>
        )}
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '400',
  },
  scrollContainer: {
    padding: 24,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 60,
    gap: 16,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 16,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 12,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#38BDF8',
    flexShrink: 0,
  },
  activityInfo: {
    flex: 1,
  },
  activityType: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityLocation: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '400',
  },
  activityBadge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activityBadgeText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
  },
});

