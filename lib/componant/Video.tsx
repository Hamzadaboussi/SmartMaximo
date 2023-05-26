import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MediaStream, RTCView} from 'react-native-webrtc';
import Buttonn from './Button';
import DeviceInfo from 'react-native-device-info';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCameraRotate,
  faMicrophone,
  faMicrophoneSlash,
} from '@fortawesome/free-solid-svg-icons';

interface Props {
  hangup: () => void;
  localStream?: MediaStream | null;
  remoteStream?: MediaStream | null;
  switchCamera: () => void;
  switchAudio: () => void;
  isMuted: Boolean;
}

function ButtonContainer(props: Props) {
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

function CameraButton(props: Props) {
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
function VolumeButton(props: Props) {
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

export default function Video(props: Props) {
  const [showButtonContainer, setShowButtonContainer] = useState(true);
  const [floatingViewPosition, setFloatingViewPosition] = useState({
    x: 0,
    y: 0,
  });

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
  const handlePress = () => {
    // Show the button container again when the user clicks on the screen
    if (showButtonContainer == false) {
      setShowButtonContainer(true);
    }
    if (showButtonContainer == true) {
      setShowButtonContainer(false);
    }
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
    console.log(
      'remote url ?',
      props.remoteStream.toURL(),
      '-----',
      DeviceInfo.getUniqueId(),
    );
    console.log(props.remoteStream?.getVideoTracks().length > 0);
    return (
      <View style={styles.container}>
        <RTCView
          streamURL={props.remoteStream.toURL()}
          objectFit={'cover'}
          style={styles.video}
        />
        <TouchableWithoutFeedback onPress={handlePress}>
          <View style={styles.overlay}>{/* Floating transparent view */}</View>
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
          </View>
          
        )}
        
        
      </View>
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
});
