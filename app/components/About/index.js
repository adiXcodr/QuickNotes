import * as React from 'react';
import { View, Linking } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

export default class AboutComponent extends React.Component {


  async openURL(url){
    await Linking.openURL(url);
  }

  componentDidMount(){
    
  }

  render() {
    return (
      <View style={{alignItems:'center',justifyContent:'center'}}>
            <Title style={{marginTop:50,fontSize:30}}>Quick Notes</Title>
            <Paragraph style={{marginHorizontal:'10%'}}>Quickly store notes on your device</Paragraph>
            <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:'10%',marginTop:30}}>
                <Button icon="web" mode="contained" style={{backgroundColor:'gray'}} onPress={() => this.openURL('https://github.com/adiXcodr/QuickNotes')} >
                  View on Github 
                </Button>
          </View>   
          <Title style={{marginTop:70,fontSize:25}}>Reach Me</Title>   
          <View style={{marginTop:30}}>
                <Avatar.Image size={150} source={{uri:'https://adittyadey.xyz/img/pp.jpg'}} /> 
          </View>
          <Title style={{marginTop:30,fontSize:20}}>Adittya Dey</Title>
            <Paragraph style={{marginHorizontal:'10%'}}>Full Stack Developer</Paragraph>
         
            
                <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:'2%',marginTop:30,flexDirection:'row'}}>
                <Button icon="phone" mode="contained" style={{backgroundColor:'#35B535',marginHorizontal:'5%'}} onPress={() => this.openURL('tel:7896186169')} >
                  Call Me
                </Button>
                <Button icon="mail" mode="contained" style={{backgroundColor:'#D44638',marginHorizontal:'5%'}} onPress={() => this.openURL('mailto:ichbinadittyadey@gmail.com')} >
                  Email 
                </Button>
          </View> 
      </View>
    );
  }
}


