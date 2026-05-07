import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0b1223',
          borderTopColor: '#1d2a4f',
        },
        tabBarActiveTintColor: '#00f5c4',
        tabBarInactiveTintColor: '#8b93a7',
      }}>
      <Tabs.Screen name="home" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="audit" options={{ title: 'Accesos' }} />
      <Tabs.Screen name="profile" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
