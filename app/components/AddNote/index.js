import * as React from 'react';
import { View } from 'react-native';
import { Button, TextInput} from 'react-native-paper';
import { Formik } from 'formik';
import AsyncStorage from '@react-native-community/async-storage';


export default class AddNoteComponent extends React.Component {


  getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key')
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
      data = data.filter((item) => item.id !== idToRemove);
      data.push({id,title,content});
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
      let nav=this.props.route.params.navigation;
      nav.navigate('HomeContainer',{refresh:true})
      
      //this.props.route.navigation.navigate('HomeContainer',{})
    } catch (e) {
      // saving error
    }
  }

  async deleteNote(){
      id=this.props.route.params.note.id;
      try {
        let data=await this.getData();
        let idToRemove = id;
        data = data.filter((item) => item.id !== idToRemove);
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@storage_Key', jsonValue);
        let nav=this.props.route.params.navigation;
        nav.navigate('HomeContainer',{refresh:true})
        
        //this.props.route.navigation.navigate('HomeContainer',{})
      } catch (e) {
        // saving error
      }
  }
  componentDidMount(){
    
  }

  render() {
    return (
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
              marginTop: 30,
              marginHorizontal: '5%',
              alignItems: 'center',
            }}
          >
            <TextInput
              label="Enter Note Headline"
              mode="outlined"
              value={values.note_title}
              onChangeText={handleChange('note_title')}
              onBlur={handleBlur('note_title')}
              style={{ fontSize: 15, width: '90%' ,marginTop:30}}
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
            
            <View style={{ marginHorizontal:'10%',marginTop:30 }}>
              <Button icon="send" mode="contained" onPress={data => handleSubmit(data)}>
                Submit
              </Button>
            </View>

            {this.props.route.params.flag==1?
             <View style={{ marginHorizontal:'10%',marginTop:30 }}>
             <Button icon="send" mode="contained" style={{backgroundColor:'#D44638'}} onPress={()=>this.deleteNote()}>
               Delete
             </Button>
           </View>:null}


          </View>
        )}
      </Formik>
    );
  }
}


