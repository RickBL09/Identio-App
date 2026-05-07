import { StyleSheet, Text, View } from 'react-native';
import { useAuditLogs } from '@/features/audit/hooks/useAuditLogs';

export default function AuditScreen() {
  const { data, isLoading } = useAuditLogs();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trazabilidad de accesos</Text>
      {isLoading ? (
        <Text style={styles.text}>Cargando accesos...</Text>
      ) : (
        data?.map((item) => (
          <Text key={item.id} style={styles.text}>
            - {item.event_type} / {item.location_id}
          </Text>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    padding: 24,
    gap: 8,
  },
  title: { color: '#e9eef7', fontSize: 24, fontWeight: '700', marginBottom: 10 },
  text: { color: '#c3cbe0' },
});
