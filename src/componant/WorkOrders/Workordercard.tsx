import { faArrowLeft,faCheck,faKey, faScrewdriverWrench,faArrowUp,faArrowTrendUp ,faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import CircularProgress from 'react-native-circular-progress';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Easing } from 'react-native';
import { Animated } from 'react-native';
import { Button } from 'react-native-paper';
import { _Heightrapport, _Widthrapport } from '../../../StylingUtils';


export interface WorkOrder {
  workorderid: number;
  description: string;
  status: string;
  assetnum: string;
  wopriority: string;
  location: string;
  schedstart: string;
}

const renderWorkOrder = ({ item }: { item: WorkOrder }) => {
  
    
    let fill = 0;
    let tintColor = '#A880E3';
    let duration = 0;
    let easing = Easing.linear;
    let rotation = 360;
    
    if (item.status === 'INPRG') {
      fill = 75;
      tintColor = '#F2994A';
      easing = Easing.linear;
      rotation = 360;
      duration = 5000;
    } else if (item.status === 'COMP') {
      fill = 100;
      tintColor = '#77E6B6';
      duration = 5000;
    }
    
    return (
      
      <View style={[
        styles.workOrderContainer, 
        item.status === 'On Progress' ? { borderStartColor : '#ffffff00' } : 
        item.status === 'Completed' ? { borderStartColor : 'green' } : 
        item.status === 'New' ? { borderStartColor : '#ffffff00' } : null
      ]}>
        <View style={styles.dab}>
          <View>
            <View style={styles.id}>
              <FontAwesomeIcon icon={faKey} style={styles.icon2} />
              <Text style={styles.workOrderTitle}>{` ${item.workorderid}`}</Text>
            </View>
            <View style={styles.id}>
              <FontAwesomeIcon icon={faMapMarkerAlt } style={styles.icon2} />
              <Text style={styles.workOrderDeadline}>{item.location?item.location:'No information available'}</Text>
            </View>
          </View>
          <View style={{ position: 'relative' }}>
            <AnimatedCircularProgress
              size={_Heightrapport/14.4}
              width={_Heightrapport/240}
              fill={fill}
              tintColor={tintColor}
              backgroundColor="#21242722"
              rotation={rotation}
              duration={duration}
              easing={easing}
              onAnimationComplete={() => {
                
              }}
            />
            {item.status === 'COMP' && (
              <FontAwesomeIcon icon={faCheck} color="#77E6B6" size={_Heightrapport/36} style={{ position: 'absolute', top: _Heightrapport/45, left: "30%" }} />
            )}
            {item.status === 'INPRG' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={_Heightrapport/36} style={{ position: 'absolute', top: _Heightrapport/45, left: "30%" }} />
            )}
            {item.status === 'WPLAN'  && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={_Heightrapport/36} style={{ position: 'absolute', top: _Heightrapport/45, left: "30%" }} />
            )}
            {item.status === 'WAPPR' || item.status === 'WAPPR' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={_Heightrapport/36} style={{ position: 'absolute', top: _Heightrapport/45, left: "30%" }} />
            )}
            {item.status === 'WAPPR' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={_Heightrapport/36} style={{ position: 'absolute', top: _Heightrapport/45, left: "30%" }} />
            )}
            {item.status === 'CAN' || item.status === 'CLOSE' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="red" size={_Heightrapport/36} style={{ position: 'absolute', top: _Heightrapport/45, left: "30%" }} />
            )}
          </View>
        </View>
        <Text style={styles.workOrderDescription}>{item.description?item.description:'No information available'}</Text>
        <View style ={styles.bar}></View>
        
    
    <View style={styles.dab}>
          <View>
            <View style={styles.id}>
              <FontAwesomeIcon icon={faClock} style={styles.icon2} />
              <Text style={styles.workOrderTitle}>{item.schedstart?item.schedstart.substring(0, 10):'No information available'}</Text>
            </View>
            <View style={styles.id}>
              <FontAwesomeIcon icon={faScrewdriverWrench} style={styles.icon2} />
              <Text style={styles.workOrderDeadline}>{item.assetnum?item.assetnum:'No information available'}</Text>
            </View>
          </View>
          <View style = {styles.statusContainer}>
            <Text style = {styles.StatusText}>
{item.status}
            </Text>
          </View>
        </View>
              
       
    </View>
    
    );
  };

  const styles = StyleSheet.create({
    
    

    icon2: {


        fontSize: _Heightrapport/16,
        fontFamily: 'DMSans-Medium',
        height: _Heightrapport/60,
        width: _Widthrapport/26.5,
        alignItems: 'center',

        paddingBottom: _Heightrapport/24,
        Color: '#2D5151',
    },
    

    
    
    workOrderContainer: {
      backgroundColor: '#fdffb622',
      borderRadius: 15,
      paddingHorizontal: _Heightrapport/72,
      paddingVertical: _Heightrapport/72,
      marginBottom: 0,
      marginTop: _Heightrapport/144,
      width: _Widthrapport/1.04,
      shadowColor: '#000',
       shadowOffset: {
         width: 0,
         height: 1,
       },
       shadowOpacity: 0.2,
      shadowRadius: 2,
      //elevation: 2,
      borderWidth : 0.25,
      borderColor : "#00000033"
    },
    workOrderTitle: {
        fontFamily: 'DMSans-Regular',
        fontSize: _Heightrapport/60,
        paddingLeft :_Widthrapport/36 ,
        color: '#2D5151',
    },
    workOrderDescription: {
        fontFamily: 'DMSans-Bold',
        color: '#2D5151',
        marginBottom: _Heightrapport/144,
        fontSize: _Heightrapport/48,
        paddingHorizontal: _Widthrapport/72,
    },
    workOrderDeadline: {
        fontFamily: 'DMSans-Regular',
        color: '#2D5151',
        marginBottom: _Heightrapport/144,
        fontSize: _Heightrapport/55.4,
        paddingLeft :_Widthrapport/36 ,
    },
    workOrderStatus: {
        //fontFamily: 'DMSans-Regular',
        marginTop : _Heightrapport/50,
        //width:'auto',
        //fontSize : 40 ,
        //maxHeight : _Heightrapport/18, 
         // make the width flexible
         
        borderWidth: 0.5, 
        color: '#212427',
        borderColor : "#21242760",
        backgroundColor : "#77E6B610" ,
        //paddingBottom : 4,
        
    },
    
    id: {
        flexDirection: 'row',
        alignItems: 'center',

        
        paddingHorizontal: _Widthrapport/72,

    },
    dab : {
        flexDirection: 'row',
        paddingBottom : _Heightrapport/72 ,
        justifyContent: 'space-between',
    },
    bar :{
        backgroundColor: '#21242722',
        height: _Heightrapport/720 ,
        position: 'relative',
        marginVertical : _Heightrapport/103 ,
        
        
        
        width : "150%"
    },
    statusContainer : {
      borderColor : "#21242760",
      //backgroundColor : "#77E6B610" ,
      borderWidth : 0.25 , 
      borderRadius : 2 ,
      width : _Widthrapport/5,
      height : _Heightrapport/20,
      alignItems :"center",
      alignContent : 'center',
      alignSelf: "center"
    },
    StatusText : {
      fontSize : _Heightrapport/50,
      alignSelf: 'center', 
      alignContent  : 'center',
      alignItems : 'center',
      marginTop : _Heightrapport/80,
      color: "grey"
    },
    
});

  export default renderWorkOrder