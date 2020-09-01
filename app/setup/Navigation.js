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
import {
  StatusBar
} from "react-native";


const Stack = createStackNavigator();

export default class Start extends React.Component {
  state = {
    isLoading:true,
    theme:{}
  };
  
 

 componentDidMount(){
   
    StatusBar.setBackgroundColor(this.props.userTheme.accent, true);
    this.setState({isLoading:false,theme:this.props.userTheme});
    
 }

  
  render() {
            let theme=this.props.userTheme;
            return (

            
            <NavigationContainer>
                <Stack.Navigator
                screenOptions={{
                    gestureEnabled: true,
                    gestureDirection: 'vertical',
                    cardStyle: { backgroundColor: theme.accent },
                    ...TransitionPresets.RevealFromBottomAndroid,
                }}
                headerMode="float"
                initialRouteName="HomeContainer"
                >   


                    <Stack.Screen options={{ title: 'QNotes',
                        headerStyle: {
                            backgroundColor: theme.accent,
                            shadowColor: 'transparent',
                            elevation:0
                          },
                          headerTitleStyle:{color:theme.primary},
                          headerTintColor:theme.text,
                        
                         }} name="HomeContainer">
                        {props => <Home key={Date.now()} {...props} theme={theme}/>}
                    </Stack.Screen>
                    <Stack.Screen
                        options={{ title: 'Add Note',
                        headerStyle: {
                            backgroundColor: theme.accent,
                            shadowColor: 'transparent',
                            elevation:0
                          },
                          headerTitleStyle:{color:theme.text},
                          headerTintColor:theme.text
                         }}
                        name="AddNoteComponent"
                    >
                        {props => <AddNoteComponent {...props} theme={theme}/>}
                    </Stack.Screen>
                
                </Stack.Navigator>
            </NavigationContainer>
            );

  }
}


