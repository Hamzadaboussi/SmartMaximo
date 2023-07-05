import {faArrowLeft, faMessage,faClapperboard,faImage, faLock} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Button,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import {RouteProp, useNavigation} from '@react-navigation/native';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';

interface MessagesLogsParams {
    username: string;
    messages :any[], 
    date : string;
  
}

function MessagesLogs({route}: {route: any}) {
  const {messages ,username , date} = route.params as MessagesLogsParams;
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList | null>(null);
console.log(username);
  
const timestampToTimeString = (timestamp : number) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? "PM" : "AM";
  
    // Convert hours to 12-hour format
    hours = hours % 12 || 12;
  
    // Add leading zeros to minutes if necessary
    const minute = minutes < 10 ? `0${minutes}` : minutes.toString();
    minutes = parseInt(minute, 10);
  
    return `${hours}:${minutes} ${amOrPm}`;
  };
  

    
    

  return (
    <View style={styles.container}>
      <FastImage
        source={require('../assets/hearts&magic.gif')}
        style={styles.backgroundImage}
        resizeMode={FastImage.resizeMode.cover}
      />
      <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          navigation.goBack();
        }}>
        <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} size={_Heightrapport/40}/>
      </TouchableOpacity>
      <View style={styles.TopContainer}>
        <Text style={styles.TopContainer}>Messages History </Text>
        
      </View>
      <View style={styles.TopContainer1}>
        <Text style={styles.TopContainer1}>{date} </Text>
        
      </View >
      <View style={styles.whiteContainer}>
        <View style = {styles.senderContainer}>
        <FontAwesomeIcon icon={faMessage} style={styles.squareMessagesIcon} size={_Heightrapport/24} />
        <Text style ={styles.calleeName} >{username} </Text>
        </View>
        <View style={styles.list}>
        <FlatList
          
          data={messages.reverse()}
          renderItem={({item}) => (
            <View>
            <View
              style={
                item.sender === username
                  ? styles.myMessage
                  : styles.otherMessage
              }>
              <Text style={styles.text}>{` ${item.text}`}</Text>
            </View>
            <Text style={
                item.sender === username
                  ? styles.mydate
                  : styles.otherdate
              }>{timestampToTimeString(item.timestamp)}</Text>
            </View>
            
          )}
          keyExtractor={(item, index) => index.toString()}
          
        />
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    myMessage: {
        backgroundColor: '#e4e4e4',
        alignSelf: 'flex-end',
        paddingVertical: _Heightrapport/144,
        paddingHorizontal: _Widthrapport/36,
        borderBottomLeftRadius: _Heightrapport/72,
        marginVertical: _Heightrapport/144,
        maxWidth: '70%',
        
      },
      mydate: {
        
        alignSelf: 'flex-end',
        paddingVertical: 0,
        paddingHorizontal: _Widthrapport/36,
        borderBottomLeftRadius: _Heightrapport/72,
        marginVertical: 0,
        maxWidth: '70%',
        fontSize : _Heightrapport/72,
      },
    list: {
        paddingTop: _Heightrapport/36,
        paddingBottom: _Heightrapport/72,
        paddingHorizontal: _Widthrapport/36,
        height : Dimensions.get('window').height/1.4 ,
        borderBottomColor :'#FDEFC2' ,
        borderBottomWidth : _Heightrapport/220 ,
      },
      otherMessage: {
        backgroundColor: '#FDEFC2',
        alignSelf: 'flex-start',
        padding: _Heightrapport/72,
        
        marginVertical: _Heightrapport/144,
        maxWidth: '70%',
        borderBottomRightRadius: _Heightrapport/72,
      },
      otherdate: {
        
        alignSelf: 'flex-start',
        paddingVertical: 0,
        paddingHorizontal: _Widthrapport/36,
        borderRadius: _Heightrapport/90,
        marginVertical: 0,
        maxWidth: '70%',
        fontSize : _Heightrapport/72,
      },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F8FD',
  },
  backgroundImage: {
    flex: 0,
    height: '45%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#212427',
    fontFamily: 'DMSans-Regular',
    fontSize : _Heightrapport/45,
  },
  whiteContainer: {
    position: 'relative',
    top: -_Heightrapport/3.6, 
    left: 0,
    height: '80%',
    width: '100%',
    borderTopLeftRadius: _Heightrapport/18, 
    borderTopRightRadius: _Heightrapport/18,
    backgroundColor: '#F8F8FD',
    justifyContent: 'flex-start',
    //alignItems: "center",
    

    
  },
  TopContainer: {
    position: 'absolute',
    top: '5%',

    color: '#F8F8FD',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Medium',

    alignItems: 'center',

    //paddingBottom: 30,
  },
  TopContainer1: {
    position: 'absolute',
    top: '10%',

    color: '#F8F8FD',
    fontSize: _Heightrapport/45,
    fontFamily: 'DMSans-Regular',

    alignItems: 'center',
    textTransform: 'capitalize',
    
  },

  icon: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    color: '#77E6B6',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Medium',
    
    alignItems: 'center',

    paddingBottom: _Heightrapport/24,
    Color: '#212427',
  },

  senderContainer : {
    width: Dimensions.get('window').width ,
    height: Dimensions.get('window').height / 12,
    backgroundColor : "#FDEFC2",
    borderTopLeftRadius: _Heightrapport/18,
    borderTopRightRadius: _Heightrapport/18,
    
    alignItems :'center',
    flexDirection: 'row',
    
  },
  squareMessagesIcon: {
    color: '#FDB215',
    fontSize : _Heightrapport/9,
    marginBottom: 0,
    alignSelf : "center",
    paddingLeft : Dimensions.get('window').width /2.6 ,
    
  },
  calleeName: {
    fontSize: _Heightrapport/40,
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: 'DMSans-Regular',
    
    
  },
  timestamp :{
    fontSize: _Heightrapport/90,
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: 'DMSans-Medium',
  }
});

export default MessagesLogs;
