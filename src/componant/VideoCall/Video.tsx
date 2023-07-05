import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  PermissionsAndroid,
  Platform,
  Alert,
  Button,
  TouchableHighlight,
  Dimensions,
  BackHandler,
  
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {MediaStream, RTCView, permissions} from 'react-native-webrtc';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowsUpDownLeftRight,
  faMaximize,
  faXmark,
 
} from '@fortawesome/free-solid-svg-icons';

import RecordScreen, {RecordingResult} from 'react-native-record-screen';
import {
  ButtonContainer,
  CameraButton,
  DisableVideoButton,
  MessagesButton,
  ScreenShotButton,
  VolumeButton,
} from './VideoButtons';

import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {
  sendNotification_Record,
  showConfirmationDialogPermisson_Record,
} from '../../controllers/Firebase/FCM/PermissionFCM_Record';
import {formatTime, startTiimer} from '../../controllers/VideoAssisstance/VideoController';
import MySnackbar from '../Snackbar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  Addrecords,
  getConversation_Id,
  get_CurrentUsername,
  get_Username_fromtoken,
} from '../../controllers/Firebase/Firestore/FirebaseQuery';
import ChatOverlay from './MessagesChat/ChatOverLay';
import {firebase} from '@react-native-firebase/database';
import {_Heightrapport, _Widthrapport} from '../../../StylingUtils';
import * as Animatable from 'react-native-animatable';
import Sound from 'react-native-sound';
import {ParameterButtonGroup} from './Parametre_buttonsgroup';
import storage from '@react-native-firebase/storage';
import Attachment_Video from './Attachements/Attachment_Video';
import ChatWindow from './MessagesChat/VideoChat_window';
import InCallManager from 'react-native-incall-manager';
import { subscribeToNewMessages } from '../../controllers/Firebase/RealTimeDB/MessagingRTDB';

interface Props {
  hangup: () => void;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  switchCamera: () => void;
  switchAudio: () => void;
  switchVideo: () => void;
  isMuted: Boolean;
  videoEnabled: Boolean;
  targettoken?: string;
  currentusername?: string;
  ConversationId?: string;
  role: string;
  targetusername?: string;
}

export default function Video(props: Props) {
  const [showButtonContainer, setShowButtonContainer] = useState(true);
  const [floatingViewPosition, setFloatingViewPosition] = useState({
    x: 0,
    y: 0,
  });
  const [floatingViewPosition1, setFloatingViewPosition1] = useState({
    x: _Widthrapport / 6,
    y: _Heightrapport / 12,
  });
  const [uri, setUri] = useState<string>('');
  const [recording, setRecording] = useState<boolean>(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const [peerpermission, setpeerpermission] = useState(false);
  const [peerpermissionyes, setpeerpermissionyes] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showChatOverlay, setShowChatOverlay] = useState(false); 
  const [messages, setMessages] = useState<any[]>([]);
  const [Attachments, setAttachments] = useState<any[]>([]);
  const [ShowAttachments, setShowAttachments] = useState<boolean>(false);
const [chatmaximize,setChatmaximize] = useState(false);
const [isCalling , setIsCalling] = useState(true)
const [NotificationMessage , SetNotificationMessage] = useState(false)
const [NotificationAttachement , SetNotificationAttachement] = useState(false)


  const [ringing, setRinging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  let ringingTone: Sound | null = null;
let rec = false
const imagesRef = storage().ref().child(`Attachments/${props.ConversationId}`);


  

  useEffect(() => {
    console.log('jena wahnana');
    if (props.localStream && !props.remoteStream) {
      ringingTone = new Sound(
        'internal_ringingcalling.mp3',
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            console.log('Failed to load the sound:', error);
            return;
          }
          ringingTone?.setVolume(0.1);

          ringingTone?.setNumberOfLoops(-1);
          ringingTone?.play(success => {
            if (!success) {
              console.log('Failed to play the sound');
            }
          });
        },
      );
      setRinging(true);
    } else {
      if (ringingTone) {
        ringingTone.stop();
        ringingTone.release();
      }
      setRinging(false);
    }

    return () => {
      if (ringingTone) {
        ringingTone.stop();
        ringingTone.release();
      }
    };
  }, [props.localStream, props.remoteStream]);
  
  useEffect(() => {
    const backAction = () => {
      
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    
    InCallManager.setSpeakerphoneOn(true);

   
    return () => {
      backHandler.remove();
      InCallManager.setSpeakerphoneOn(false);
    };
  }, []);
  useEffect(() => {
    if (startTime !== null) {
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
        setElapsedTime(elapsed);
      }, 1000); 

      return () => clearInterval(timer); 
    }
  }, [startTime]);

  const _handleOnRecording = async () => {
    if (recording) {
      //await onStopRecord(setRecordSecs);
      const res = await RecordScreen.stopRecording().catch((error: any) =>
        console.warn('teba3 record', error),
      );

      console.log('res', res);
      if (res?.status === 'success') {
        setUri(res.result.outputURL);
        await Addrecords(
          props.ConversationId,
          res.result.outputURL,
          props.role,
          formatTime(elapsedTime),
        );
      }
      setRecording(false);
      rec = false
      setElapsedTime(0);
    } else {
      setUri('');
      await setRecording(true);
      rec =true ;
      //onStartRecord();
      console.error('wsselt lhouny');
      setStartTime(Date.now());

      const res = await RecordScreen.startRecording({
        mic: true,
        fps: 30,
        bitrate: 1024000,
      }).catch((error: any) => {
        console.warn('teba3 start record', error);
        setRecording(false);
      rec =false ;

        setUri('');
      });

      if (res === RecordingResult.PermissionError) {
        Alert.alert(res);
        setRecording(false);
        setUri('');
      }
    }
  };

  useEffect(() => {
    if (peerpermission) {
      console.error('caca', props.targettoken);
      showConfirmationDialogPermisson_Record(
        props.targettoken ? props.targettoken : '',
      );
      const timeout = setTimeout(() => {
        setpeerpermission(false);
      }, 10000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [peerpermission]);

  // useEffect(() => {
  //   if (!props.remoteStream) {
      
  //     const timeout = setTimeout(() => {
        
  //       props.hangup();
  //     }, 100000);

  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, []);
  

  useEffect(() => {
    if (peerpermissionyes) {
      _handleOnRecording();

      const timeout = setTimeout(() => {
        setpeerpermissionyes(false);
      }, 10000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [peerpermissionyes]);

  const btnStyle = useMemo(() => {
    return recording ? styles.btnActive : styles.btnDefault;
  }, [recording]);

  

  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    
    if (showButtonContainer) {
      hideTimeout = setTimeout(() => {
        setShowButtonContainer(false);
        setExpanded(false);
      }, 10000); 
    }

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [showButtonContainer]);

  useEffect(() => {
    const unsubscribeForegroundPermission_Record = messaging().onMessage(
      async remoteMessage => {
        console.error('boo');
        console.log('Received foreground notificationn:', remoteMessage);
        console.log('daada', peerpermission);
        //console.error(remoteMessage.data?.responce)
        if (
          remoteMessage.data?.Request == 'recording' &&
          peerpermission == false
        ) {
          setpeerpermission(true);

          return;
        }
        if (
          remoteMessage.data?.Responce == 'yes' &&
          peerpermissionyes == false
        ) {
          console.log('ye didi');
          setpeerpermissionyes(true);

          return;
        }
        if (remoteMessage.data?.Responce == 'no') {
          return;
          //permission denied
        }
      },
    );

    return () => {
      if (peerpermission == false) {
        unsubscribeForegroundPermission_Record;
      }
    };
  });

  const handleSnackbarDismiss = () => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 5000);
  };

  useEffect(() => {
    console.log(
      'tatata conversation id',
      props.ConversationId,
      props.currentusername,
    );
    const conversationRef = firebase
      .app()
      .database(
        'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
      )
      .ref('conversations')
      .child(props.ConversationId ? props.ConversationId.toString() : 'kkk');
    const loadMessages = () => {
      conversationRef.once('value', snapshot => {
        
        const conversationData = snapshot.val();
        if (conversationData) {
          const messageList = Object.values(conversationData);
          setMessages(messageList);
        }
      });

      loadMessages();
      
    };
    //load the attachment 
    //getDownloadURLs(imagesRef,setAttachments) 
    return () => {
      conversationRef.off('child_added');
    };
  }, [props.ConversationId]);

  useEffect(() => {
    console.log(
      'Attachment conversation id',
      props.ConversationId,
      props.currentusername,
    );
    const AttachementsRef = firebase
      .app()
      .database(
        'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
      )
      .ref('conversations')
      .child(props.ConversationId ? props.ConversationId.toString() : 'kkk');
    const loadAttachaments = () => {
      AttachementsRef.once('value', snapshot => {
        const AttachmentData = snapshot.val();
        if (AttachmentData) {
          const messageList = Object.values(AttachmentData);
          setAttachments(messageList);
        }
      });

      loadAttachaments();
      
    };
    //load the attachment 
    //getDownloadURLs(imagesRef,setAttachments) 
    return () => {
      AttachementsRef.off('child_added');
    };
  }, [props.ConversationId]);

//Onmessge recieved
  useEffect(() => {
    const conversationRef = firebase
      .app()
      .database(
        'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
      )
      .ref('conversations')
      .child(props.ConversationId ? props.ConversationId.toString() : 'kkk');
      conversationRef.on('child_added', snapshot => {
        const newMessage = snapshot.val();
        console.log('newmeessage')
        SetNotificationMessage(true);
      });
      
    return () => {
      conversationRef.off('child_added');
    };
  }, [props.ConversationId]);

  //onAttachement Sent
  useEffect(() => {
    const AttachmentsRef = firebase
      .app()
      .database(
        'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
      )
      .ref('Attachements')
      .child(props.ConversationId ? props.ConversationId.toString() : 'kkk');

    

      AttachmentsRef.on('child_added', snapshot => {
        const newAttachame = snapshot.val();
        console.log('new attachement');
        SetNotificationAttachement(true)
      });

    return () => {
      AttachmentsRef.off('child_added');
    };
  }, [props.ConversationId]);
  const switchmessage = async () => {
    setShowChatOverlay(!showChatOverlay);
  };

  const handlePress = () => {
    // Show the button container again when the user clicks on the screen
    if (showButtonContainer == false) {
      setShowButtonContainer(true);
    }
    if (showButtonContainer == true) {
      setShowButtonContainer(false);
    }
  };
  const AskForRecord = () => {
    _handleOnRecording();
    // console.error(props.targettoken)
    // setShowSnackbar(true);
    // sendNotification_Record(props.targettoken?props.targettoken:"" , "recording" ,""  );
  };
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      // Update the position of the floating view based on the user's gesture
      const {dx, dy} = gestureState;
      setFloatingViewPosition(prevPosition => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy,
      }));
    },
  });
  const panResponder1 = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      
      return gestureState.moveY < Dimensions.get('window').height / 2;
    },
    onPanResponderMove: (_, gestureState) => {
      
      const {dx, dy} = gestureState;
      setFloatingViewPosition1(prevPosition => ({
        x: prevPosition.x + dx,
        y: prevPosition.y + dy,
      }));
    },
  });

  //Calling phase before the target user takes any actions
  if (props.localStream && !props.remoteStream && props.role == 'caller') {
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <View style={styles.ringing}>
          <Text style={styles.callinginfotext}>You are calling</Text>
          <Text style={styles.callinginfotext1}>{props.targetusername}</Text>
          <Animatable.View
            animation="jello"
            easing="ease-out"
            iterationCount="infinite"
            iterationDelay={1000}
            style={{transform: [{scale: 4}]}}>
            <Text style={styles.callinginfotext2}>Ringing ... </Text>
          </Animatable.View>
        </View>
        <ButtonContainer
          hangup={props.hangup}
          switchCamera={props.switchCamera}
          switchAudio={props.switchCamera}
          isMuted={props.isMuted}
        />
      </View>
    );
  }
  //When the call is established
  if (props.localStream && props.remoteStream) {
    
    const tracks = props.remoteStream?.getVideoTracks();
    const isRemoteVideoEnabled = tracks
      ? tracks.every(track => !track.muted)
      : false;
    
    return (
      <SafeAreaProvider>
        <View style={styles.container}>
          <RTCView
            streamURL={props.remoteStream.toURL()}
            objectFit={'cover'}
            style={styles.video}
          />
          {isRemoteVideoEnabled ? (
            <View></View>
          ) : (
            <View style={styles.greyComponent}>
              <Animatable.View
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite">
                <View style={styles.cercleConatiner}>
                  <View style={styles.innercercle}>
                    <Text style={styles.character}>{props.targetusername?props.targetusername.toUpperCase()[0]:"M"}</Text>
                  </View>
                </View>
              </Animatable.View>
            </View>
          )}
          <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.overlay}>
              {/* Floating transparent view */}
              {recording ? (
                <View style={styles.recordingMark}>
                  <Text style={styles.recordingMarkText}>
                    {formatTime(elapsedTime)}
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
            </View>
          </TouchableWithoutFeedback>

          {showButtonContainer && (
            <View style={styles.bt}>
              {/* <ScreenShotButton
              onCapture={()=>console.log('handleCaptureScreen')}
            /> */}

              <DisableVideoButton
                hangup={props.hangup}
                switchCamera={props.switchVideo}
                switchAudio={props.switchVideo}
                isMuted={props.videoEnabled}
              />

              <CameraButton
                hangup={props.hangup}
                switchCamera={props.switchCamera}
                switchAudio={props.switchCamera}
                isMuted={props.isMuted}
              />
              <ButtonContainer
                hangup={props.hangup}
                switchCamera={props.switchCamera}
                switchAudio={props.switchCamera}
                isMuted={props.isMuted}
              />
              <VolumeButton
                hangup={props.hangup}
                switchCamera={props.switchCamera}
                switchAudio={props.switchAudio}
                isMuted={props.isMuted}
              />

              <ParameterButtonGroup
                setShowChatOverlay={setShowChatOverlay}
                showChatOverlay={showChatOverlay}
                chatmaximize = {chatmaximize}
                setChatmaximize = {setChatmaximize}
                recording={recording}
                _handleOnRecording={_handleOnRecording}
                AskForRecord={AskForRecord}
                btnStyle={btnStyle}
                setExpanded={setExpanded}
                expanded={expanded}
                setShowAttachments={setShowAttachments}
                ShowAttachments={ShowAttachments}
                setShowButtonContainer = {setShowButtonContainer}
                SetNotificationAttachement = {SetNotificationAttachement}
                NotificationAttachement = {NotificationAttachement}
                SetNotificationMessage  ={SetNotificationMessage}
                NotificationMessage = {NotificationMessage}
              />
            </View>
          )}
          {props.videoEnabled ? (
            <View
              style={[
                styles.floatingView,
                {top: floatingViewPosition.y, left: floatingViewPosition.x},
              ]}
              {...panResponder.panHandlers}>
              <RTCView
                streamURL={props.localStream.toURL()}
                objectFit={'cover'}
                style={styles.Localvideo}
              />
            </View>
          ) : (
            <View />
          )}
          {showChatOverlay && (
            <ChatOverlay
              conversationId={
                props.ConversationId ? parseInt(props.ConversationId) : 123
              }
              messages={messages || []}
              current_username={props.currentusername}
              target_token={props.targettoken}
              setIsMoving={setIsMoving}
              top={floatingViewPosition1.y}
              left={floatingViewPosition1.x}
            />
          )}
          {showChatOverlay && (
            <View
              style={[
                styles.floatingView1,
                {top: floatingViewPosition1.y, left: floatingViewPosition1.x},
              ]}>
              <View style = {{flexDirection : 'column'}}>
              
                  <TouchableOpacity onPress={()=>{setShowChatOverlay(false)}}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    style={styles.close}
                    size={_Heightrapport / 26}
                  />
                  </TouchableOpacity>
                
                <View {...panResponder1.panHandlers}>
                  <FontAwesomeIcon
                    icon={faArrowsUpDownLeftRight}
                    style={styles.Movemessages}
                    size={_Heightrapport / 24}
                  />
                </View>
                <View >
                  <TouchableOpacity onPress={()=>{setChatmaximize(true);setShowChatOverlay(false)}}>
                  <FontAwesomeIcon
                    icon={faMaximize}
                    style={styles.maximize}
                    size={_Heightrapport / 26}
                  />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          {ShowAttachments && (
            <Attachment_Video 
            Attachments={Attachments?Attachments:[]}
            setShowAttachments={setShowAttachments}
            ConversationId={
              props.ConversationId ? props.ConversationId : "123"
            }
            imagesRef = {imagesRef}
            
            
            />
          )}
          {chatmaximize && (
            <ChatWindow
            conversationId={
              props.ConversationId ? parseInt(props.ConversationId) : 123
            }
            messages={messages || []}
            current_username={props.currentusername}
            target_token={props.targettoken}
            setChatmaximize = {setChatmaximize}
            setShowChatOverlay = {setShowChatOverlay}
          />
          )}
        </View>

        <MySnackbar visible={showSnackbar} onDismiss={handleSnackbarDismiss} />
      </SafeAreaProvider>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  floatingView: {
    position: 'absolute',
    width: _Heightrapport / 7.5, 
    height: (_Heightrapport / 7.5) * 1.5, 
    backgroundColor: 'rgba(255, 255, 255, 0.0)', 
  },
  floatingView1: {
    position: 'absolute',
    width: _Heightrapport > 1000 ? '15%' : '25%',
    height: '10%',
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  overlay: {
    position: 'absolute',
    height: _Heightrapport,
    width: _Widthrapport,
    backgroundColor: 'rgba(0, 0, 0, 0)', 
    alignItems: 'center',
  },
  bt: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  Localvideo: {
    position: 'absolute',
    width: _Heightrapport / 7.5,
    height: (_Heightrapport / 7.5) * 1.5,
    top: 5,
    left: 20,
    elevation: 10,
  },
  bcontainer: {
    flexDirection: 'row',
    bottom: _Heightrapport / 24,
  },
  CameraSwitch: {
    width: _Widthrapport / 6,
    height: _Widthrapport / 6,
    borderRadius: _Heightrapport / 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#333',
    bottom: _Heightrapport / 24,
    marginRight: _Widthrapport / 24,
  },
  recordingMark: {
    backgroundColor: 'red',
    marginTop: _Heightrapport / 36,
    paddingVertical: _Heightrapport / 120,
    paddingHorizontal: _Widthrapport / 22.5,
    marginBottom: _Heightrapport / 72,
    borderRadius: _Heightrapport / 30,
    width: _Widthrapport / 3.6,
    alignItems: 'center',
  },
  recordingMarkText: {
    fontSize: _Widthrapport / 25.7,
    fontWeight: 'bold',
    color: '#fff',
  },

  btnContainer: {
    bottom: _Heightrapport / 24,
    //height: _Heightrapport/7.2,
    paddingTop: _Heightrapport / 60,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: _Heightrapport / 14,
    height: _Heightrapport / 14,
    backgroundColor: '#fff',
    borderRadius: _Heightrapport / 24,
  },
  btnDefault: {
    width: _Heightrapport / 20,
    height: _Heightrapport / 20,
    backgroundColor: '#fff',
    borderRadius: _Heightrapport / 30,
    borderWidth: _Heightrapport / 180,
    borderStyle: 'solid',
    borderColor: '#212121',
  },
  btnActive: {
    width: _Heightrapport / 20,
    height: _Heightrapport / 20,
    backgroundColor: 'red',
    borderRadius: _Heightrapport / 90,
  },
  overlayContainer: {
    position: 'absolute',
    
    width:
      _Heightrapport > 1000 ? (_Widthrapport * 0.75) / 2 : _Widthrapport / 2,
    height:
      _Heightrapport > 1000 ? (_Heightrapport * 0.75) / 2 : _Heightrapport / 2,
  },

  ringing: {
    position: 'absolute',
    top: _Heightrapport / 5,
    left: _Widthrapport / 10,
    right: _Widthrapport / 10,

    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  callinginfotext: {
    fontSize: _Heightrapport / 32,
    fontFamily: 'DMSans-Regular',
    color: 'white',
  },
  callinginfotext1: {
    fontSize: _Heightrapport / 13,
    fontFamily: 'DMSans-Medium',
    color: 'white',
    textTransform: 'capitalize',
  },
  callinginfotext2: {
    paddingTop: _Heightrapport / 14,
    fontSize: _Heightrapport / 36,
    fontFamily: 'DMSans-Regular',
    color: 'white',
  },
  Movemessages: {
    color: '#FDB215',
    marginBottom: 0,
    alignSelf: 'center',
    alignContent: 'center',
    marginTop:
    _Heightrapport > 1000 ? (_Heightrapport * 0.75) / 14 : _Heightrapport / 14,
    marginRight:
      _Heightrapport > 1000 ? (_Widthrapport * 0.75) / 3.3 : _Widthrapport / 2.6,
  },
  maximize: {
    color: '#FDB215',
    marginBottom: 0,
    alignSelf: 'center',
    alignContent: 'center',
    marginTop:
    _Heightrapport > 1000 ? (_Heightrapport * 0.75) / 14 : _Heightrapport / 14,
    marginRight:
      _Heightrapport > 1000 ? (_Widthrapport * 0.75) / 3.3 : _Widthrapport / 2.6,
  },
  close: {
    color: '#FDB215',
    marginBottom: 0,
    alignSelf: 'center',
    alignContent: 'center',
    marginTop:
      _Heightrapport > 1000 ? (_Heightrapport * 0.75) / 7 : _Heightrapport / 7,
    marginRight:
      _Heightrapport > 1000 ? (_Widthrapport * 0.75) / 3.3 : _Widthrapport / 2.6,
  },
  greyComponent: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'grey',
    width: _Widthrapport,
    height: _Heightrapport,
    alignItems: 'center',

    justifyContent: 'center',
  },
  cercleConatiner: {
    height: _Heightrapport / 4,
    width: _Heightrapport / 4,
    backgroundColor: '#403d39',
    borderRadius: 300,
    alignItems: 'center',

    justifyContent: 'center',
  },
  innercercle: {
    height: _Heightrapport / 4.5,
    width: _Heightrapport / 4.5,
    backgroundColor: '#eb5e28',
    borderRadius: 300,
    alignItems: 'center',

    justifyContent: 'center',
  },
  character: {
    fontSize: _Heightrapport/9,
    fontFamily: 'DMSans-Bold',
    color: 'white',
    textTransform: 'capitalize',
  },
});
