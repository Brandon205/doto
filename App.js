import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskRenderer from './components/TaskRenderer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: '#19191B'}, headerTintColor: '#fff', headerTitleAlign: 'center', headerTitleStyle: {fontSize: 24, fontWeight: 'bold'}}}screenOptions={{headerStyle: {backgroundColor: '#19191B'}, headerTintColor: '#fff', headerTitleAlign: 'center', headerTitleStyle: {fontSize: 24, fontWeight: 'bold'}}}>
        <Stack.Screen name="Doto" component={TaskRenderer} options={{ title: 'TaskRenderer' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
