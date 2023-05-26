import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import WorkOrderList from '../Workorderslist_Screen';
import LoginScreen from '../Login';
import WelcomeScreen from '../TestScreen';
import WorkorderDetails from '../detailsScreen';
import CallCenter from '../CallCenterScreen';
import CreateRoom from '../CreateRoomScreen';
import JoinRoom from '../JoinRoomScreen';

const Stack = createStackNavigator();

function NavigationStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator initialRouteName="CallCenter">
        <Stack.Screen name="Inter" component={WelcomeScreen} options={{headerShown : false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown : false}}/>
        <Stack.Screen name="WorkOrderList" component={WorkOrderList} options={{headerShown : false}} />
        <Stack.Screen name="WorkorderDetails" component={WorkorderDetails} options={{headerShown : false}} />
        <Stack.Screen name="CallCenter" component={CallCenter} options={{headerShown : false}}/>
        <Stack.Screen name="CreateRoom" component={CreateRoom} options={{headerShown : false}}/>
        <Stack.Screen name="JoinRoom" component={JoinRoom} options={{headerShown : false}}/>
        {/* Add other screens here as needed */}
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export default NavigationStack;