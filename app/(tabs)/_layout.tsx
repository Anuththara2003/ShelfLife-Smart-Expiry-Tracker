import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext'; 
import { Colors } from '../../constants/Colors';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#EE5253', 
        tabBarInactiveTintColor: isDarkMode ? '#555' : '#999',
        tabBarStyle: {
          backgroundColor: theme.card, 
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 10,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.1,
        },
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
            title: 'Home', 
            tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="inventory" 
        options={{ 
            title: 'Inventory', 
            tabBarIcon: ({ color }) => <Ionicons name="list" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="additem" 
        options={{ 
            title: 'Add', 
            tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
            title: 'Profile', 
            tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} /> 
        }} 
      />

      <Tabs.Screen 
        name="edititem" 
        options={{ 
            href: null, 
        }} 
      />
    </Tabs>
  );
}