import * as React from 'react';
import { View, Linking ,ScrollView,Dimensions,Share, Alert} from 'react-native';
import { Avatar, Button, Card, Title, Paragraph,IconButton } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-community/clipboard';

export default class AboutComponent extends React.Component {

  state={
    downloadURL:'https://github.com/adiXcodr/QuickNotes/releases/download/0.1/app-universal-release.apk'
  }

  async openURL(url){
    await Linking.openURL(url);
  }

  AlertHandler=(msg)=>{
    //function to make simple alert
    Alert.alert(msg);
  }

  onShare = async (string) => {
    try {
      const result = await Share.share({
        message:
          string
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };


   copyToClipboard = (string) => {
    Clipboard.setString(string);
    this.AlertHandler('Link copied to clipboard');
  }


  componentDidMount(){
    
  }

  render() {
    const height = Math.round(Dimensions.get('window').height);
    const width = Math.round(Dimensions.get('window').width);
    return (
      <ScrollView >
            <View style={{alignItems:'center',justifyContent:'center'}}>
                        <Title style={{marginTop:height/40,fontSize:30}}>Quick Notes</Title>
                        <Paragraph style={{marginHorizontal:'10%'}}>Quickly store notes on your device</Paragraph>
            </View>
                        <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:'10%',marginTop:height/50}}>
                            <Button icon="web" mode="contained" style={{backgroundColor:this.props.route.theme.primary}} onPress={() => this.openURL('https://github.com/adiXcodr/QuickNotes')} labelStyle={{color:'white'}} >
                            View on Github 
                            </Button>
                    </View>   

                    <View style={{alignItems:'center',justifyContent:'center'}}>
                           
                            <View style={{marginTop:height/20,alignItems:'center',justifyContent:'center',alignSelf:'center'}}>
                              <QRCode
                                  value={this.state.downloadURL}
                                  size={width/1.5}
                              /> 
                              <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:'2%',marginTop:height/30,flexDirection:'row'}}>
                             
                                  <IconButton
                                      icon="content-copy"
                                      color={this.props.route.theme.text}
                                      size={30}
                                      onPress={() => this.copyToClipboard(this.state.downloadURL)}
                                  />
                                  <IconButton
                                      icon="download"
                                      color={this.props.route.theme.text}
                                      size={30}
                                      onPress={() => this.openURL(this.state.downloadURL)}
                                  />
                                  <IconButton
                                      icon="share-variant"
                                      color={this.props.route.theme.text}
                                      size={30}
                                      onPress={() => this.onShare(this.state.downloadURL)}
                                  />

                              </View>
                            </View>
                               
                    
                    </View>
                            <View style={{alignItems:'center',justifyContent:'center',marginHorizontal:'2%',marginTop:0,flexDirection:'column'}}>
                            <Title style={{marginTop:height/30,fontSize:20}}>Adittya Dey</Title>
                            <Paragraph style={{marginHorizontal:'10%',fontSize:15}}>Full Stack Developer</Paragraph>
                            <Button icon="mail" mode="contained" style={{backgroundColor:'#D44638',marginHorizontal:'5%',marginVertical:10}} onPress={() => this.openURL('mailto:ichbinadittyadey@gmail.com')} labelStyle={{color:'white'}}>
                            Email 
                            </Button>
                    </View> 

           
      </ScrollView>
    );
  }
}


