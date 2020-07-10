import React, { Component } from 'react';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import styles from './style';

class SplashScreenContainer extends Component {


  async componentDidMount() {
    StatusBar.setBackgroundColor('#0099FF', true);
  }

  

  render() {
    return (
      <View style={styles.viewStyles}>
        
        <Text style={styles.textStyles}>Q Notes</Text>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }
}

export default SplashScreenContainer;
