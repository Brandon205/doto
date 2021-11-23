import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Soon from './components/Soon';
import Later from './components/Later';
import Eventually from './components/Eventually';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Soon} options={{ title: 'Soon' }} />
        <Stack.Screen name="Later" component={Later} options={{ title: 'Later' }} />
        <Stack.Screen name="Eventually" component={Eventually} options={{ title: 'Eventually' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItem: {
    textAlign: 'center'
  }
});
