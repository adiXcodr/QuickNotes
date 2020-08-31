import React, { Component } from 'react';
import { View, Text, StatusBar, ActivityIndicator } from 'react-native';
import styles from './style';

class SplashScreenContainer extends Component {

  state={
    
  }

   componentDidMount() {
    StatusBar.setBackgroundColor('#f7b621', true);
    
  }

  

  render() {
    return (
      <View style={{flex:1,backgroundColor:'#f7b621',alignItems:'center',justifyContent:'center'}}>
        
        <Text style={{color:'white',fontSize:40,marginBottom:20}}>QNotes</Text>
        <ActivityIndicator size="large" color="white" />
        <Text style={{color:'white',fontSize:20,marginTop:20}}>A Fast Notemaking App</Text>
      </View>
    );
  }
}

export default SplashScreenContainer;
