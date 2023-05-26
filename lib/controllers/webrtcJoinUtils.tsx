import React, {useEffect, useRef, useState} from 'react';
import {
  MediaStream,
  RTCView,
  RTCPeerConnection,
  RTCIceCandidate,
  MediaStreamTrack,
  RTCSessionDescription,
} from 'react-native-webrtc';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import Utils from '../../Utils';

export const switchCamera = (localStream: MediaStream | null | undefined) => {
  localStream?.getVideoTracks().forEach(track => track._switchCamera());
  console.log('localStream.getVideoTracks()', localStream?.getVideoTracks());
};

export const switchAudio = (
  localStream: MediaStream | null | undefined,
  isMuted: boolean,
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  localStream?.getAudioTracks().forEach(track => {
    track.enabled = !isMuted;
  });
  setIsMuted(prevState => !prevState);
  console.log('ismuted', isMuted);
  console.log('localStream.audio()', localStream?.getAudioTracks());
};

export const firestoreCleanUp = async (roomId: string) => {
  
  const cRef = firestore()
    .collection('meet')
    .doc(roomId)
    .collection('1')
    .doc('1');
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




export const collectIceCandidates = async (
  cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
  localName: string,
  remoteName: string,
  pc: React.MutableRefObject<RTCPeerConnection | undefined>,
) => {
  const candidteCollection = cRef.collection(localName);
  //console.log('candidteCollection', candidteCollection);
  if (pc.current) {
    // on new ICE candidate add it to firestore
    pc.current.onicecandidate = (event: any) => {
      if (event.candidate) {
        candidteCollection.add(event.candidate);
      }
    };
  }

  cRef.collection(remoteName).onSnapshot(snapshot => {
    snapshot.docChanges().forEach((change: any) => {
      if (change.type == 'added') {
        const candidate = new RTCIceCandidate(change.doc.data());

        pc.current?.addIceCandidate(candidate);
      }
    });
  });
};

export const setupWebrtc = async (
  pc: React.MutableRefObject<RTCPeerConnection | undefined>,
  setLocalStream: React.Dispatch<
    React.SetStateAction<MediaStream | null | undefined>
  >,
  setRemoteStream: React.Dispatch<React.SetStateAction<any>>,
) => {
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
  console.log('this is pc.current', pc.current);
  // Get the audio and video stream for the call
  const stream = await Utils.getStream();
  if (stream) {
    setLocalStream(stream);
    // pc.current.addStream(stream);
    stream.getTracks().forEach(track => {
      console.log('--------pc.current', pc.current);
      pc.current?.addTrack(track, stream);
    });
  }
  // Get the remote stream once it is available
  try {
    pc.current.ontrack = (event: any) => {
      console.log('event.stream', event.streams[0]);
      //console.log('onaddstream', pc.current);
      setRemoteStream(event.streams[0]);
    };
  } catch (e) {
    console.error(e, 'setup');
  }
};

export const join = async (
  connecting: React.MutableRefObject<boolean>,
  setGettinggcall: React.Dispatch<React.SetStateAction<boolean>>,
  roomId: string,
  pc: React.MutableRefObject<RTCPeerConnection | undefined>,
  setLocalStream: React.Dispatch<
    React.SetStateAction<MediaStream | null | undefined>
  >,
  setRemoteStream: React.Dispatch<React.SetStateAction<any>>,
) => {
  console.log('Joining the call');
  connecting.current = true;
  setGettinggcall(false);
  const cRef = firestore()
    .collection('meet')
    .doc(roomId)
    .collection('1')
    .doc('1');
  const offer = (await cRef.get()).data()?.offer;
  console.log('this is ', offer);

  if (offer) {
    try {
      await setupWebrtc(pc, setLocalStream, setRemoteStream);
    } catch (e) {
      console.error(e);
      console.error('ma3malch setup');
    }
    //exchanger the ice candiddate

    collectIceCandidates(cRef, 'callee', 'caller', pc);

    if (pc.current) {
      try {
        pc.current.setRemoteDescription(new RTCSessionDescription(offer));
      } catch (e) {
        console.error();
        console.log('mochkla fy setRemoteDescription');
      }
      //create the answer for the call
      //update the document with answer
      const answer = await pc.current.createAnswer();

      try {
        pc.current.setLocalDescription(answer);
      } catch (e) {
        console.log(e);
        console.log('setlocalStream probleem');
      }
      const cWithAnswer = {
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };
      cRef.update(cWithAnswer);
    }
  }
};

export const hangup = async (
    setGettinggcall: React.Dispatch<React.SetStateAction<boolean>>,
    connecting: React.MutableRefObject<boolean>,
    localStream:MediaStream | null | undefined,
    setLocalStream: React.Dispatch<
    React.SetStateAction<MediaStream | null | undefined>
  >,
  setRemoteStream: React.Dispatch<React.SetStateAction<any>>,
  pc: React.MutableRefObject<RTCPeerConnection | undefined>,
  roomId: string
) => {
    setGettinggcall(false);
    connecting.current = false;
    streamCleanUp(localStream,setLocalStream,setRemoteStream);
    firestoreCleanUp(roomId);
    if (pc.current) {
      pc.current.close();
    }
  };

  //Helper function
 export const streamCleanUp = async (
    localStream:MediaStream | null | undefined,
    setLocalStream: React.Dispatch<
    React.SetStateAction<MediaStream | null | undefined>
  >,
  setRemoteStream: React.Dispatch<React.SetStateAction<any>>,

  ) => {
    if (localStream) {
      localStream.getTracks().forEach(t => t.stop());
      localStream.release();
    }
    setLocalStream(null);
    setRemoteStream(null);
  };

  export const subscribeDelete = (
    cRef : FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    hangup: () => void
  ) => cRef.collection('callee').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type == 'removed') {
        console.error('i did that');
        hangup();
      }
    });
  });

  export const subscribe = (
    cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    connecting: React.MutableRefObject<boolean>,
    setGettinggcall: React.Dispatch<React.SetStateAction<boolean>>,
    hangup: () => void,
    setSubscribed : React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    const onSnapshotHandler = (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>) => {
      const data = snapshot.data();
      console.log('this is data ye sahby', data);
      console.log('dattttttttttta', data?.answer);
  
      if (data && data.offer && !connecting.current) {
        //join();
        setSubscribed(true);
        setGettinggcall(true);
      }
      if (!data) {
        hangup();
      }
    };
  
    const unsubscribe = cRef.onSnapshot(onSnapshotHandler);
  
    return unsubscribe;
  };
  