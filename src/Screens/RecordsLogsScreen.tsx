import {
  faArrowLeft,
  faMessage,
  faClapperboard,
  faImage,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
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
import renderRecords from '../componant/VideoCallLogs/RecordsCards';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';
import { CallerRecord } from '../models/Entities/VideoRecords';

interface RecordsLogsParams {
  username: string;
  records: CallerRecord[];
  date: string;
}

function RecordsLogs({route}: {route: any}) {
  const {records, username, date} = route.params as RecordsLogsParams;
  const navigation = useNavigation();

  console.log(username);

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
        <Text style={styles.TopContainer}>Records History </Text>
      </View>
      <View style={styles.TopContainer1}>
        <Text style={styles.TopContainer1}>{date} </Text>
      </View>
      <View style={styles.whiteContainer}>
        <View style={styles.TitleContainer}>
          <Text style={styles.Title}>Media Records</Text>
          <Text style={styles.subTitle}>Totale Minutes Recorded : 30:10</Text>
        </View>
        <FlatList
          data={records}
          horizontal
          renderItem={item => 
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('RecordDesplay', { path: item.item.videoLink })}>
                {renderRecords(item, records.length)} 
            </TouchableOpacity>}
          keyExtractor={item => item.videoLink.toString()}
          style={{
            paddingVertical: Dimensions.get('window').height / 15,
            paddingHorizontal: Dimensions.get('window').width / 10,
          }}
          ItemSeparatorComponent={() => <View style={{width: 10}} />}
          ListFooterComponent={() => <View style={{paddingRight: 30}} />}
          contentContainerStyle={{paddingBottom: 0}}
        />
        <Text style = {styles.Bottomtext}>The files in question are stored locally on your device as private data.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    fontSize: _Heightrapport/45,
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
    paddingBottom: 20,

    
  },
  TopContainer: {
    position: 'absolute',
    top: '5%',

    color: '#F8F8FD',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Medium',

    alignItems: 'center',

    
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
  
  TitleContainer: {
    paddingTop: _Heightrapport/18,
    paddingLeft: Dimensions.get('window').width / 10,
  },
  Title: {
    fontFamily: 'DMSans-Medium',
    color: 'black',
    fontSize: _Heightrapport/22.5,
  },
  subTitle: {
    fontFamily: 'DMSans-Medium',
    color: 'black',
    fontSize: _Heightrapport/60,
    paddingTop: _Heightrapport/144,
  },
  Bottomtext : {
    fontFamily: 'DMSans-Regular',
    color: 'black',
    fontSize: _Heightrapport/51.45,
    paddingBottom :_Heightrapport/12 ,
    alignSelf : "center",
    paddingHorizontal : _Widthrapport/18,
    textAlign : 'center'
  },
});

export default RecordsLogs;
