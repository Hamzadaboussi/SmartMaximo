import { StyleSheet, TouchableOpacity, View } from "react-native";
import Buttonn from './Button';
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faVolumeUp,faCameraRotate,faBars, faMicrophone,faPencil,faMicrophoneSlash ,faMessage, faVideo, faVideoSlash, faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { _Heightrapport, _Widthrapport } from "../../../StylingUtils";

interface Props {
    hangup: () => void;
    localStream?: MediaStream | null;
    remoteStream?: MediaStream | null;
    switchCamera: () => void;
    switchAudio: () => void;
    isMuted: Boolean;
  }
  interface Props2 {
    switchmessage : () => void;
    NotificationMessage: boolean

  }
  interface Props3 {
    onCapture: () => void;
    NotificationAttachement: boolean
    NotificationMessage: boolean
   
  }
  interface Props5 {
    onCapture: () => void;
    NotificationAttachement: boolean
    
   
  }
  interface Props4 {
    onCapture: () => void;
    isclicked : boolean;   
   
  }
  
  export function ButtonContainer(props: Props) {
    return (
      <View style={styles.hungupbutton}>
        <Buttonn
          iconName="phone-hangup"
          backgroundColor="red"
          onPress={props.hangup}
        />
      </View>
    );
  }

  
  export function SwitchAudio(props: Props4) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={props.onCapture}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={faVolumeUp}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
  
  export function CameraButton(props: Props) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={props.switchCamera}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={faCameraRotate}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
  
  export function DisableVideoButton(props: Props) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={props.switchCamera}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={props.isMuted ?faVideo : faVideoSlash}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
  
  export function ScreenShotButton(props: Props5) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={props.onCapture}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={faPaperclip}
            style={{color: '#FFF', alignItems: 'center'}}
          />
                  
        </TouchableOpacity>
        {props.NotificationAttachement &&(
            <View style={styles.NotificationDot} />
          )}
      </View>
    );
  }
  export function VolumeButton(props: Props) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={props.switchAudio}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={props.isMuted ? faMicrophone : faMicrophoneSlash}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  export function MessagesButton(props: Props2) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={()=>props.switchmessage()}>
          <FontAwesomeIcon
            size={ (_Heightrapport/24)}
            icon={faMessage}
            style={{color: '#FFF', alignItems: 'center'}}
          />
          
        </TouchableOpacity>
        {props.NotificationMessage &&(
            <View style={styles.NotificationDot} />
          )}
      </View>
    );
  }
  export function ParamaitresButton(props: Props3) {
    return ( 
      <View style={styles.paramaitre}>
        
          <FontAwesomeIcon
            size={ (_Heightrapport/30)}
            icon={faBars}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        {props.NotificationAttachement &&(
            <View style={styles.NotificationDot} />
          )}
        {props.NotificationMessage &&(
            <View style={styles.NotificationDot} />
          )}
      </View>
    );
  }
  const styles = StyleSheet.create({
    paramaitre: {
      width:  (_Heightrapport/12),
      height:  (_Heightrapport/12),
      borderRadius: (_Heightrapport/24),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#333',
     
      marginRight: _Heightrapport/144,
    },
    
    CameraSwitch: {
      width:  (_Heightrapport/12),
      height:  (_Heightrapport/12),
      borderRadius: (_Heightrapport/24),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#333',
      bottom: _Heightrapport/24,
      marginRight: _Heightrapport/144,
    },
    hungupbutton : {
      width: _Heightrapport/10.3,
      height: _Heightrapport/10.3,
      borderRadius: _Heightrapport/24,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      
      bottom: _Heightrapport/24,
      marginRight: _Heightrapport/144,
    },
    NotificationDot: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 13,
      height: 13,
      borderRadius: 5,
      backgroundColor: 'red',
    },
  
   
    
  });