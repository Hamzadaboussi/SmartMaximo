import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import Buttonn from './lib/componant/Button';
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
    //console.log(' origin current: ', pc.current);
    pc.current = new RTCPeerConnection(configuration);
    // Get the audio and video stream for the call
    const stream = await Utils.getStream();
    if (stream) {
      setLocalStream(stream);
      // pc.current.addStream(stream);
      stream.getTracks().forEach(track => {
        pc.current?.addTrack(track, stream);
      });
    }
    // Get the remote stream once it is available
    pc.current.ontrack = (event :any)=> {
      console.log('event.stream', event.streams);
      //console.log('onaddstream', pc.current);
      setRemoteStream(event.streams[0]);
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