// In App.js in a new project

import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar,LogBox } from 'react-native';
import Start from './Navigation';
import SplashScreenContainer from '../components/SplashScreen/index';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage';
import { DefaultTheme } from 'react-native-paper';
import {fonts} from './Constants';

LogBox.ignoreAllLogs(
  [
    'VirtualizedLists should never be nested', 
  ]
);

export default class App extends React.Component {

  
  state={
      loading:true,
      theme:{},
      primaryTheme:{}
  }

  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@theme_data')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
      return(null);
    }
  }

  async setColors(){
    let theme=await this.getData();
    if(!theme){
      let mode='dark', primary='#f7b621', background='#212121', text='white', accent='#212121';
      theme={mode,primary,background,text,accent};
    }
    const primaryTheme = {
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: theme.primary,
        background: theme.background,
        accent: theme.accent,
        surface: theme.accent,
        text:theme.text,
        placeholder:theme.text
      },
      fonts: {
        ...DefaultTheme.fonts,
        regular: { fontFamily: fonts.regular },
        medium: { fontFamily: fonts.bold },
      },
    };
    this.setState({theme:theme,primaryTheme:primaryTheme});
  }

  async componentDidMount(){
    SplashScreen.hide();
    setTimeout(() => this.setState({loading:false}) , 1000);
    this.setColors();
  }

  render(){
    

    return (
      Object.keys(this.state.theme).length!=0?
      <PaperProvider theme={this.state.primaryTheme}>
        <StatusBar
          barStyle={this.state.theme.mode!='light'?"light-content":"dark-content"}
          backgroundColor={this.state.theme.accent}
          translucent={true}
        />
      {this.state.loading?
        <SplashScreenContainer/>
        :
        <Start userTheme={this.state.theme}/>
      }
      </PaperProvider>
      :null
    
  );
  }
 
}

