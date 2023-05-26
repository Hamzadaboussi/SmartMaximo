import React, {useEffect, useRef, useState} from 'react';
import NavigationStack from './lib/Screens/stack/stacknavigation';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import GettingCall from './lib/componant/GettingCall';
import Video from './lib/componant/Video';
import {
  MediaStream,
  RTCPeerConnection,
  
} from 'react-native-webrtc';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import firestore from '@react-native-firebase/firestore';
import {  firestoreCleanUp, join, streamCleanUp, subscribe, subscribeDelete, switchAudio, switchCamera } from './lib/controllers/webrtcJoinUtils';
import { requestNotificationPermission, unsubscribeBackground, unsubscribeForeground } from './lib/controllers/GetFCMtoken';
import { get_CurrentUsername, get_Username_fromtoken } from './lib/controllers/FirebaseQuery';
const Stack = createStackNavigator();

function App(): JSX.Element {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [gettingCall, setGettinggcall] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [targettoken, settargettoken] = useState<string>();
  const [subscribed, setSubscribed] = useState(false);
  const [reciever, setreciever] = useState<string>();


  const pc = useRef<RTCPeerConnection>();
  const connecting = useRef(false);

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
      requestNotificationPermission;
      if (!connecting.current){
      unsubscribeForeground(settargettoken);
      unsubscribeBackground;}
      
    };
  });

  const handleSwitchCamera = () => {
    switchCamera(localStream);
  };
  const handleSwitchAudio = () => {
    switchAudio(localStream, isMuted, setIsMuted);
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

  
  
  //ken fomma call yhezna l gettingcall component
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
    
    return <GettingCall hangup={handleHangup} join={handleJoin} />;
  }
  //yhezna l video
  if (localStream) {
    console.log('wsselna l video');
    console.log(localStream.toURL(), '-----', DeviceInfo.getUniqueId());
    console.log(remoteStream?.toURL(), '-----', DeviceInfo.getUniqueId());
    console.log("blabla target" , targettoken)
    console.log('blabla current',reciever)
    return (
      <Video
        isMuted={isMuted}
        switchAudio={handleSwitchAudio}
        switchCamera={handleSwitchCamera}
        hangup={hangup}
        localStream={localStream}
        remoteStream={remoteStream}
        targettoken={targettoken}
        currentusername = {reciever}
      />
    );
  }

  return (
    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>
  );
}

export default App;
