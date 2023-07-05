import {
  faArrowLeft,
  faBars,
  faCheck,
  faKey,
  faCirclePlay,
  faArrowUp,
  faArrowTrendUp,
  faMapMarkerAlt,
  faClapperboard,
  faArrowRight,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import {faClock} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import {RouteProp, useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

import { _Heightrapport, _Widthrapport } from '../../../StylingUtils';
import { CallerRecord } from '../../models/Entities/VideoRecords';
let rapportWidth = _Widthrapport*1.5;
let rapporthight = _Heightrapport*1.5;
const renderRecords = ({item}: {item: CallerRecord},Recordlenghth: number) => {
    console.log(rapportWidth)
    if(Recordlenghth > 1){
        rapportWidth =rapportWidth *0.8
    }
    const path = item.videoLink;
    //const navigation = useNavigation();
  return (
    //<TouchableOpacity onPress={()=>navigation.navigate("RecordDesplay",{path :path  })}>
    <View style={styles.RecordsContainer}>
      <View style={styles.iconcontainer}>
        <FontAwesomeIcon
          icon={faClapperboard}
          style={styles.squareRecordsIcon}
          size={rapporthight/24}
        />
        <View style={styles.duration}>
          <Text style={styles.squareText}>Duration</Text>
          <Text style={styles.squareText}>{item.Duration}</Text>
        </View>
      </View>
      <View style={styles.squarePlayIcon}>
      <Animatable.View
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
      >
        <FontAwesomeIcon
          icon={faCirclePlay}
          style={styles.squarePlayIcon}
          size={rapporthight/12}
        />
      </Animatable.View>

      </View>

      <View style={styles.PrivacyContainer}>
        <FontAwesomeIcon
          icon={faArrowRight}
          style={styles.PrivacyIcon}
          size={rapporthight/72}
          color="#13C796"
        />
        <Text style={styles.PrivacyText}>Preview the Record</Text>
      </View>
    </View>
    //</TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  duration: {
    left:rapportWidth / 5.5,
    alignSelf: 'center',
    paddingBottom: rapporthight / 48,
  },

  
  iconcontainer: {
    marginLeft: rapportWidth/30,
    marginTop: rapporthight/30,
    alignItems: 'center',

    borderRadius: rapportWidth/45,

    borderColor: 'black',
    flexDirection: 'row',
  },
  squareRecordsIcon: {
    color: '#13C796',
    fontSize: rapportWidth/4.5,
    marginBottom: rapporthight/45,
    alignSelf: 'center',
    paddingTop: rapporthight/72,
  },
  squarePlayIcon: {
    color: '#13C796',

    marginBottom: rapporthight/72,
    alignSelf: 'center',
    paddingTop: rapporthight / 50,
  },
  PrivacyIcon: {
    fontSize: rapporthight/5,
    marginBottom: 0,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  squareText: {
    color: '#212427',
    fontSize: rapporthight/72,
    marginLeft: rapportWidth/18,

    fontFamily: 'DMSans-Bold',
  },
  squareTextDescription: {
    color: '#212427',
    fontSize: rapporthight/60,
    marginLeft: rapportWidth/18,
    marginTop: rapporthight/144,
    fontFamily: 'DMSans-Regular',
  },

  RecordsContainer: {
    width: rapportWidth / 2,
    height: rapporthight / 3.5,
    backgroundColor: '#C4F4E8',
    marginHorizontal:rapportWidth /51.1428,
    borderRadius: rapporthight/36,
  },
  PrivacyContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'flex-start',
    paddingTop: rapporthight/ 60,
    paddingHorizontal: rapportWidth/36,
    marginLeft: rapportWidth/36,
  },
  PrivacyText: {
    color: '#212427',
    fontSize: rapporthight/55,
    marginLeft: rapportWidth/36,

    fontFamily: 'DMSans-Regular',
  },
});

export default renderRecords;
