import * as React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  YellowBox,
  StatusBar,
  ActivityIndicator,  
  PermissionsAndroid
} from "react-native";
import { IconButton, Button, Card, Title, Paragraph } from 'react-native-paper';
import styles from './style.js';
import AsyncStorage from '@react-native-community/async-storage';
import TesseractOcr, { LANG_ENGLISH } from 'react-native-tesseract-ocr';
import ImagePicker from 'react-native-image-picker';
//import SplashScreenContainer from '../SplashScreen/index';


YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
]);


export default class NotesComponent extends React.Component {

    state={
      notes:[],
      notes_len:0,
      refresh:false,
      loading:true,
      imageUri:''
    };


    getData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@storage_Key')
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
      console.log(noteData);
      DATA=noteData;
      DATA = DATA.sort((a, b) => b.id - a.id);
      this.setState({loading:false});
      StatusBar.setBackgroundColor('#212121', true);
    }
    else{
      console.log('Null Data');
      this.setState({loading:false});
      StatusBar.setBackgroundColor('#212121', true);
    }
    

    this.setState({notes:DATA,notes_len:DATA.length});
  }


  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };


  requestReadPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Read Permisson",
          message:
           "To Do OCR",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the OCR");
      } else {
        console.log("OCR permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };


  requestWritePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Write Permisson",
          message:
           "To Do OCR",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the OCR");
      } else {
        console.log("OCR permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

 
  rightHeader = () => {
    return (
        <View style={{alignItems:'center',justifyContent:'center',right:'10%'}}>
                <Button icon="pencil-plus-outline" mode="contained" onPress={() => this.props.route.navigation.navigate('AddNoteComponent',{flag:0,navigation:this.props.route.navigation})} >
                  Add Note ({this.state.notes_len})
                </Button>
          </View>
    );
  };
  setHeaderOptions = () => {
    this.props.route.navigation.setOptions({
      headerRight: props => this.rightHeader(props)
    });
  };

  async recogniseOCR(path){
    try {
      const tesseractOptions = {};
      const recognizedText = await TesseractOcr.recognize(
        path,
        LANG_ENGLISH,
        tesseractOptions,
      );
      console.log(recognizedText)
    } catch (err) {
      console.error(err);
    }

  }

  scanNote(){
    this.requestCameraPermission();
    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, (response) => {
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              console.log(response.uri);
              this.recogniseOCR(response.path);
              this.setState({imageUri:response.uri});
            }
    });


  }

  componentDidMount() {
    this.setHeaderOptions();
    this.setState({refresh:this.props.route.refresh});
    this.setData();
    this.requestReadPermission();
    this.requestWritePermission();
  }

  componentWillUnmount() {
   
  }


  render() {
    return (
      this.state.loading? <View style={{ flex: 1, backgroundColor:"#212121", justifyContent:'center',alignItems:'center'}}>
                                <ActivityIndicator size="large" color="white" />
                          </View>
      :
      this.state.notes_len==0?  <View style={{ flex: 1, backgroundColor:"#212121", justifyContent:'center',alignItems:'center'}}>
                                      <Paragraph style={{fontSize:20}}>It's lonely in here...</Paragraph>
                                      <View style={{  position: 'absolute',
                                                    bottom:0,
                                                    right:10,}}>
                                            <IconButton
                                                icon="camera"
                                                color={'red'}
                                                size={30}
                                                onPress={() => this.scanNote()}
                                            />
                                    </View>
                                </View>

      :<View style={styles.body}>
         <View style={{  position: 'absolute',
                      bottom:0,
                      right:10,}}>
              <IconButton
                  icon="camera"
                  color={'red'}
                  size={30}
                  onPress={() => this.scanNote()}
              />
      </View> 
        <ScrollView >
        <FlatList
        data={this.state.notes}
        nestedScrollEnabled={true}
        style={{marginTop:20}}
                renderItem={({ item }) => (
                  
                  <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'column', margin: 1 ,marginBottom:30}}
                    onPress={() => this.props.route.navigation.navigate('AddNoteComponent',{note:item,flag:1,navigation:this.props.route.navigation})}
                    activeOpacity={0.2}
                  >
                    <View style={{borderColor:'#ddd',borderWidth:0.5,marginHorizontal:'8%',borderRadius:10}}>
                        <View style={{backgroundColor:'#ddd',borderTopLeftRadius:10,borderTopRightRadius:10}}>
                            <Title style={{alignContent:'center',alignItems:'center',alignSelf:'center',color:'black'}}>{item.title}</Title>
                        </View>
                        
                        <View style={{marginHorizontal:'10%',marginVertical:30}}>
                          
                          <Paragraph>{item.content}</Paragraph>
                        </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
      />
      </ScrollView>

      


      </View>
    );
  }
}

