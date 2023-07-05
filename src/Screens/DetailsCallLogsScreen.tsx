import {faArrowLeft, faMessage,faClapperboard,faImage, faLock, faFile} from '@fortawesome/free-solid-svg-icons';
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
import { Item } from 'react-native-paper/lib/typescript/src/components/Drawer/Drawer';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';
import {  sendMessage } from '../controllers/GPTPromps/Send_Promps-ChatGPT';
import { Calllog } from '../models/Entities/Calllog';
import { CallerRecord } from '../models/Entities/VideoRecords';






interface VideoCallListParams {
    ConversationId: string;
    messages :any[], 
    item : any ; 
    records : CallerRecord[],
    attachements : any[]
}


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
  

function DetailsCallLogs({route}: {route: any}) {
  const {ConversationId,messages , item , records , attachements} = route.params as VideoCallListParams;
  const navigation = useNavigation();
  const Calllogss = useRef<Calllog[]>();
console.log("tt",item.Reciever)
  console.log(records)
  




  const date = item.date;
  const username = item.Reciever;
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
        <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} size={_Heightrapport/40} />
      </TouchableOpacity>
      <View style={styles.TopContainer}>
        <Text style={styles.TopContainer}>Video Call History </Text>
        
      </View>
      <View style={styles.TopContainer1}>
        <Text style={styles.TopContainer1}>Details </Text>
        
      </View >
      <View style={styles.whiteContainer}>
        
      <View style={styles.NumContainer}>
        <View style={styles.Group1}>
        <Text style={styles.Number}>{messages.length > 10 ? messages.length : `0${messages.length}`}</Text>
          <Text style={styles.text}>Messages activity </Text>
        </View>
        <View style={styles.Group1}>
          <Text style={styles.Number}>{records.length > 10 ? records.length : `0${records.length}`} </Text>
          <Text style={styles.text}>Media Recorded </Text>
        </View>
        <View style={styles.Group1}>
          <Text style={styles.Number}>{attachements.length > 10 ? attachements.length : `0${attachements.length}`} </Text>
          <Text style={styles.text}>Photos Document </Text>
        </View>
      </View>
      
      <View style={styles.Call}>
      <View style={styles.leftContainer}>
        <Image
          source={require('../assets/Icons/profile.png')}
          style={styles.profileIcon}
        />
        <View style={styles.textContainer}>
          <Text style={styles.callerName}>{item.Reciever}</Text>
          <Text style={styles.timestamp}>{item.date}</Text>
        </View>
        <View style={styles.textContainer}>
        <Text style={styles.timestamp}>{timestampToTimeString(parseInt(item.time,10))}</Text>
            
        </View>
      </View> 
      </View>
      <View style={styles.title}>
            <Text style={styles.description}>
            Explore Messages, Video Records, and Photo Draws from your Video Calls.
            </Text>
          </View>
      <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.both}
    >
      <TouchableOpacity onPress={()=>navigation.navigate("MessagesLogs",{messages:messages ,  username : username , date : date })}>
        <View style= {styles.MessagesContainer}>
        <View style = {styles.iconcontainer}>
            <FontAwesomeIcon icon={faMessage} style={styles.squareMessagesIcon} size={_Heightrapport/24} />
            </View>
            <Text style={styles.squareText}>Messages</Text>
            <Text style={styles.squareTextDescription}>{messages.length} items</Text>
            <View style = {styles.PrivacyContainer}>
                <FontAwesomeIcon icon={faLock} style={styles.PrivacyIcon} size={_Heightrapport/72} color='#FDB215'/>
                <Text style={styles.PrivacyText}>Private data</Text>

            </View>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("RecordsLogs",{records:records ,  username : username , date : date })}>
        <View style= {styles.RecordsContainer}>
        <View style = {styles.iconcontainer}>
            <FontAwesomeIcon icon={faClapperboard} style={styles.squareRecordsIcon} size={_Heightrapport/24} />
        </View>
            <Text style={styles.squareText}>Records</Text>
            <Text style={styles.squareTextDescription}>{records.length} items</Text>
            <View style = {styles.PrivacyContainer}>
                <FontAwesomeIcon icon={faLock} style={styles.PrivacyIcon} size={_Heightrapport/72} color='#13C796' />
                <Text style={styles.PrivacyText}>Private data</Text>

            </View>
            
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate("AttachementsLogs",{Attachements:attachements ,  username : username , date : date })}>
        <View style= {styles.DrawsContainer}>
        <View style = {styles.iconcontainer}>
            <FontAwesomeIcon icon={faFile} style={styles.squareDrawsIcon} size={_Heightrapport/24} />
        </View>
        <Text style={styles.squareText1}>Documents</Text>
            <Text style={styles.squareTextDescription}> {attachements.length} items</Text>
            <View style = {styles.PrivacyContainer}>
                <FontAwesomeIcon icon={faLock} style={styles.PrivacyIcon} size={_Heightrapport/72} color='#5F56EE'/>
                <Text style={styles.PrivacyText}>Private data</Text>

            </View>
        </View>
        </TouchableOpacity>
      
      </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  
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
  whiteContainer: {
    position: 'relative',
    top: -_Heightrapport/3.6, 
    left: 0,
    height: '90%',
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
    top: '9%',

    color: '#F8F8FD',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Medium',

    alignItems: 'center',

    
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

  NumContainer: {
    position: 'relative',
paddingTop : _Heightrapport/36,
    color: '#F8F8FD',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 0,
    paddingBottom: _Heightrapport/24,
    alignSelf: 'center',
  },
  Group1: {
    color: '#F8F8FD',
    paddingLeft: _Widthrapport/18,
    fontFamily: 'DMSans-Medium',
    flexDirection: 'column',

    alignContent: 'flex-start',
  },
  Number: {
    color: 'black',
    fontFamily: 'DMSans-Medium',
    fontSize: _Heightrapport/12,
  },
  text: {
    color: 'black',
    fontSize: _Heightrapport/48,
    width: _Widthrapport/4.5,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf : 'center' ,
  },
  profileIcon: {
    width: _Heightrapport/14.4,
    height: _Heightrapport/14.4,
    borderRadius: _Heightrapport/36,
    marginRight: _Heightrapport/72,

  },
  textContainer: {
    flexDirection: 'column',
    color: 'black',
    paddingLeft : _Widthrapport/15,
  },
  callerName: {
    fontSize: _Heightrapport/40,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: 'DMSans-Medium',
  },
  timestamp: {
    fontSize: _Heightrapport/51.5,
    color: '#888888',
  },
  
  Call: {
    paddingTop : _Heightrapport/72 ,
    flexDirection: 'row',
   
    alignItems: 'center',
    paddingHorizontal: _Widthrapport/22.5,
    paddingVertical: _Heightrapport/60,
    alignSelf : "center",
    
    
  },
  both : {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'flex-start',
    paddingTop : _Heightrapport/72 , 
    paddingHorizontal : _Widthrapport/36 ,
  },
  PrivacyContainer : {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'flex-start',
    paddingTop : _Heightrapport/18 , 
    paddingHorizontal : _Widthrapport/36 ,
    marginLeft : _Widthrapport/36,
  },
  
  MessagesContainer : {
    width: Dimensions.get('window').width / 2.3,
    height: Dimensions.get('window').height / 3,
    backgroundColor : "#FDEFC2",
    marginHorizontal : _Widthrapport/51.5,
    borderRadius : _Heightrapport/36,
    
  },
  RecordsContainer : {
    width: Dimensions.get('window').width / 2.3,
    height: Dimensions.get('window').height / 3,
    backgroundColor : "#C4F4E8",
    marginHorizontal : _Widthrapport/51.5,
    borderRadius : _Heightrapport/36,
  },
  DrawsContainer : {
    width: Dimensions.get('window').width / 2.3,
    height: Dimensions.get('window').height / 3,
    backgroundColor : "#DAD4FF",
    marginHorizontal : _Widthrapport/51.5,
    borderRadius : _Heightrapport/36,
  },
    squareMessagesIcon: {
        color: '#FDB215',
        //fontSize : 80,
        marginBottom: _Heightrapport/72,
        alignSelf : "center",
        paddingTop : _Heightrapport/20.5
        
    },
  iconcontainer : {
    width : "25%",
    height : "25%",
    marginLeft : _Widthrapport/18,
    marginTop : _Heightrapport/36 ,
    alignItems : "center",
    borderRadius : _Heightrapport/90,

  },
  squareRecordsIcon: {
    color: '#13C796',
    //fontSize : 80,
    marginBottom: _Heightrapport/72,
    alignSelf : "center",
    paddingTop : _Heightrapport/20.57
    
  },
  PrivacyIcon: {
    
    fontSize : _Heightrapport/9,
    marginBottom: 0,
    alignSelf : "center",
    
    
  },
  squareDrawsIcon: {
    color: '#5F56EE',
    //fontSize : 80,
    marginBottom: _Heightrapport/72,
    alignSelf : "center",
    paddingTop : _Heightrapport/20.57
    
  },
  squareText: {
    color: '#212427',
    fontSize: _Heightrapport/28.8,
    marginLeft : _Widthrapport/18,
    marginTop : _Heightrapport/36,
    fontFamily: 'DMSans-Bold', 
  },
  squareText1: {
    color: '#212427',
    fontSize: _Heightrapport/32,
    marginLeft : _Widthrapport/18,
    marginTop : _Heightrapport/36,
    fontFamily: 'DMSans-Bold', 
  },
  squareTextDescription : {
    color: '#212427',
    fontSize: _Heightrapport/60,
    marginLeft : _Widthrapport/18,
    marginTop : _Heightrapport/144,
    fontFamily: 'DMSans-Regular', 
  },
  PrivacyText : {
    color: '#212427',
    fontSize: _Heightrapport/60,
    marginLeft : _Heightrapport/36,
    
    fontFamily: 'DMSans-Regular', 
  },
  title: {
    color: '#004343',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: _Widthrapport/36,

    paddingBottom: 0,
    paddingTop: _Heightrapport/28.8,
  },
  description: {
    color: '#004343',
    fontSize: _Heightrapport/51.4,
    fontFamily: 'DMSans-Regular',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: _Widthrapport/36,
    textAlign: 'center',
    paddingBottom: _Heightrapport/144,
    
  },
  

});

export default DetailsCallLogs;
