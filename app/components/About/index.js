import * as React from 'react';
import { View, Linking ,ScrollView,Dimensions} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

export default class AboutComponent extends React.Component {


  async openURL(url){
    await Linking.openURL(url);
  }

  componentDidMount(){
    
  }

  render() {
    const height = Math.round(Dimensions.get('window').height);
    return (
      <ScrollView >
            <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Title style={{marginTop:height/30,fontSize:30}}>Quick Notes</Title>
                        <Paragraph style={{marginHorizontal:'10%'}}>Quickly store notes on your device</Paragraph>
            </View>
                        <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:'10%',marginTop:height/50}}>
                            <Button icon="web" mode="contained" style={{backgroundColor:'gray'}} onPress={() => this.openURL('https://github.com/adiXcodr/QuickNotes')} >
                            View on Github 
                            </Button>
                    </View>   

                    <View style={{alignItems:'center',justifyContent:'center'}}>
                            <Title style={{marginTop:height/20,fontSize:25}}>Reach Me</Title>   
                            <View style={{marginTop:height/30}}>
                                    <Avatar.Image size={100} source={require('./pp.jpg')} /> 
                            </View>
                            <Title style={{marginTop:height/30,fontSize:20}}>Adittya Dey</Title>
                                <Paragraph style={{marginHorizontal:'10%'}}>Full Stack Developer</Paragraph>
                    
                    </View>
                            <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:'2%',marginTop:height/30,flexDirection:'row'}}>
                            <Button icon="phone" mode="contained" style={{backgroundColor:'#35B535',marginHorizontal:'5%'}} onPress={() => this.openURL('tel:7896186169')} >
                            Call Me
                            </Button>
                            <Button icon="mail" mode="contained" style={{backgroundColor:'#D44638',marginHorizontal:'5%'}} onPress={() => this.openURL('mailto:ichbinadittyadey@gmail.com')} >
                            Email 
                            </Button>
                    </View> 

           
      </ScrollView>
    );
  }
}


