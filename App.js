import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import TaskRenderer from './components/TaskRenderer';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navBar}>
        <Text style={styles.name}>Doto</Text>
      </View>
      <TaskRenderer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
  },
  navBar: {
    width: '100%',
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
