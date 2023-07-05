import React from 'react';
import {TransitionSpecs, createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WorkOrderList from '../Screens/Workorderslist_Screen';
import LoginScreen from '../Screens/Login';
import WelcomeScreen from '../Screens/TestScreen';
import WorkorderDetails from '../Screens/detailsScreen';
import CallCenter from '../Screens/CallCenterScreen';
import CreateRoom from '../Screens/CreateRoomScreen';
import JoinRoom from '../Screens/JoinRoomScreen';
import HomeScreen from '../Screens/HomeScreen';
import CallLogsScreen from '../Screens/CallLogsScreen';
import DetailsCallLogs from '../Screens/DetailsCallLogsScreen';
import MessagesLogs from '../Screens/MessagesLogScreen';
import RecordsLogs from '../Screens/RecordsLogsScreen';
import RecordDesplay from '../componant/VideoCallLogs/DisplayRecord';
import AttachementsLogs from '../Screens/AttachmentsLogs';

const Stack = createStackNavigator();

function NavigationStack() {
  return (
    <SafeAreaProvider>
      <Stack.Navigator
        initialRouteName="Inter"
        screenOptions={{
          headerShown: false,
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          cardStyleInterpolator: ({current, next, layouts}) => {
            const translateX = current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            });

            const opacity = next
              ? next.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                })
              : 1;

            return {
              cardStyle: {
                transform: [{translateX}],
                opacity,
              },
            };
          },
        }}>
        <Stack.Screen
          name="Inter"
          component={WelcomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="WorkOrderList"
          component={WorkOrderList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="WorkorderDetails"
          component={WorkorderDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CallCenter"
          component={CallCenter}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateRoom"
          component={CreateRoom}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="JoinRoom"
          component={JoinRoom}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CallLogs"
          component={CallLogsScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="DetailsCallLogs"
          component={DetailsCallLogs}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="MessagesLogs"
          component={MessagesLogs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RecordsLogs"
          component={RecordsLogs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="RecordDesplay"
          component={RecordDesplay}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AttachementsLogs"
          component={AttachementsLogs}
          options={{headerShown: false}}
        />
        
        {/* Add other screens here as needed */}
      </Stack.Navigator>
    </SafeAreaProvider>
  );
}

export default NavigationStack;
