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
import {  setupWebrtc } from './webrtcJoinUtils';

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
  

export const create = async (
    pc: React.MutableRefObject<RTCPeerConnection | undefined>,
    connecting: React.MutableRefObject<boolean>,
    roomId: string,
    setLocalStream: React.Dispatch<
    React.SetStateAction<MediaStream | null | undefined>
  >,
  setRemoteStream: React.Dispatch<React.SetStateAction<any>>,

  ) => { 
    let sessionConstraints = {
    mandatory: {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true,
      VoiceActivityDetection: true
    }
  };
  console.log("calling");
  connecting.current = true ; 
  await setupWebrtc(pc, setLocalStream, setRemoteStream);
  console.error("createwaaaa ",roomId);
  //document for the call
  //while (!roomId) {
    //console.log("boucle")
  //};
  const cRef = firestore().collection("meet").doc(roomId).collection("1").doc("1");
  
collectIceCandidates(cRef,"caller","callee",pc);
  console.error('ye john');
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

export const subscribe = (
    pc: React.MutableRefObject<RTCPeerConnection | undefined>,
    cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    
    

  ) => {
    const onSnapshotHandler = (snapshot: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>) => {
        const data = snapshot.data();
        console.log("dattttttttttta",data?.answer)
  
        //answer start call 
        if(pc.current && !pc.current.remoteDescription && data && data.answer){
          pc.current.setRemoteDescription(new RTCSessionDescription(data.answer??"")).catch((error) => {
            console.error(error);
          });
          console.log("9bel lappel");
          
        }
    };
  
    const unsubscribe = cRef.onSnapshot(onSnapshotHandler);
  
    return unsubscribe;
  };

export const handleRetrieveUsers = (
    setUsers : React.Dispatch<React.SetStateAction<UserC[]>>

) => {
    const usersRef = firestore().collection('users');
  
    usersRef
      .get()
      .then((querySnapshot) => {
        const userList: UserC[] = [];
        querySnapshot.forEach((documentSnapshot) => {
          const user: UserC = {
            username: documentSnapshot.data().username,
            token: documentSnapshot.data().deviceToken,
          };
          userList.push(user);
        });
        setUsers(userList);
      })
      .catch((error) => {
        console.log('Error retrieving users: ', error);
      });
  };
