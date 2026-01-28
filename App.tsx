import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens Import
import LoginScreen from './app/LoginScreen';
import SignUpScreen from './app/signup';
import Dashboard from './app/dashboard';
import Inventory from './app/inventory';
import AddItem from './app/additem';
import Profile from './app/profile';
import EditItem from './app/edititem';

// Theme Context සහ Colors Import කිරීම
import { ThemeProvider, useTheme } from '../ShelfLife/constants/ThemeContext';
import { Colors } from './constants/Colors';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  MainTabs: undefined;
  EditItem: { itemId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// 1. යටින් තියෙන ටැබ් පද්ධතිය (Bottom Tabs)
function MainTabs() {
  // පොදු Theme එක මෙතනට ලබා ගැනීම
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  return (
    <Tab.Navigator
      id="main-tabs"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#EE5253',
        tabBarInactiveTintColor: 'gray',
        // මෙන්න මෙතන තමයි Footer එකේ පාට මාරු වෙන්නේ
        tabBarStyle: { 
          backgroundColor: theme.card, // Dark mode එකේදී කළු/තද අළු පාට වේ
          height: 60, 
          paddingBottom: 10,
          borderTopWidth: isDarkMode ? 0 : 1, // Dark mode එකේදී උඩ ඉර අයින් කරයි
          elevation: 10 
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Inventory') iconName = focused ? 'list' : 'list-outline';
          else if (route.name === 'Add') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Inventory" component={Inventory} />
      <Tab.Screen name="Add" component={AddItem} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// 2. ප්‍රධාන Navigator එක (ThemeProvider එකෙන් Wrap කර ඇත)
export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator id="root" initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} /> 
          <Stack.Screen name="EditItem" component={EditItem} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}