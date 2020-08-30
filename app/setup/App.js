// In App.js in a new project

import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import primaryTheme from './Theme';
import Start from './Navigation';
import SplashScreenContainer from '../components/SplashScreen/index';
import SplashScreen from 'react-native-splash-screen'


export default class App extends React.Component {

  state={
      loading:true
  }

  async componentDidMount(){
    SplashScreen.hide();
    setTimeout(() => this.setState({loading:false}) , 1000);
  }

  render(){
    return (
 
      <PaperProvider theme={primaryTheme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={'#212121'}
          translucent={true}
        />
      {this.state.loading?
        <SplashScreenContainer/>
        :
        <Start />
      }
      </PaperProvider>
    
  );
  }
 
}

