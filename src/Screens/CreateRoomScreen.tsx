import React, {useState, useRef, useEffect} from 'react';
import {
  
  AppState,
  Button,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from '../componant/VideoCall/Video';
import {
  MediaStream,
  RTCView,
  RTCPeerConnection,
  RTCIceCandidate,
  MediaStreamTrack,
  RTCSessionDescription,
} from 'react-native-webrtc';
import DeviceInfo from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUser, faVideo} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {
  create,
  handleRetrieveUsers,
  subscribe,
} from '../controllers/VideoAssisstance/webrtcCreateUtils';
import {
  firestoreCleanUp,
  streamCleanUp,
  subscribeDelete,
  switchAudio,
  switchCamera,
  switchVideo,
} from '../controllers/VideoAssisstance/webrtcJoinUtils';
import {sendNotificationToJoin} from '../controllers/Firebase/FCM/SendNotificationFCM';
import {
  CreateChat_firestore,
  getConversation_Id,
  get_CurrentUsername,
  get_Username_fromtoken,
} from '../controllers/Firebase/Firestore/FirebaseQuery';
import FastImage from 'react-native-fast-image';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';
import SearchBox from 'react-native-search-box';
import Avatar from '../componant/VideoCallLogs/Avatar';
import { ActivityIndicator } from 'react-native-paper';

export default function CreateRoom() {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
  const [gettingCall, setGettinggcall] = useState(false);
  const [roomId, setRoomId] = useState('');
  const [isMuted, setIsMuted] = useState(true);
  const [videoEnabled, setvideoEnabled] = useState(true);
  const pc = useRef<RTCPeerConnection>();
  const connecting = useRef(false);
  const IDref = useRef("");
  const [users, setUsers] = useState<UserC[]>([]);
  const [user, setUser] = useState<string>();
  const [sender, setsender] = useState<string>();
  const [ConversationId, setConversationId] = useState<string>();
  const navigation = useNavigation();
  const targettusername = useRef<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [calling, setCalling] = useState(false);


  const handleSearch = (text :any) => {
    const query = text.trim();
    setSearchQuery(query);

    const filteredData = users.filter((user) =>
      user.username.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(filteredData);
  };

  
  

  //Get The list Of users
  useEffect(() => {
    console.log("hedha sender",sender)
    handleRetrieveUsers(setUsers,setFilteredUsers);
  }, []);

  //start the call when the caller pick  a target
  useEffect(() => {
    if (roomId && roomId != '') {
      handleCreate();
    }
  }, [roomId]);
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
  const handleCreate = async () => {
    try {
      console.log('yaaaaltiif');
      await create(pc, connecting, roomId, setLocalStream, setRemoteStream);
    } catch (error) {
      console.error(error);
    }
  };

  //listen for the answer
  useEffect(() => {
    const cRef = firestore()
      .collection('meet')
      .doc(roomId)
      .collection('1')
      .doc('1');
    return () => {
      subscribe(pc, cRef);
      subscribeDelete(cRef, hangup);
    };
  });

  //Some parametre for the video componant
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
    streamCleanUp(localStream, setLocalStream, setRemoteStream);
    firestoreCleanUp(roomId);
    setRoomId('');

    if (pc.current) {
      pc.current.close();
    }
  };

  const renderItem = ({item}: {item: UserC}) => {
    return (
      <TouchableOpacity style={styles.listItem} onPress={() => handleCall(item)}>
      <View style={styles.leftContainer}>
        <View>
          <Avatar
          username={item.username}
          size={_Heightrapport/14.4}

          />
        </View>
        
        
      </View>
      <View style={styles.textContainer}>
          <Text style={styles.callerName}>{item.username}</Text>
        </View>
        <Animatable.View
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
      >
      <TouchableOpacity
          onPress={() => handleCall(item)}
          style={styles.anotherIcon}>
          <FontAwesomeIcon icon={faVideo} size={_Heightrapport/24} color="green" />
        </TouchableOpacity>
        </Animatable.View>
      </TouchableOpacity>
     
      
        
      
    );
  };

  const handleCall = async (user: UserC) => {
    setCalling(true)
    console.log('Calling user:', user.username);
    console.log('aaaaa raw user . token ', user.token);
    const senderr = await get_CurrentUsername();
    setsender(senderr);
    await CreateChat_firestore(await get_CurrentUsername(), user.username,IDref);
    console.log('conversation',IDref.current);
    messaging().requestPermission();
    const token = await messaging().getToken();
    await sendNotificationToJoin(user.token.toString(), user.username, token,IDref);
    setUser(user.token);
    //.error('hey hedha token',user.token);
    
    const targetusername = await get_Username_fromtoken(user.token);
    targettusername.current=targetusername;
    //const id = await getConversation_Id(senderr, targetusername,"caller");
    //setConversationId(id);
    //IDref.current = id.toString() ; 
    setRoomId(user.token.substring(0, 10));
    console.error('hedha a', roomId);
    setCalling(false)
    // create(user.token);
  };

  //yhezna l video
  if (localStream) {
    console.log('wsselna l video');
    console.log(localStream.toURL(), '-----', DeviceInfo.getUniqueId());
    console.log(remoteStream?.toURL(), '-----', DeviceInfo.getUniqueId());
    console.error('ya abdallah', user);
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
        targettoken={user}
        currentusername={sender}
        ConversationId={IDref.current}
        targetusername = {targettusername.current}
        role = {"caller"}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FastImage
        source={require('../assets/hearts&magic.gif')}
        style={styles.backgroundImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          navigation.goBack();
        }}>
        <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} size={_Heightrapport/40}/>
      </TouchableOpacity>
      <View style={styles.TopContainer}>
        <Text style={styles.TopContainer}>Ask For Assistance </Text>
      </View>

      <View style={styles.whiteContainer}>
       
          <View style={styles.title}>
            <Text style={styles.title}>Assisstance Center </Text>
          </View>
          <View style={styles.title}>
            <Text style={styles.description}>
              You can immediately initiate a video call with any of the experts
              listed above to seek assistance.
            </Text>
          </View>
          <View style={styles.title}>
            <Text style={styles.title}>Expert List : </Text>
          </View>
          <View style = {{marginHorizontal : _Widthrapport/36,marginTop : _Heightrapport/50}}>
          <SearchBox
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder="Search users..."
        borderRadius={10}
        onCancel ={()=>{setFilteredUsers(users)}}
        onDelete={()=>{setFilteredUsers(users)}}
        inputHeight = {_Heightrapport/20}
        
        placeholderCollapsedMargin = {_Widthrapport/8}
        searchIconCollapsedMargin = {_Widthrapport/6}
        inputStyle = {styles.text}
        
        
        cancelButtonStyle ={styles.cancel}
       
      /></View>
          <View style={styles.container1}>
          
            <FlatList
              data={filteredUsers}
              renderItem={renderItem}
              keyExtractor={item => item.username}
            />
          </View>
          
        {/* <View style={styles.bottomTitle}>
            <Text style={styles.description}>
              Please kindly note that there is a policy in place which should be respected.
            </Text>
          </View> */}
      </View>
      {calling && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
      )}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fa6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  container1: {
    
    
    paddingTop: "5%",
    borderColor: 'rgba(33, 36, 39, 0.5)',
    borderWidth: 0.5,
    marginHorizontal : _Widthrapport/36 ,
    //marginTop : _Heightrapport/36 ,
    height: Dimensions.get('window').height/2 ,
  },
  
  
  
  whiteContainer: {
    position: 'relative',
    top: -_Heightrapport/10.2, // 10 pixels overlapping
    left: 0,
    height: '100%',
    width: '100%',
    borderTopLeftRadius: _Heightrapport/18, // Set the top-left border radius
    borderTopRightRadius: _Heightrapport/18,
    backgroundColor: '#F8F8FD',
    justifyContent: 'flex-start',
    //alignItems: "center",
    

  },
  backgroundImage: {
    flex: 0,
    height: '45%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  TopContainer: {
    position: 'absolute',
    top: '5%',

    color: '#F8F8FD',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Medium',

    alignItems: 'center',

    
  },
  icon: {
    position: 'absolute',
    top: '6%',
    left: '5%',
    color: '#77E6B6',
    
    
    alignItems: 'center',

    Color: '#212427',
  },
  

  
  title: {
    color: '#004343',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: _Widthrapport/36,

    paddingBottom: _Heightrapport/144,
    paddingTop: _Heightrapport/48,
  },
  description: {
    color: '#004343',
    fontSize: _Heightrapport/51.5,
    fontFamily: 'DMSans-Regular',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: _Widthrapport/36,
    textAlign: 'center',
    paddingBottom: _Heightrapport/144,
    
  },
  bottomTitle: {
    position: 'absolute',
    top: _Heightrapport*0.8,
    textAlign: 'center',
    marginBottom: "10%",
    fontSize: _Heightrapport/60,
    justifyContent: 'center',
    paddingHorizontal: _Widthrapport/36,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: _Widthrapport/22.5,
    paddingVertical: _Heightrapport/60,
    borderBottomWidth: 0.25,
    borderBottomColor: '#CCCCCC66',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: _Widthrapport/7.2,
    height: _Heightrapport/14.4,
    borderRadius: _Heightrapport/36,
    
  },
  textContainer: {
    flexDirection: 'column',
    color: 'black',
    marginRight : _Widthrapport/12,
  },
  callerName: {
    fontSize: _Heightrapport/40,
    //fontWeight: 'bold',
    color: 'black',
    fontFamily: 'DMSans-Bold',
    textTransform: 'capitalize',
  },
  
  anotherIcon: {
    width: _Widthrapport/18,
    height: _Heightrapport/36,
    paddingRight : _Widthrapport/9,
  },
  text: {
    fontSize : _Heightrapport/48 ,
    width : 20 
    
  },
  cancel : {
    width : _Widthrapport/5,
    
    
  },
  loadingIndicator: {
    position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  alignItems: 'center',
  justifyContent: 'center',

  },
});

//export default App;
