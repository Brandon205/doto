import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Link } from 'react-router-native';
import Soon from './components/Soon';
import Later from './components/Later';

export default function App() {
  return (
    <NativeRouter>
      <View>
        <View>
        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
          <Text>Home</Text>
        </Link>
        </View>

        <Route exact path='/' component={Soon} />
        <Route exact path='/Later' component={Later} />
      </View>
    </NativeRouter>
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
