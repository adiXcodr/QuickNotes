import * as React from 'react';
import { View,PermissionsAndroid,Image,FlatList,Dimensions,ScrollView} from 'react-native';
import { Button, TextInput,IconButton,Switch,Paragraph} from 'react-native-paper';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import ImageModal from 'react-native-image-modal';
const axios = require('axios');
import qs from 'qs';

export default class AddNoteComponent extends React.Component {

  state={
    imageUri:'',
    imageBase64:'',
    submitLoading:false,
    params:{},
    loading:true,
    isSwitchOn:false
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: " Camera Permission",
          message:
            "App needs access to your camera " +
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
           "To Get Note Data",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Successful");
      } else {
        console.log("Permission denied");
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
           "To Write Data",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Successful");
      } else {
        console.log("Permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  setImages(uri,base64){
    this.setState({imageUri:uri,imageBase64:base64});
   
  }


  scanNote(){

    this.requestCameraPermission();
    const options = {
      title: 'Select Image',
      quality:0.2,
      noData:false,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
          
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              console.log(response.uri);   //or .path
              console.log(response.path);
              this.setImages(response.uri,response.data);
            }
    });


  }


  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@note_data')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  getThemeData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@theme_data')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      console.log(e);
      return(null);
    }
  }

  createNote = async (value) => {
    this.setState({submitLoading:true});
    try {
      let data=await this.getData();
      if(!data){
        data=[];
      }
      let id=value.note_id, title=value.note_title, content=value.note_content;
      let idToRemove = id;
      let imageUri=this.state.imageUri, imageBase64=this.state.imageBase64;
      data = data.filter((item) => item.id !== idToRemove);
      let imageOCR= await this.doOCR(imageBase64);
      if(imageOCR!=""){
        imageUri='';
        imageBase64='';
        if(content!="")
          content=content+'\n'+imageOCR;
        else  
          content=imageOCR;
      }
      data.push({id,title,content,imageUri,imageBase64,imageOCR});
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@note_data', jsonValue);
      this.setState({submitLoading:false});
      let nav=this.state.params.navigation;
      nav.navigate('HomeContainer',{refresh:true})
      
    } catch (e) {
      console.log('Error in Saving Asynstorage',e);
      this.setState({submitLoading:false})
    }
  }

  async deleteNote(){
      id=this.state.params.note.id;
      try {
        let data=await this.getData();
        let idToRemove = id;
        data = data.filter((item) => item.id !== idToRemove);
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@note_data', jsonValue);
        let nav=this.state.params.navigation;
        nav.navigate('HomeContainer',{refresh:true});

      } catch (e) {
        console.log(e);
      }
  }

   async getCorrectBackground(){
    try{
      let background=this.props.route.params.theme.background;
      return(background);
    }catch(e){
      console.log(e);
      let theme=await this.getThemeData();
      return(theme.background);
    }
  }

   ocr_space_api = async (data) => {
    let x;
    await axios.post(`https://api.ocr.space/parse/image`,qs.stringify(data), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
    })
    .then(response => { 
      x=response.data;
    })
    .catch(error => {
      x=error.response.request._response;
    });
  
    return(x);
  };

  async doOCR(base64){
    if(base64==''||!base64||this.state.isSwitchOn==false){
      return('');
    }
    base64='data:image/png;base64,'+base64;
    let obj={
      apikey:'3ff2333e3388957',
      language: 'eng',
      base64Image:base64
    }
    let x = await this.ocr_space_api(obj);
    if(typeof(x)!="string"&&x){
      console.log("API Response :",x);
      if(x.OCRExitCode==1&&x.ParsedResults.length>0){
        let ocr_string=x.ParsedResults[0].ParsedText;
        ocr_string=ocr_string.replace(/\n/g, " ");
        ocr_string=ocr_string.replace(/\r/g, "");
        console.log(ocr_string)
        return(ocr_string);
      }
      else{
        return('');
      }
    }
    else{
      return('');
    }

    return('');
  }

  componentDidMount(){
    this.requestReadPermission();
    this.requestWritePermission();
    try{
      let uri=this.props.route.params.flag==1?this.props.route.params.note.imageBase64:'';
      let params=this.props.route.params;
      this.setState({imageBase64:uri,params:params,loading:false});
    }catch(e){
      console.log(e);
    }
  }

  render() {
    return (

      <ScrollView style={{flex:1}}>
      {!this.state.loading?
      <Formik
        initialValues={{
          note_id:this.state.params.flag==1?this.state.params.note.id : Date.now(),
          note_title: this.state.params.flag==1?this.state.params.note.title : '',
          note_content: this.state.params.flag==1?this.state.params.note.content : ''
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (values.note_title!='') {
              await this.createNote(values);
              resetForm();
            }
          } catch (e) {
            throw e;
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <View
            style={{
              marginBottom: 10,
              marginTop: 10,
              marginHorizontal: '5%',
              alignItems: 'center',
              flex:1
            }}
          >
            <TextInput
              label="Enter Note Headline *"
              mode="outlined"
              value={values.note_title}
              onChangeText={handleChange('note_title')}
              onBlur={handleBlur('note_title')}
              style={{ fontSize: 15, width: '90%' ,marginTop:10}}
              
            />
            <TextInput
              label="Enter your Note here"
              mode="outlined"
              multiline={true}
              numberOfLines={8}
              value={values.note_content}
              onChangeText={handleChange('note_content')}
              onBlur={handleBlur('note_content')}
              style={{ fontSize: 15, width: '90%' ,marginTop:30}}
            />
            <View style={{marginVertical:30,width:'95%',alignSelf:'center',alignItems:'center'}}>
              
            {this.state.imageBase64==''?
             <Button icon="plus" mode="outlined" style={{marginHorizontal:'2%'}} onPress={()=>this.scanNote()}
                     contentStyle={{borderColor:'white'}}
             >
                Image
            </Button>
            :


            <View style={{alignItems:'center',width:'95%',justifyContent:'center',alignSelf:'center'}}>
                <ImageModal
                resizeMode="contain"
                style={{
                  width: Dimensions.get('window').width/1.25,
                  height: 200,
                  alignSelf:'center',
                  alignContent:'center'
                }}
                source={{
                  uri: 'data:image/png;base64,'+this.state.imageBase64,
                }}
                overlayBackgroundColor={'#212121'}
              />

              <View style={{alignItems:'center',width:'95%',justifyContent:'center',alignSelf:'center',flexDirection:'row',marginTop:20}}>
                  <Paragraph style={{marginHorizontal:'2%'}}>Image To Text</Paragraph>
                  <Switch style={{marginHorizontal:'2%'}} color={'green'} value={this.state.isSwitchOn} onValueChange={()=>this.setState({isSwitchOn:!this.state.isSwitchOn})} />
              </View>
               
            <IconButton
              icon="delete-circle"
              color={'red'}
              size={30}
              onPress={()=>this.setState({imageUri:'',imageBase64:''})}
              style={{position:'absolute',top:-10,right:0,backgroundColor:'white'}}
            />
          </View>

          }

            </View>
            <View style={{marginTop:0, flexDirection:'row' }}>

              <Button icon="send" mode="contained" style={{marginHorizontal:'2%'}} onPress={data => handleSubmit(data)} loading={this.state.submitLoading}>
                Submit
              </Button>
              {this.state.params.flag==1?
              <Button icon="delete-circle" mode="contained" style={{backgroundColor:'#D44638',marginHorizontal:'2%'}} onPress={()=>this.deleteNote()}>
              Delete
            </Button>:null}
            </View>

            


          </View>
        )}
      </Formik>
      :null}
      </ScrollView>
    );
  }
}


