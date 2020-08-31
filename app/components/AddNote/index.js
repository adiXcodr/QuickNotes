import * as React from 'react';
import { View,PermissionsAndroid,Image,FlatList,Dimensions,ScrollView} from 'react-native';
import { Button, TextInput,IconButton} from 'react-native-paper';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import ImageModal from 'react-native-image-modal';

export default class AddNoteComponent extends React.Component {

  state={
    imageUri:'',
    imageBase64:''
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
    console.log('Base64 =',base64);
    this.setState({imageUri:uri,imageBase64:base64});
   
  }


  scanNote(){

    this.requestCameraPermission();
    const options = {
      title: 'Select Image',
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

  createNote = async (value) => {
    try {
      let data=await this.getData();
      if(!data){
        data=[];
      }
      let id=value.note_id, title=value.note_title, content=value.note_content;
      let idToRemove = id;
      let imageUri=this.state.imageUri, imageBase64=this.state.imageBase64;
      data = data.filter((item) => item.id !== idToRemove);
      data.push({id,title,content,imageUri,imageBase64});
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@note_data', jsonValue);
      let nav=this.props.route.params.navigation;
      nav.navigate('HomeContainer',{refresh:true})
      
    } catch (e) {
      console.log(e);
    }
  }

  async deleteNote(){
      id=this.props.route.params.note.id;
      try {
        let data=await this.getData();
        let idToRemove = id;
        data = data.filter((item) => item.id !== idToRemove);
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@note_data', jsonValue);
        let nav=this.props.route.params.navigation;
        nav.navigate('HomeContainer',{refresh:true});

      } catch (e) {
        console.log(e);
      }
  }
  componentDidMount(){
    this.requestReadPermission();
    this.requestWritePermission();
    try{
      let uri=this.props.route.params.flag==1?this.props.route.params.note.imageUri:'';
      this.setState({imageUri:uri});
    }catch(e){
      console.log(e);
    }
  }

  render() {
    return (
      <ScrollView style={{flex:1}}>
      <Formik
        initialValues={{
          note_id:this.props.route.params.flag==1?this.props.route.params.note.id : Date.now(),
          note_title: this.props.route.params.flag==1?this.props.route.params.note.title : '',
          note_content: this.props.route.params.flag==1?this.props.route.params.note.content : ''
        }}
        onSubmit={async (values, { resetForm }) => {
          try {
            if (values.note_content != ''&&values.note_title!='') {
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
              label="Enter Note Headline"
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
              numberOfLines={10}
              value={values.note_content}
              onChangeText={handleChange('note_content')}
              onBlur={handleBlur('note_content')}
              style={{ fontSize: 15, width: '90%' ,marginTop:30}}
            />
            <View style={{marginVertical:30,width:'95%',alignSelf:'center',alignItems:'center'}}>
              
            {this.state.imageUri==''?
             <Button icon="plus" mode="outlined" style={{marginHorizontal:'2%'}} onPress={()=>this.scanNote()}
                     contentStyle={{borderColor:'white'}}
             >
                Image
            </Button>
            :


            <View style={{alignItems:'center',width:'95%',justifyContent:'center',alignSelf:'center'}}>
                <ImageModal
                resizeMode="contain"
                imageBackgroundColor="#212121"
                overlayBackgroundColor="#212121"
                style={{
                  width: Dimensions.get('window').width/1.25,
                  height: 200,
                  alignSelf:'center',
                  alignContent:'center'
                }}
                source={{
                  uri: this.state.imageUri,
                }}
                
              />
               
            <IconButton
              icon="delete-circle"
              color={'red'}
              size={30}
              onPress={()=>this.setState({imageUri:''})}
              style={{position:'absolute',top:-10,right:0,backgroundColor:'white'}}
            />
          </View>

          }

            </View>
            <View style={{marginTop:0, flexDirection:'row' }}>

              <Button icon="send" mode="contained" style={{marginHorizontal:'2%'}} onPress={data => handleSubmit(data)}>
                Submit
              </Button>
              {this.props.route.params.flag==1?
              <Button icon="delete-circle" mode="contained" style={{backgroundColor:'#D44638',marginHorizontal:'2%'}} onPress={()=>this.deleteNote()}>
              Delete
            </Button>:null}
            </View>

            


          </View>
        )}
      </Formik>
      </ScrollView>
    );
  }
}


