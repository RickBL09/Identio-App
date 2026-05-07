import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useProfile } from '@/features/profile/hooks/useProfile';

export default function ProfileScreen() {
  const { user, logout } = useProfile();

  const onLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.text}>Nombre: {user?.full_name ?? '-'}</Text>
      <Text style={styles.text}>Email: {user?.email ?? '-'}</Text>
      <Text style={styles.text}>Rol: {user?.roles?.[0]?.name ?? '-'}</Text>
      <Text style={styles.text}>Estado: {user?.status ?? '-'}</Text>

      <Pressable style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Cerrar sesion</Text>
      </Pressable>
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
  title: { color: '#e9eef7', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  text: { color: '#c3cbe0' },
  button: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#2b3d6f',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
  },
  buttonText: { color: '#d3dbec' },
});
