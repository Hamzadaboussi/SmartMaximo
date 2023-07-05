import React, { useState } from 'react';
import { View, TouchableHighlight, Animated, StyleSheet } from 'react-native';
import {SwitchAudio, MessagesButton, ParamaitresButton, ScreenShotButton } from './VideoButtons';
import { _Heightrapport, _Widthrapport } from '../../../StylingUtils';

interface Props {
  setShowChatOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  showChatOverlay: boolean;
  chatmaximize : boolean ; 
  recording: boolean;
  _handleOnRecording: () => Promise<void>;
  AskForRecord: () => void;
  btnStyle: {
    width: number;
    height: number;
    backgroundColor: string;
    borderRadius: number;
  };
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>,
  expanded: boolean,
  setShowAttachments :  React.Dispatch<React.SetStateAction<boolean>>;
  ShowAttachments :boolean;
  setShowButtonContainer :React.Dispatch<React.SetStateAction<boolean>>;
  setChatmaximize: React.Dispatch<React.SetStateAction<boolean>>
  SetNotificationAttachement: React.Dispatch<React.SetStateAction<boolean>>
  NotificationAttachement: boolean
  SetNotificationMessage: React.Dispatch<React.SetStateAction<boolean>>
  NotificationMessage: boolean
}

export const ParameterButtonGroup = (props: Props) => {

  const [animationValue] = useState(new Animated.Value(0));
  const[switchAudio , setSwitchAudio] = useState(false)

  const toggleExpand = () => {
    props.setExpanded(!props.expanded);
    Animated.timing(animationValue, {
      toValue: props.expanded ? 0 : 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  };

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0], 
  });

  return (
    <View>
      <TouchableHighlight onPress={toggleExpand} style={{bottom: _Heightrapport/24,
marginRight: _Heightrapport/144,borderRadius: _Heightrapport / 24,}}>
        <View >
        <ParamaitresButton onCapture={() => console.log('tst')} NotificationAttachement = {props.NotificationAttachement} NotificationMessage = {props.NotificationMessage}  />
        </View>
      </TouchableHighlight>
      {props.expanded && (
        <Animated.View style={{ transform: [{ translateY }] }}>
            <View style = {{paddingTop:_Heightrapport / 40,}}>
          <MessagesButton
            switchmessage={() => {props.setExpanded(!props.expanded);props.setChatmaximize(!props.chatmaximize) ; props.setShowChatOverlay(false); props.setShowButtonContainer(false);props.SetNotificationMessage(false)}}
            NotificationMessage = {props.NotificationMessage}
          />
          
          </View>
          <View style={styles.btnContainer}>
            <TouchableHighlight style={{borderRadius: _Heightrapport / 24,}}
              onPress={props.recording ? props._handleOnRecording : props.AskForRecord}>
              <View style={styles.btnWrapper}>
                <View style={props.btnStyle} />
              </View>
            </TouchableHighlight>
          </View>
          <View style = {{paddingTop:_Heightrapport / 40,}}>
          <ScreenShotButton onCapture={() => {props.setExpanded(!props.expanded);props.setShowAttachments(true);props.setShowButtonContainer(false);props.SetNotificationAttachement(false)} } NotificationAttachement={props.NotificationAttachement} />
          </View>
          {/* <View style = {{paddingTop:_Heightrapport / 40,}}>
          <SwitchAudio onCapture={() => {console.log("f")}} isclicked ={switchAudio} />
          </View> */}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    bottom: _Heightrapport / 24,
    paddingTop: _Heightrapport / 40,
    alignItems: 'center',
    marginRight: _Heightrapport/144,
    
    
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: _Heightrapport / 12,
    height: _Heightrapport / 12,
    backgroundColor: '#fff',
    borderRadius: _Heightrapport / 24,

  },
});
