import { faMicrophone, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import {View , Text, Touchable, TouchableOpacity,StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { _Heightrapport } from "../../../StylingUtils";


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
            size={_Heightrapport/24}
            icon={ faPhone }
            style={{color: "#FFF", alignItems: 'center'}}
          />
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    button : {
        width : _Heightrapport/10.3 ,
        height : _Heightrapport/10.3,
        padding : _Heightrapport/72 , 
        elevation : _Heightrapport/72,
        justifyContent: 'center',
        alignItems : 'center',
        borderRadius : _Heightrapport/7.2,


    },
});

