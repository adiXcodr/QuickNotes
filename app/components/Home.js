import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import NotesComponent from './Notes/Notes';
import AboutComponent from './About/index';


export default Home = (props) => {
  let refresh=false;
  try {
    refresh=props.route.params.refresh;
  } catch (e) {
    refresh=false;
  }
  const [index, setIndex] = React.useState(0);
  const routes = [
    { key: 'notes', title: 'Notes', icon: 'playlist-edit' , color: props.theme.background ,navigation:props.navigation,refresh:refresh,theme:props.theme},
    { key: 'about', title: 'About', icon: 'information-outline', color: props.theme.background,navigation:props.navigation,theme:props.theme },
  ];

  const renderScene = BottomNavigation.SceneMap({
    notes: NotesComponent,
    about: AboutComponent,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={val => setIndex(val)}
      renderScene={renderScene}
      shifting={props.theme.mode!="light"?true:false}
      activeColor={props.theme.text}
      inactiveColor={"#bbb"}
      barStyle={{backgroundColor:props.theme.background}}
      
    />
  );
};