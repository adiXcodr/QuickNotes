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
  Dimensions
} from "react-native";
import { IconButton, Button, Card, Title, Paragraph } from 'react-native-paper';
import styles from './style.js';
import AsyncStorage from '@react-native-community/async-storage';
import ImageModal from 'react-native-image-modal';

//import SplashScreenContainer from '../SplashScreen/index';


YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', 
]);


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


  

  componentDidMount() {
    this.setHeaderOptions();
    this.setState({refresh:this.props.route.refresh});
    this.setData();
    
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




                                </View>

      :<View style={styles.body}>
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
                          
                          <Paragraph style={{textAlign:'center'}}>{item.content}</Paragraph>
                        </View>
                        {item.imageUri!=''?
                          <View style={{alignItems:'center',width:'95%',justifyContent:'center',alignSelf:'center',marginTop:30,marginBottom:50}}>
                          <ImageModal
                          resizeMode="contain"
                          imageBackgroundColor="#212121"
                          overlayBackgroundColor="#212121"
                          style={{
                            width: Dimensions.get('window').width/1.25,
                            height: 150,
                            alignSelf:'center',
                            alignContent:'center'
                          }}
                          source={{
                            uri: item.imageUri,
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

      


      </View>
    );
  }
}

