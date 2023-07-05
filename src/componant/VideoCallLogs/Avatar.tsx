
import React from "react";
import {View , Text, Touchable, TouchableOpacity,StyleSheet} from 'react-native';

import { _Heightrapport } from "../../../StylingUtils";

interface Props {
    username : string
    size : number
}

const calllogsAvatarColors = ["#f94144","#f3722c","#f8961e","#f9844a","#f9c74f","#90be6d","#43aa8b","#4d908e","#577590","#277da1"]
export default function Avatar(props: Props) {
    const username = props.username.toUpperCase();
    const firstLetter = username[0];
    const firstLetterColor = calllogsAvatarColors[firstLetter.charCodeAt(0) % calllogsAvatarColors.length];
  
    return (
      <View style={[styles.circle, { backgroundColor: firstLetterColor }]}>
        <Text style={styles.letter}>{firstLetter}</Text>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    circle: {
      borderRadius: _Heightrapport / 2,
      height: _Heightrapport / 15.0,
      width: _Heightrapport / 15.0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    letter: {
      fontSize: _Heightrapport / 24,
      color: "#F8F8FD",
      textTransform: 'capitalize',
      fontFamily: 'DMSans-Medium',
    },
  });
  