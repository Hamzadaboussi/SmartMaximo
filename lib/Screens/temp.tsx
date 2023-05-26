import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Buttonn from './lib/componant/Button';
import GettingCall from './lib/componant/GettingCall';
import Video from './lib/componant/Video';
import { MediaStream, RTCView, RTCPeerConnection, RTCIceCandidate, MediaStreamTrack, RTCSessionDescription } from 'react-native-webrtc';
import DeviceInfo from 'react-native-device-info';

import Utils from './Utils';
import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';


const configuration = {"iceServers": [{"url":"stun:stun.l.google.com:19302"}]};
export default function App() {
  const [localStream, setLocalStream] = useState<MediaStream | null>()
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>()
  const [gettingCall, setGettinggcall] = useState(false);
  const [roomId, setRoomId] = useState('');
 
  const pc = useRef<RTCPeerConnection>();
  const connecting = useRef(false);

  useEffect(() => {
    console.log("dkhal l use effect");
    const cRef = firestore().collection('meet').doc('chatId');
    const subscribe = cRef.onSnapshot(snapshot => {
      const data = snapshot.data();
      console.log("dattttttttttta",data?.answer)

      //answer start call 
      if(pc.current && !pc.current.remoteDescription && data && data.answer){
        pc.current.setRemoteDescription(new RTCSessionDescription(data.answer)).catch((error) => {
          console.error(error);
        });
        console.log("9bel lappel");
        console.log
      }

      //if there is an offer for chatId set the getting call flag 

      if(data && data.offer && !connecting.current){
        setGettinggcall(true);
      }
      
    });

    //on delete of collection call hangup 
    //te other side has clicked on hangup
    const subscribeDelete = cRef.collection('callee').onSnapshot(snapshot => {
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
    //console.log(' origin current: ', pc.current);
    pc.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: 'stun:stun.l.google.com:19302',
        },
        {
          urls: 'stun:stun1.l.google.com:19302',
        },
        {
          urls: 'stun:stun2.l.google.com:19302',
        },
      ],
    });
    console.log('this is pc.current',pc.current);
    // Get the audio and video stream for the call
    const stream = await Utils.getStream();
    if (stream) {
      setLocalStream(stream);
      // pc.current.addStream(stream);
      stream.getTracks().forEach(track => {
        console.log('--------pc.current',pc.current);
        pc.current?.addTrack(track, stream);
      });
    }
    // Get the remote stream once it is available
    try{pc.current.ontrack = (event :any )=> {
      console.log('event.stream', event.streams[0]);
      //console.log('onaddstream', pc.current);
      setRemoteStream(event.streams[0]);}
      
    }
    catch(e){
      console.error(e,"setup")
    }
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
    const cRef = firestore().collection('meet').collection('1').doc('chatId');
    collectIceCandidates(cRef,"caller","callee");
    if(pc.current){
      //create the offrer of the call 
      const offer = await pc.current.createOffer(sessionConstraints);
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
    console.log("dattttttttttta",offer.answer)
    
    if (offer){
      try{
      await setupWebrtc();}
      catch(e){
        console.error(e);
        console.error("ma3malch setup");
      }
      //exchanger the ice candiddate
      
      collectIceCandidates(cRef,"callee", "caller");
     
      if (pc.current){
        try{
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));}
        catch(e){
          console.error();
          console.log("mochkla fy setRemoteDescription");
        }
        //create the answer for the call
        //update the document with answer
        const answer = await pc.current.createAnswer();
        
        try{
        pc.current.setLocalDescription(answer);}
        catch(e){
          console.log(e);
          console.log("setlocalStream probleem")
        }
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
    const candidteCollection = cRef.collection(localName);
    
    //console.log('candidteCollection', candidteCollection);
    if (pc.current) {
      // on new ICE candidate add it to firestore
      pc.current.onicecandidate = (event:any) => {
        if (event.candidate) {
          candidteCollection.add(event.candidate);
        }
      };
    }

    cRef.collection(remoteName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach((change : any) => {
        if (change.type == 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());

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
    console.log('wsselna l video');
    console.log(localStream.toURL() ,"-----", DeviceInfo.getUniqueId());
    console.log(remoteStream?.toURL(),"-----", DeviceInfo.getUniqueId());
    
    return <Video
      hangup={hangup}
      localStream={localStream}
      remoteStream={remoteStream} />
      
  }
  


  return (
    <View style={styles.container}>
      <Buttonn iconName='video'backgroundColor='grey' onPress={create}/>
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

