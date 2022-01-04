import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import TaskRenderer from './components/TaskRenderer';

export default function App() {
  return (
    <View>
      <View style={styles.navBar}>
        <Text style={styles.name}>Doto</Text>
      </View>
      <TaskRenderer />
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    width: Dimensions.get('window').width,
    height: 100,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'gray'
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    padding: 5
  }
})
