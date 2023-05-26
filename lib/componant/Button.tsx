import { faMicrophone, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import {View , Text, Touchable, TouchableOpacity,StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface Props{
    onPress? :any ; 
    iconName : string ; 
    backgroundColor: string;
    style? : any ; 
} 

export default function Button(props: Props){
    return (
        <View>
            <TouchableOpacity
            onPress={props.onPress}
            style={[
                {backgroundColor : props.backgroundColor },
                props.style,
                styles.button,
             ]}>
            <FontAwesomeIcon
            size={25}
            icon={ faPhone }
            style={{color: "#FFF", alignItems: 'center'}}
          />
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    button : {
        width : 60 ,
        height : 60,
        padding : 10 , 
        elevation : 10,
        justifyContent: 'center',
        alignItems : 'center',
        borderRadius : 100,


    },
});