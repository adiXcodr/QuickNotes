import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import NotesComponent from './Notes/Notes';
import {
    View
  } from "react-native";


const ProfileRoute = () => <View>
                            <Text>Profile</Text>
                        </View>;

const AboutRoute = () => <View>
                                <Text>About</Text>
                           </View>;

export default Home = (props) => {
  let refresh=false;
  try {
    refresh=props.route.params.refresh;
  } catch (e) {
    refresh=false;
  }
  console.log(refresh)
  const [index, setIndex] = React.useState(1);
  const routes = [
    { key: 'profile', title: 'Profile', icon: 'account-outline',color: '#3F51B5' },
    { key: 'notes', title: 'Notes', icon: 'playlist-edit' , color: '#009688',navigation:props.navigation,refresh:refresh,},
    { key: 'about', title: 'About', icon: 'information-outline', color: '#795548' },
  ];

  const renderScene = BottomNavigation.SceneMap({
    profile: ProfileRoute,
    notes: NotesComponent,
    about: AboutRoute,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={val => setIndex(val)}
      renderScene={renderScene}
      barStyle={{backgroundColor:'rgba(0, 0, 0, 0.5)',position: 'absolute',
      borderTopColor: 'rgba(0, 0, 0, 0.5)',
      elevation: 0,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,}}
    />
  );
};