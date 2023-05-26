import React, { useState, useRef, useEffect } from 'react';
import { Button, Dimensions, FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import Video from '../componant/Video';
import { MediaStream, RTCView, RTCPeerConnection, RTCIceCandidate, MediaStreamTrack, RTCSessionDescription } from 'react-native-webrtc';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';

import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import { create, handleRetrieveUsers, subscribe } from '../controllers/webrtcCreateUtils';
import { firestoreCleanUp, streamCleanUp, subscribeDelete, switchAudio, switchCamera } from '../controllers/webrtcJoinUtils';
import { sendNotificationToJoin } from '../controllers/NotificationFCMUtils';
import { CreateChat_firestore, get_CurrentUsername } from '../controllers/FirebaseQuery';





export default function CreateRoom() {
  
  const [localStream, setLocalStream] = useState<MediaStream | null>()
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>()
  const [gettingCall, setGettinggcall] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const pc = useRef<RTCPeerConnection>();
  const connecting = useRef(false);
  const [users, setUsers] = useState<UserC[]>([]);
  const [user, setUser] = useState<string>();
  const [sender, setsender] = useState<string>();
  


  
  //Get The list Of users
  useEffect(() => {
    handleRetrieveUsers(setUsers);
  }, []);

  //start the call when the caller pick  a target 
  useEffect(() => {
    if (roomId && roomId!="") {
      handleCreate()
    }
  }, [roomId]);

  const handleCreate = async () => {
    try {
      console.log('yaaaaltiif')
      await create(pc ,connecting,roomId,setLocalStream ,setRemoteStream);
    } catch (error) {
      console.error(error);
    }
  };
  
  //listen for the answer
  useEffect(() => {
    const cRef = firestore().collection('meet').doc(roomId).collection("1").doc("1");
    return () =>{
      
      subscribe(pc,cRef);
      subscribeDelete(cRef,hangup);
    }
  });

  //Some parametre for the video componant
  const handleSwitchCamera = () => {
    switchCamera(localStream);
  };
  const handleSwitchAudio = () => {
    switchAudio(localStream, isMuted, setIsMuted);
  };
 
  const hangup = async () => { 
    setGettinggcall(false);
    connecting.current = false ; 
    streamCleanUp(localStream,setLocalStream,setRemoteStream);
    firestoreCleanUp(roomId);
    setRoomId("");
    
    if(pc.current){
      pc.current.close();
    }

  };

  const renderItem = ({ item }: { item: UserC })=> {
    return (
      <View style={styles.userContainer}>
        <Text style={styles.userName}>{item.username}</Text>
        <Button title="Call" onPress={() => handleCall(item)} color="green" />
      </View>
    );
  };

  const handleCall = async (user: UserC) => {
    // Implement your call functionality here
    console.log('Calling user:', user.username);
    console.log("aaaaa raw user . token ",user.token)
    messaging().requestPermission();
    const token = await messaging().getToken();
    await sendNotificationToJoin(user.token.toString(),user.username,token);
    setUser(user.token);
    //.error('hey hedha token',user.token);
    const senderr = await get_CurrentUsername ();
    setsender(senderr)
    await CreateChat_firestore(await get_CurrentUsername (),user.username)
    setRoomId(user.token.substring(0, 10))
    console.error("hedha a",roomId)
   // create(user.token);
  };

  //yhezna l video 
  if (localStream) {
    console.log('wsselna l video');
    console.log(localStream.toURL() ,"-----", DeviceInfo.getUniqueId());
    console.log(remoteStream?.toURL(),"-----", DeviceInfo.getUniqueId());
    console.error('ya abdallah',user);
    return  <Video
    isMuted={isMuted}
    switchAudio={handleSwitchAudio}
    switchCamera={handleSwitchCamera}
    hangup={hangup}
    localStream={localStream}
    remoteStream={remoteStream}
    targettoken = {user}
    currentusername = {sender}
  />
      
  }
  
  
  return (
    <View style={styles.container1}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.username}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fa6",
    alignItems: 'center',
    justifyContent: 'center',
    
    
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '80%',
  },
  container1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
    backgroundColor: '#fff',
     },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userName: {
    color: 'darkgrey',
    marginRight: 10,
  },
});



//export default App;