import { StyleSheet, TouchableOpacity, View } from "react-native";
import Buttonn from '../Button';
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCameraRotate,faImages,faBars, faMicrophone,faPencil,faMicrophoneSlash ,faMessage, faVideo, faVideoSlash, faPaperclip, faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { _Heightrapport, _Widthrapport } from "../../../../StylingUtils";


  interface Props {
    Send : ()=> void
  }
  
  export function RefrechAttachment_Button(props: Props) {
    return (
      <View style={styles.SendAttachment}>
        <TouchableOpacity onPress={props.Send}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={faArrowsRotate}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }

  export function SendImageAttachment_Button(props: Props) {
    return (
      <View style={styles.SendAttachment}>
        <TouchableOpacity onPress={props.Send}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={faImages}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }
  export function SendPdfAttachment_Button(props: Props) {
    return (
      <View style={styles.SendAttachment}>
        <TouchableOpacity onPress={props.Send}>
          <FontAwesomeIcon
            size={ (_Heightrapport/22)}
            icon={faPaperclip}
            style={{color: '#FFF', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    );
  }  
    const styles = StyleSheet.create({
    
    SendAttachment: {
      width:  (_Heightrapport/12),
      height:  (_Heightrapport/12),
      borderRadius: (_Heightrapport/24),
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: "#5F56EE",
      
      marginRight: _Heightrapport/144,
    },
    
   
    
  });