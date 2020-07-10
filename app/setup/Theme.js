import { DefaultTheme } from 'react-native-paper';
import {fonts} from './Constants';


const primaryTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0099FF',
    background: '#212121',
    accent: '#81CFAE',
    surface: '#212121',
    text:'white',
    placeholder:'white'
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: { fontFamily: fonts.regular },
    medium: { fontFamily: fonts.bold },
  },
};

export default primaryTheme;
