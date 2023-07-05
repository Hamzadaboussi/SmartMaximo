import Video from 'react-native-video';

import React, {useEffect, useRef, useState} from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft,faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import {RouteProp, useNavigation} from '@react-navigation/native';

interface RecordDesplayParams {
    path : string
}


function RecordDesplay({route}: {route: any}) {
    const {path} = route.params as RecordDesplayParams;
    const videoPath = path;  
    const navigation = useNavigation();


    
    

    return (
        <View style={styles.Conatiner}>
        <Video
        fullscreen = {true}
          source={{ uri: videoPath }}
          style={{ width: Dimensions.get('window').width , height: Dimensions.get('window').height*1.1 ,top : - Dimensions.get('window').height/25}}
          controls={true}
          resizeMode="cover"
        />
        <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          navigation.goBack();
        }}>
        <Animatable.View
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
      >
        
        <FontAwesomeIcon icon={faCircleXmark} color='red' size={Dimensions.get('window').height/20}   />
        </Animatable.View>
        </TouchableOpacity>
        </View>
      );
    
}

const styles = StyleSheet.create({
    Conatiner : {
        width: Dimensions.get('window').width ,
         height: Dimensions.get('window').height
    },
    icon : {
position :'absolute',
top : Dimensions.get('window').height/20,
right : Dimensions.get('window').width/20,
width : Dimensions.get('window').width/10,
height : Dimensions.get('window').height/20

    }
});

export default RecordDesplay;
