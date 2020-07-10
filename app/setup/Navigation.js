// Here Goes the different screens for Navigation

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import Home from '../components/Home';
import AddNoteComponent from '../components/AddNote/index';



const Stack = createStackNavigator();

export default class Start extends React.Component {
  state = {
    isLoading:true
  };
  
 

 componentDidMount(){
    let start = new Date().getTime();
    let seconds=0;
    while(seconds<=5){
        let end = new Date().getTime();
        let diff = end - start;
        seconds = Math.floor(diff / 1000 % 60);
    }
    if(seconds>5){
        this.setState({isLoading:false});
    }
    console.log(seconds)
    
 }

  
  render() {
   
            return (
            <NavigationContainer>
                <Stack.Navigator
                screenOptions={{
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                    cardStyle: { backgroundColor: '#212121' },
                    ...TransitionPresets.RevealFromBottomAndroid,
                }}
                headerMode="float"
                initialRouteName="HomeContainer"
                >
                    <Stack.Screen options={{ title: 'QNotes',
                        headerStyle: {
                            backgroundColor: '#212121',
                          },
                          headerTitleStyle:{color:'#0099FF'},
                          headerTintColor:'white'
                         }} name="HomeContainer">
                        {props => <Home key={Date.now()} {...props} />}
                    </Stack.Screen>
                    <Stack.Screen
                        options={{ title: 'Add Note',
                        headerStyle: {
                            backgroundColor: '#212121',
                          },
                          headerTitleStyle:{color:'white'},
                          headerTintColor:'white'
                         }}
                        name="AddNoteComponent"
                    >
                        {props => <AddNoteComponent {...props} />}
                    </Stack.Screen>
                
                </Stack.Navigator>
            </NavigationContainer>
            );

  }
}


