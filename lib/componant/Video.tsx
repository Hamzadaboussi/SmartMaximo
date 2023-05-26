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
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {MediaStream, RTCView, permissions} from 'react-native-webrtc';
import Buttonn from './Button';
import DeviceInfo from 'react-native-device-info';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCameraRotate,
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';
import RNFS from 'react-native-fs';

import RecordScreen, { RecordingResult } from 'react-native-record-screen';
import { ButtonContainer, CameraButton, VolumeButton } from './VideoButtons';
import AudioRecorderPlayer, { AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType, OutputFormatAndroidType, RecordBackType } from 'react-native-audio-recorder-player';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { sendNotification_Record, showConfirmationDialogPermisson_Record } from '../controllers/PermissionFCM_Record';
import { onStartRecord, onStopRecord } from '../controllers/Recording';
import {formatTime, startTiimer} from "../controllers/VideoController";
import MySnackbar from './Snackbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getConversation_Id, get_CurrentUsername, get_Username_fromtoken } from '../controllers/FirebaseQuery';


interface Props {
  hangup: () => void;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  switchCamera: () => void;
  switchAudio: () => void;
  isMuted: Boolean;
  targettoken? : string;
  currentusername? : string;
}

export default function Video(props: Props) {
  const [showButtonContainer, setShowButtonContainer] = useState(true);
  const [floatingViewPosition, setFloatingViewPosition] = useState({
    x: 0,
    y: 0,
  })
  const [uri, setUri] = useState<string>('')
  const [recording, setRecording] = useState<boolean>(false)
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00')
  const [peerpermission , setpeerpermission] = useState(false)
  const [peerpermissionyes , setpeerpermissionyes] = useState(false)
  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [ConversationId, setConversationId] = useState<string>();



  useEffect(() => {
    console.log('yebro tekhdem')
    console.log(props.currentusername)
    console.log(props.targettoken)
    handelConversationId();
  },[]);

const handelConversationId = async() => {
  const targetusername =  await get_Username_fromtoken(props.targettoken)
  const id = await getConversation_Id(props.currentusername,targetusername)
  console.error("this is convid" ,id)
  setConversationId(id)
  
}

  useEffect(() => {
    if (startTime !== null) {
      const timer = setInterval(() => {
        const currentTime = Date.now();
        const elapsed = Math.floor((currentTime - startTime) / 1000); // Calculate elapsed time in seconds
        setElapsedTime(elapsed);
      }, 1000); // Update elapsed time every second

      return () => clearInterval(timer); // Clean up the timer when the component unmounts or the condition is no longer met
    }
  }, [startTime]);

  const _handleOnRecording = async () => {
    if (recording) {
      setRecording(false);
      await onStopRecord(setRecordSecs);
      const res = await RecordScreen.stopRecording().catch((error: any) =>
        console.warn("teba3 record",error)
      );

      console.log('res', res);
      if (res?.status === 'success') {
        setUri(res.result.outputURL);
        

        
      }
      
    } else {
      setUri('');
      await setRecording(true);
      onStartRecord();
      console.error("wsselt lhouny");
      setStartTime(Date.now());

      const res = await RecordScreen.startRecording({ mic: true, fps: 30, bitrate: 1024000 }).catch((error: any) => {
        
        console.warn("teba3 start record",error);
        setRecording(false);
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
      console.error('caca',props.targettoken)
      showConfirmationDialogPermisson_Record(props.targettoken?props.targettoken:"");
      const timeout = setTimeout(() => {
        setpeerpermission(false);
        
      }, 10000);
  
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [peerpermission]);
  
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
    console.log('uri:', uri);
  }, [uri]);


  useEffect(() => {
    let hideTimeout: ReturnType<typeof setTimeout> | null = null;

    // Hide the button container after a certain time
    if (showButtonContainer) {
      hideTimeout = setTimeout(() => {
        setShowButtonContainer(false);
      }, 5000); // Adjust the timeout value to your desired duration in milliseconds
    }

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [showButtonContainer]);


  
  useEffect(() => {
        
    const unsubscribeForegroundPermission_Record = messaging().onMessage(async remoteMessage => {
      console.error("boo")
      console.log('Received foreground notificationn:', remoteMessage);
      console.log("daada",peerpermission);
      //console.error(remoteMessage.data?.responce)
      if(remoteMessage.data?.Request == "recording" && peerpermission == false ){
        setpeerpermission(true);

        return;
      }
      if (remoteMessage.data?.Responce == "yes"&& peerpermissionyes == false)
      {
        console.log("ye didi")
        setpeerpermissionyes(true);
        
        
        
        return;
      }
      if(remoteMessage.data?.Responce =="no"){
        
        return;
        //permission denied
      } 
    });  
    
    return () =>{
      
      if(peerpermission == false){
        unsubscribeForegroundPermission_Record;}
         
    }
  });

  const handleSnackbarDismiss = () => {
    setTimeout(() => {
      setShowSnackbar(false);
    }, 5000); 
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
  const AskForRecord = () =>{ 
    console.error(props.targettoken)
    setShowSnackbar(true);
    sendNotification_Record(props.targettoken?props.targettoken:"" , "recording" ,""  );
  }
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

  //on Call bech n3adiw local stream mtaa l caller 9bal mayhez wala y3alle9 l calle
  if (props.localStream && !props.remoteStream) {
        return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.localStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <ButtonContainer
          hangup={props.hangup}
          switchCamera={props.switchCamera}
          switchAudio={props.switchCamera}
          isMuted={props.isMuted}
        />
      </View>
    );
  }
  //wa9t l callee yhez n3adiw local w remote
  if (props.localStream && props.remoteStream) {
    
    return (
      <SafeAreaProvider>
      <View style={styles.container}>
        <RTCView
          streamURL={props.remoteStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={styles.overlay}>{/* Floating transparent view */}
          {recording ? (
          <View style={styles.recordingMark}>
            <Text style={styles.recordingMarkText}>{ConversationId}</Text>
          </View>
        ) : (
          <View>
            
          </View>
        )}
        </View>
        </TouchableWithoutFeedback>
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
        {showButtonContainer && (
          <View style={styles.bt}>
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
            <View style={styles.btnContainer}>
        <TouchableHighlight onPress={recording?_handleOnRecording:AskForRecord}>
          <View style={styles.btnWrapper}>
            <View style={btnStyle} />
          </View>
        </TouchableHighlight>
      </View>

          </View>
          
        )}
        
        <MySnackbar visible={showSnackbar} onDismiss={handleSnackbarDismiss} />
      </View>
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
    width: 100, // Set the desired width of the floating view
    height: 150, // Set the desired height of the floating view
    backgroundColor: 'rgba(255, 255, 255, 0.0)', // Set the desired background color and transparency
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Set the desired transparency level here
    alignItems : 'center' ,
  },
  bt: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  Localvideo: {
    position: 'absolute',
    width: 100,
    height: 150,
    top: 0,
    left: 20,
    elevation: 10,
  },
  bcontainer: {
    flexDirection: 'row',
    bottom: 30,
  },
  CameraSwitch: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#333',
    bottom: 30,
    marginRight: 15,
  },
  recordingMark: {
    backgroundColor: 'red',
    marginTop : 20 ,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 24,
    width: 100,
    alignItems : 'center' ,

    
  },
  recordingMarkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
 
  
  btnContainer: {
    height: 100,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  btnDefault: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 4,
    borderStyle: 'solid',
    borderColor: '#212121',
  },
  btnActive: {
    width: 36,
    height: 36,
    backgroundColor: 'red',
    borderRadius: 8,
  },
 
  
});
