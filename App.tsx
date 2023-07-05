import React, {useEffect, useRef, useState} from 'react';
import NavigationStack from './src/stack/stacknavigation';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GettingCall from './src/componant/VideoCall/GettingCall/GettingCall';
import Video from './src/componant/VideoCall/Video';
import {
  MediaStream,
  RTCPeerConnection,
  
} from 'react-native-webrtc';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import { AppState } from 'react-native';

import firestore from '@react-native-firebase/firestore';
import {  firestoreCleanUp, join, streamCleanUp, subscribe, subscribeDelete, switchAudio, switchCamera, switchVideo } from './src/controllers/VideoAssisstance/webrtcJoinUtils';
import { requestNotificationPermission, unsubscribeBackground, unsubscribeForeground } from './src/controllers/Firebase/FCM/SubscribeFCM';
import { getConversation_Id, get_CurrentUsername, get_Username_fromtoken } from './src/controllers/Firebase/Firestore/FirebaseQuery';
import ChatOverlay from './src/componant/VideoCall/MessagesChat/ChatOverLay';
import HomeScreen from './src/Screens/HomeScreen';
import Attachment_Video from './src/componant/VideoCall/Attachements/Attachment_Video';
const Stack = createStackNavigator();

function App(): JSX.Element {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [gettingCall, setGettinggcall] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [videoEnabled, setvideoEnabled] = useState(true);
  const [targettoken, settargettoken] = useState<string>();
  const [subscribed, setSubscribed] = useState(false);
  const [reciever, setreciever] = useState<string>();
  const [ConversationId, setConversationId] = useState<string>();
 const targett = useRef<string>();
 const targettusername = useRef<string>();

  const IDref = useRef("");

  const pc = useRef<RTCPeerConnection>();
  const connecting = useRef(false);

  // useEffect(() => {
  //   // Add event listener for AppState change
  //   AppState.addEventListener('change', handleAppStateChange);
  
  //   return () => {
  //     // Clean up the event listener when the component unmounts
  //     (AppState as any).removeEventListener('change', handleAppStateChange);
  //   };
  // }, []);

  // const handleAppStateChange = async (nextAppState :any) => {
  //   if (nextAppState === 'background') {
  //     // Hang up the video call when the app goes to the background
  //     await hangup();
  //   }
  // };
  useEffect(() => {
    messaging().requestPermission();
    messaging().getToken().then(token => {setRoomId(token.substring(0, 10));})     
  }, []);

  useEffect(() => {
    //listen for the firebase changes
    const cRef = firestore().collection('meet').doc(roomId).collection('1').doc('1');

    return () => {
      if(!connecting.current && !subscribed){
      subscribe(cRef,connecting,setGettinggcall,hangup,setSubscribed);}
      subscribeDelete(cRef,hangup);
    };
  });

  useEffect(() => {
    //listen for the notification

    return () => {
      requestNotificationPermission();
      if (!connecting.current){
        console.log("seyess")
      unsubscribeForeground(targett,IDref,targettusername);
      unsubscribeBackground(targett,IDref,targettusername);}
      
    };
  });

  const handleSwitchCamera = () => {
    switchCamera(localStream);
  };
  const handleSwitchAudio = () => {
    switchAudio(localStream, isMuted, setIsMuted);
  };

  const handleSwitchVideo = () => {
    switchVideo(localStream, videoEnabled, setvideoEnabled);
  };
  

  const hangup = async () => {
    setGettinggcall(false);
    connecting.current = false;
    //streamCleanUp();
    await streamCleanUp(localStream,setLocalStream,setRemoteStream);
    await firestoreCleanUp(roomId);
    //firestoreCleanUp();
    if (pc.current) {
      pc.current.close();
    }
  };

  
  
  //if any call it passed
  if (gettingCall) {
    const handleJoin = async () => {
      try {
        const currentusername = await get_CurrentUsername ();
        
        setreciever(currentusername);
        await join(connecting, setGettinggcall, roomId, pc, setLocalStream, setRemoteStream);
        
      } catch (error) {
        console.error(error);
      }
    
    };
    const handleHangup = async () => {
      try {
        await hangup();
        
      } catch (error) {
        console.error(error);
      }
    
    };
    
    return <GettingCall hangup={handleHangup} join={handleJoin} targettusername={targettusername.current}/>;
  }
  //yhezna l video
  if (localStream) {
    return (
      <Video
        isMuted={isMuted}
        videoEnabled = {videoEnabled}
        switchAudio={handleSwitchAudio}
        switchVideo={handleSwitchVideo}
        switchCamera={handleSwitchCamera}
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
        targettoken={targettoken}
        currentusername = {reciever}
        ConversationId = {IDref.current}
        role = {"receiver"}
        targetusername = {targettusername.current}
      />
    );
  }

  return (
     <NavigationContainer>
       <NavigationStack />
     </NavigationContainer>
      //<Attachment_Video/>
  );
}

export default App;
