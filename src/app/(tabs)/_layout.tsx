import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,
          left: 24,
          right: 24,
          elevation: 0,
          backgroundColor: 'transparent',
          borderRadius: 24,
          height: 64,
          borderWidth: 0,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 10,
          },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        tabBarBackground: () => (
          <View style={styles.blurContainer}>
            <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />
            <View style={styles.glassBorder} />
          </View>
        ),
        tabBarActiveTintColor: '#38BDF8',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 12,
          paddingBottom: 8,
        },
        tabBarItemStyle: {
          paddingTop: 8,
        }
      }}>
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/images/home.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="audit" 
        options={{ 
          title: 'Activity',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/images/activity.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image 
              source={require('@/assets/images/profile.svg')} 
              style={{ width: 24, height: 24 }} 
              tintColor={color} 
            />
          )
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  }
});

