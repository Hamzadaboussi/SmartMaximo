
import React from 'react';
import LoginScreen from './lib/Screens/Login';
import WorkOrderList from './lib/Screens/Workorderslist_Screen';
import {NavigationContainer} from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App(): JSX.Element {
  
  return (
    
    <LoginScreen></LoginScreen>
    
  );
}


export default App;
