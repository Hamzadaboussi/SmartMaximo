import React from 'react';
import NavigationStack from './lib/Screens/stack/stacknavigation';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './lib/Screens/Login';
import WorkOrderList from './lib/Screens/Workorderslist_Screen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App(): JSX.Element {
  return (

    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>

  );
}

export default App;