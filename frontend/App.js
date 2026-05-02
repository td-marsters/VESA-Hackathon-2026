import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Landing from './screens/Landing';
import Login from './screens/Login';
import Home from './screens/Home';
import HabitEntry from './screens/HabitEntry';
import Wallet from './screens/Wallet';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#F4C542',
        tabBarInactiveTintColor: '#555',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Habits"
        component={HabitEntry}
        options={{ tabBarIcon: ({ color }) => <Feather name="check-circle" size={22} color={color} /> }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{ tabBarIcon: ({ color }) => <Feather name="dollar-sign" size={22} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#111111',
    borderTopColor: '#222',
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    height: 65,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
