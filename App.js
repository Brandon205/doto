import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import TaskRenderer from './components/TaskRenderer';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.name}>Doto</Text>
      </View>
      <TaskRenderer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%'
  },
  navBar: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    backgroundColor: '#6800F4'
  },
  name: {
    color: '#F2E6FF',
    fontSize: 40,
    fontWeight: 'bold',
    padding: 5
  }
})
