import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from 'react-native';
import Button from "../Button";
import { _Heightrapport, _Widthrapport } from "../../../../StylingUtils";
import Sound from "react-native-sound";
import GettingCallButton from "./GettingCallbuttons";
import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';

interface Props {
    hangup: () => void;
    join:  () => void;
    targettusername?: string;
}

export default function GettingCall(props: Props) {
    useEffect(() => {
        const ringingTone = new Sound('ringring.mp3', Sound.MAIN_BUNDLE, (error) => {
          if (error) {
            console.log('Failed to load the sound:', error);
            return;
          }
    
          ringingTone.setNumberOfLoops(-1); 
          ringingTone.play((success) => {
            if (!success) {
              console.log('Failed to play the sound');
            }
          });
        });
    
        return () => {
          ringingTone.stop();
          ringingTone.release();
        };
      }, []);
    
    return (
        <View style={styles.container}>
            <FastImage
          source={require('../../../assets/hearts&magic.gif')}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover} />
          <View style ={styles.textcontainer}>
          <Text style={styles.target}>{props.targettusername}</Text>
          <Text style={styles.target1}>Is trying to reach you </Text>

          </View>
            
            <View style={styles.bcontainer}>
            <Animatable.View
            animation="jello"
            easing="ease-out"
            iterationCount="infinite"
            iterationDelay={1000}
            style={{transform: [{scale: 4}]}}>
                <Button 
                    iconName="phone"
                    backgroundColor="green"
                    onPress={props.join}
                    style={{ marginRight:_Widthrapport/12 }} 
                    
                />
                 </Animatable.View>
                 <Animatable.View
            animation="jello"
            easing="ease-out"
            iterationCount="infinite"
            iterationDelay={1000}
            style={{transform: [{scale: 4}]}}>
                <Button 
                    iconName="phone"
                    backgroundColor="red"
                    onPress={props.hangup}
                    style={{ marginLeft: _Widthrapport/12 }} 
                    
                />
                 </Animatable.View>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    image: {
        position: 'absolute',
        width: '100%',
        height: '100%',

    },
    bcontainer: {
        flexDirection : 'row',
        bottom : _Heightrapport/24,
    },
    target : {
        fontSize : _Heightrapport/13,
        fontFamily : "DMSans-Medium",
        color : "white",
        textTransform: 'capitalize',
        paddingBottom : 20,
      },
      target1 :{
        fontSize : _Heightrapport/40,
        fontFamily : "DMSans-Medium",
        color : "white",
        textTransform: 'capitalize',
      },
      textcontainer: {
        position: 'absolute',
        top: _Heightrapport / 4,
        left: _Widthrapport / 10,
        right: _Widthrapport / 10,
    
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      },
});