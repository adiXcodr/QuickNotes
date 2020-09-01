import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { IconButton, Button, Card, Title, Paragraph } from 'react-native-paper';
import styles from './style.js';
import AsyncStorage from '@react-native-community/async-storage';
import ImageModal from 'react-native-image-modal';
import RNRestart from 'react-native-restart';



export default class NotesComponent extends React.Component {

    state={
      notes:[],
      notes_len:0,
      refresh:false,
      loading:true
    };


    getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@note_data')
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch(e) {
        // error reading value
      }
    }

  async setData(){
    
    var noteData=await this.getData();
    let DATA=[];
    if(noteData!=null)
    {
      DATA=noteData;
      DATA = DATA.sort((a, b) => b.id - a.id);
      this.setState({loading:false});
     
    }
    else{
      console.log('Null Data');
      this.setState({loading:false});
      
    }
    

    this.setState({notes:DATA,notes_len:DATA.length});
  }


  async setTheme(){
    let theme={};
    if(this.props.route.theme.mode=="light"){
      let mode='dark', primary='#f7b621', background='#212121', text='white', accent='#212121';
      theme={mode,primary,background,text,accent};
    }
    else{
      let mode='light', primary='#f7b621', background='white', text='black', accent='white';
      theme={mode,primary,background,text,accent};
    }
    const jsonValue = JSON.stringify(theme);
    await AsyncStorage.setItem('@theme_data', jsonValue);
    RNRestart.Restart();
  }

 
  rightHeader = () => {
    return (
        <View style={{alignItems:'center',justifyContent:'center',right:'20%'}}>
                                        <IconButton
                                          icon={this.props.route.theme.mode!="light"?'lightbulb-off':'lightbulb'}
                                          color={this.props.route.theme.mode=="light"?this.props.route.theme.primary:this.props.route.theme.text}
                                          size={30}
                                          onPress={() => this.setTheme()}
                                        />
          </View>
    );
  };
  setHeaderOptions = () => {
    this.props.route.navigation.setOptions({
      headerRight: props => this.rightHeader(props)
    });
  };


  

  componentDidMount() {
    this.setHeaderOptions();
    this.setState({refresh:this.props.route.refresh});
    this.setData();
    
  }

  componentWillUnmount() {
   
  }


  render() {
    let theme=this.props.route.theme;
    return (
      this.state.loading? <View style={{ flex: 1, backgroundColor:theme.background, justifyContent:'center',alignItems:'center'}}>
                                <ActivityIndicator size="large" color={theme.text} />
                          </View>
      :
      this.state.notes_len==0?  <View style={{ flex: 1, backgroundColor:theme.background, justifyContent:'center',alignItems:'center'}}>
                                      <Paragraph style={{fontSize:20}}>It's lonely in here...</Paragraph>


                                 
                                    <View style={{position:'absolute',bottom:20,right:'7%'}}>
                                        <IconButton
                                          icon="plus"
                                          color={theme.background}
                                          size={40}
                                          onPress={() => this.props.route.navigation.navigate('AddNoteComponent',{flag:0,navigation:this.props.route.navigation,theme:this.props.route.theme})}
                                          style={{backgroundColor:theme.primary}}
                                        />
                                    </View>

                                </View>

      :<View style={{flex: 1, backgroundColor:theme.background, justifyContent:'center'}}>
        <ScrollView >
        <FlatList
        data={this.state.notes}
        nestedScrollEnabled={true}
        style={{marginTop:30}}
                renderItem={({ item }) => (
                  
                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'column', margin: 1 ,marginBottom:30}}
                    onPress={() => this.props.route.navigation.navigate('AddNoteComponent',{note:item,flag:1,navigation:this.props.route.navigation,theme:this.props.route.theme})}
                    activeOpacity={0.2}
                  >
                    <View style={{borderColor:'#aaa',borderWidth:0.5,marginHorizontal:'8%',borderRadius:10}}>
                        <View style={{backgroundColor:theme.mode=="light"?theme.primary:theme.text,borderTopLeftRadius:10,borderTopRightRadius:10}}>
                            <Title style={{alignContent:'center',alignItems:'center',alignSelf:'center',color:theme.background,fontSize:17}}>{item.title}</Title>
                        </View>
                        {item.content!=""?
                        <View style={{marginHorizontal:'10%',marginVertical:30}}>
                          
                          <Paragraph style={{textAlign:'center'}}>{item.content}</Paragraph>
                        </View>
                        :null}
                        {item.imageBase64!=''?
                          <View style={{alignItems:'center',width:'95%',justifyContent:'center',alignSelf:'center',marginTop:50,marginBottom:50}}>
                          <ImageModal
                          resizeMode="contain"
                          imageBackgroundColor={theme.background}
                          overlayBackgroundColor={theme.background}
                          style={{
                            width: Dimensions.get('window').width/1.25,
                            height: 100,
                            alignSelf:'center',
                            alignContent:'center'
                          }}
                          source={{
                            uri:'data:image/png;base64,'+item.imageBase64,
                          }}
                          
                        />
                 
                    </View>
                        :null}

                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
      />
      </ScrollView>

     
                                    <View style={{position:'absolute',bottom:20,right:'7%'}}>
                                        <IconButton
                                          icon="plus"
                                          color={theme.background}
                                          size={40}
                                          onPress={() => this.props.route.navigation.navigate('AddNoteComponent',{flag:0,navigation:this.props.route.navigation})}
                                          style={{backgroundColor:theme.primary}}
                                        />
                                    </View>
      </View>
    );
  }
}

