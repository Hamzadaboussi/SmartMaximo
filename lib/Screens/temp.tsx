import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Button from './lib/componant/Button';
import GettingCall from './lib/componant/GettingCall';
import Video from './lib/componant/Video';
import { MediaStream, RTCView, RTCPeerConnection, RTCIceCandidate, MediaStreamTrack, RTCSessionDescription } from 'react-native-webrtc';


import Utils from './Utils';
import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';


const configuration = {"iceServers": [{"url":"stun:stun.l.google.com:19302"}]};
export default function App() {
  const [localStream, setLocalStream] = useState<MediaStream | null>()
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>()
  const [gettingCall, setGettinggcall] = useState(false);
  const pc = useRef<RTCPeerConnection>()
  const connecting = useRef(false);

  useEffect(() => {
    const cRef = firestore().collection('meet').doc('chatId');
    const subscribe = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();

      //answer start call 
      if(pc.current && !pc.current.remoteDescription && data && data.answer){
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
      }

      //if there is an offer for chatId set the getting call flag 

      if(data && data.offer && !connecting.current){
        setGettinggcall(true);
      }
    });

    //on delete of collection call hangup 
    //te other side has clicked on hangup
    const subscribeDelete = cRef.collection('calle').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type == 'removed'){
          hangup()
        }
      });
    });
    return () =>{
      subscribe();
      subscribeDelete();
    }
  });

  const setupWebrtc = async () => {
    pc.current = new RTCPeerConnection(configuration);
    
    const stream = await Utils.getStream();
    if (stream) {
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        pc.current?.addTrack(track, stream);
      });
    }
  
    pc.current.onaddstream = (event: any) => {
      setRemoteStream(event.stream);
    };
    
    
    
  };
  
  const create = async () => { 
    let sessionConstraints = {
      mandatory: {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
        VoiceActivityDetection: true
      }
    };
    console.log("calling");
    connecting.current = true ; 
    await setupWebrtc();
    //document for the call
    const cRef = firestore().collection("meet").doc("chatId");
    collectIceCandidates(cRef,"caller","callee");
    if(pc.current){
      //create the offrer of the call 
      const offer = await pc.current.createOffer(sessionConstraints );
      pc.current.setLocalDescription(offer);
    
    const cWithOffer = { 
      offer : {
        type : offer.type ,
        sdp : offer.sdp ,
      },
    };
    cRef.set(cWithOffer);
  }
    

  };


  const join = async () => {
    console.log('Joining the call');
    connecting.current = true ;
    setGettinggcall(false); 
    const cRef = firestore().collection("meet").doc("chatId");
    const offer = (await cRef.get()).data()?.offer;
    if (offer){
      await setupWebrtc();
      //exchanger the ice candiddate

      collectIceCandidates(cRef,"callee", "caller");
      if (pc.current){
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));
        //create the answer for the call
        //update the document with answer
        const answer = await pc.current.createAnswer();
        pc.current.setLocalDescription(answer);
        const cWithAnswer = { 
          answer : { 
            type : answer.type , 
            sdp : answer.sdp,
          },
        };
        cRef.update(cWithAnswer);
      }
    }
    
   };

   //for discnnecting te call close the connection , release the stream 
  //and delete the document for the  call 
        
  const hangup = async () => { 
    setGettinggcall(false);
    connecting.current = false ; 
    streamCleanUp();
    firestoreCleanUp();
    if(pc.current){
      pc.current.close();
    }

  };

  //Helper function
  const streamCleanUp = async () => {
    if (localStream){
      localStream.getTracks().forEach(t=> t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
   };
  const firestoreCleanUp = async () => { 
    const cRef = firestore().collection('meet').doc('chatId');
    if(cRef){
      const calleeCandidate = await cRef.collection('callee').get();
      calleeCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      })
      const callerCandidate = await cRef.collection('caller').get();
      callerCandidate.forEach(async (candidate) => {
        await candidate.ref.delete();
      })
      cRef.delete();
    }
  }; 

  const collectIceCandidates = async (cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>, localName: string, remoteName: string) => {
    const candidateCollection = cRef.collection(localName);
    if (pc.current) {
      // Your logic here
      pc.current.onicecandidate = (event : any) =>{
        if(event.candidate){
          candidateCollection.add(event.candidate);
        }
      };
    }

    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach((change : any) => {
        if(change.type == 'added'){
          const candidate = new RTCIceCandidate(change.doc.data())
          pc.current?.addIceCandidate(candidate);
        }
      })
    })
  };
  //ken fomma call yhezna l gettingcall component
  if (gettingCall) {
    return <GettingCall hangup={hangup} join={join} />;
  }
  //yhezna l video 
  if (localStream) {
    return <Video
      hangup={hangup}
      localStream={localStream}
      remoteStream={remoteStream} />
  }
  


  return (
    <View style={styles.container}>
      <Button iconName='video'backgroundColor='grey' onPress={create}/>
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
})




//export default App;


import React from 'react';
import { SafeAreaView, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import 'react-native-crypto';


const generateJWT = () => {
  const payload = {
    iss: 'd5daE6aNRrWVACNuQSbNSQ',
    exp: Math.floor(Date.now() / 1000) + 60 * 60 // Token valid for 1 hour
  };
  const token = jwt.sign(payload, 'oc6CoSN08Fs4JB1zgXhQUwRp0HLnvx2xbJku');
  return token;
};

const getCurrentUser = async () => {
  const token = generateJWT();
  const url = 'https://api.zoom.us/v2/users/me';
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const { id } = response.data;
  return id;
};

const startZoomMeeting = async () => {
  try {
    const userId = await getCurrentUser();
    const token = generateJWT();
    const url = `https://api.zoom.us/v2/users/${userId}/meetings`;
    const response = await axios.post(url, {
      topic: 'New Meeting',
      type: 1,
      duration: 60,
      settings: {
        join_before_host: true
      }
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const { join_url, password } = response.data;
    console.log(`Meeting URL: ${join_url}\nMeeting Password: ${password}`);
  } catch (error) {
    console.log('Failed to start Zoom meeting:', error);
  }
};

function App() {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={startZoomMeeting}>
        <Text>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default App;


//yo
import React from 'react';
import NavigationStack from './lib/Screens/stack/stacknavigation';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './lib/Screens/Login';
import WorkOrderList from './lib/Screens/Workorderslist_Screen';
import { createStackNavigator } from '@react-navigation/stack';
import jwt from 'jsonwebtoken';

const Stack = createStackNavigator();
const token = jwt.sign({ username: 'johndoe' }, 'mysecretkey');

console.log(token)

function App(): JSX.Element {
  return (

    <NavigationContainer>
      <NavigationStack />
    </NavigationContainer>

  );
}

export default App;


import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Jitsi from './Jitsi';

const App = () => {
  const [joinMeeting, setJoinMeeting] = useState(false);
  const [error, setError] = useState<any>(null);


  const handleJoinMeeting = () => {
    try {
      setJoinMeeting(true);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            {joinMeeting ? (
              <Jitsi />
            ) : (
              <TouchableOpacity
                onPress={handleJoinMeeting}
                style={{ width: 200, marginTop: 10 }}>
                <Text
                  style={{
                    color: '#000',
                    borderWidth: 1,
                    borderColor: '#000',
                    padding: 10,
                    textAlign: 'center',
                  }}>
                  Join Meeting
                </Text>
              </TouchableOpacity>
            )}
            {error && (
              <View>
                <Text style={{ color: 'red' }}>{error.message}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  body: {
    height: 600,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
