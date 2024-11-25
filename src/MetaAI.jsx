import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import WABG from './assets/w_bg.png';
import CustomHeader from './components/CustomHeader';

const MetaAI = () => {
  return (
    <ImageBackground source={WABG} style={styles.container} resizeMode="cover">
      <CustomHeader />
    </ImageBackground>
  );
};

export default MetaAI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
