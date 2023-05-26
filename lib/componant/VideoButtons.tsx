import { StyleSheet, TouchableOpacity, View } from "react-native";
import Buttonn from './Button';
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCameraRotate, faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

interface Props {
    hangup: () => void;
    localStream?: MediaStream | null;
    remoteStream?: MediaStream | null;
    switchCamera: () => void;
    switchAudio: () => void;
    isMuted: Boolean;
  }
  
  export function ButtonContainer(props: Props) {
    return (
      <View style={styles.CameraSwitch}>
        <Buttonn
          iconName="phone-hangup"
          backgroundColor="red"
          onPress={props.hangup}
        />
      </View>
    );
  }
  
  export function CameraButton(props: Props) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={props.switchCamera}>
          <FontAwesomeIcon
            size={25}
            icon={faCameraRotate}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
  export function VolumeButton(props: Props) {
    return (
      <View style={styles.CameraSwitch}>
        <TouchableOpacity onPress={props.switchAudio}>
          <FontAwesomeIcon
            size={25}
            icon={props.isMuted ? faMicrophone : faMicrophoneSlash}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    
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
    
   
    
  });