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
import { WorkOrder } from './WorkOrder';

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
              <Text style={styles.workOrderDeadline}>{` ${item.location}`}</Text>
            </View>
          </View>
          <View style={{ position: 'relative' }}>
            <AnimatedCircularProgress
              size={50}
              width={3}
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
              <FontAwesomeIcon icon={faCheck} color="#77E6B6" size={20} style={{ position: 'absolute', top: 16, left: 16 }} />
            )}
            {item.status === 'INPRG' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={20} style={{ position: 'absolute', top: 16, left: 16 }} />
            )}
            {item.status === 'WPLAN'  && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={20} style={{ position: 'absolute', top: 16, left: 16 }} />
            )}
            {item.status === 'WAPPR' || item.status === 'WAPPR' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={20} style={{ position: 'absolute', top: 16, left: 16 }} />
            )}
            {item.status === 'WAPPR' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="#F2994A" size={20} style={{ position: 'absolute', top: 16, left: 16 }} />
            )}
            {item.status === 'CAN' || item.status === 'CLOSE' && (
              <FontAwesomeIcon icon={faArrowTrendUp } color="red" size={20} style={{ position: 'absolute', top: 16, left: 16 }} />
            )}
          </View>
        </View>
        <Text style={styles.workOrderDescription}>{item.description}</Text>
        <View style ={styles.bar}></View>
        
    
    <View style={styles.dab}>
          <View>
            <View style={styles.id}>
              <FontAwesomeIcon icon={faClock} style={styles.icon2} />
              <Text style={styles.workOrderTitle}>{` ${item.schedstart.substring(0, 10)}`}</Text>
            </View>
            <View style={styles.id}>
              <FontAwesomeIcon icon={faScrewdriverWrench} style={styles.icon2} />
              <Text style={styles.workOrderDeadline}>{` ${item.assetnum}`}</Text>
            </View>
          </View>
          <Button 
        style={styles.workOrderStatus} 
        mode="outlined" 
        disabled
        onPress={() => console.log('Pressed')}
    >
        {item.status}
    </Button>
        </View>
              
       
    </View>
    
    );
  };

  const styles = StyleSheet.create({
    
    

    icon2: {


        fontSize: 20,
        fontFamily: 'DMSans-Medium',
        height: 12,
        width: 13.59,
        alignItems: 'center',

        paddingBottom: 30,
        Color: '#2D5151',
    },
    

    
    
    workOrderContainer: {
      backgroundColor: '#FFF',
      borderRadius: 15,
      paddingHorizontal: 10,
      paddingVertical: 10,
      marginBottom: 0,
      marginTop: 5,
      width: 345,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    workOrderTitle: {
        fontFamily: 'DMSans-Regular',
        fontSize: 12,
        paddingLeft :10 ,
        color: '#2D5151',
    },
    workOrderDescription: {
        fontFamily: 'DMSans-Bold',
        color: '#2D5151',
        marginBottom: 5,
        fontSize: 15,
        paddingHorizontal: 5,
    },
    workOrderDeadline: {
        fontFamily: 'DMSans-Regular',
        color: '#2D5151',
        marginBottom: 5,
        fontSize: 13,
        paddingLeft :10 ,
    },
    workOrderStatus: {
        fontFamily: 'DMSans-Regular',
        marginTop : 20,
        width:'auto',
        maxHeight : 40, 
         // make the width flexible
         // set the border color
        borderWidth: 0.5, // set the border width
        color: '#212427',
        borderColor : "#21242760",
        backgroundColor : "#77E6B610" 
        
        
        
    },
    
    id: {
        flexDirection: 'row',
        alignItems: 'center',

        
        paddingHorizontal: 5,

    },
    dab : {
        flexDirection: 'row',
        paddingBottom : 10 ,
        justifyContent: 'space-between',
    },
    bar :{
        backgroundColor: '#21242722',
        height:1,
        position: 'relative',
        marginVertical : 7 ,
        
        
        
        width : "150%"
    }
    
});

  export default renderWorkOrder