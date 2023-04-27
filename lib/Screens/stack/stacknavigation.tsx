
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WorkOrderList from '../Workorderslist_Screen';
import LoginScreen from '../Login';

const Stack = createStackNavigator();

function NavigationStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="WorkOrderList" component={WorkOrderList} />
      {/* Add other screens here as needed */}
    </Stack.Navigator>
  );
}

export default NavigationStack;