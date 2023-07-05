import {faArrowLeft, faUser} from '@fortawesome/free-solid-svg-icons';
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
import CircularProgress from 'react-native-circular-progress';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Easing} from 'react-native';
import {Animated} from 'react-native';
import renderWorkOrder from '../componant/WorkOrders/Workordercard';
import getAllWorkOrders from '../controllers/WorkOrders/workOrderController';
import WorkOrderDao from '../models/DAO/WorkOrderDao';
import {RouteProp, useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-spinkit';
import renderwoActivities from '../componant/WorkOrders/WoActivitiescard';
import renderwoLogs from '../componant/WorkOrders/Wologscard';
import CreateRoom from './CreateRoomScreen';
import {
  getwActivitiesdb,
  getwodb,
  getwologdb,
} from '../controllers/LocalDB/getwodatabase';
import { GetRecords, getCallLogs } from '../controllers/Firebase/Firestore/FirebaseQuery';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';
import SearchBox from 'react-native-search-box';
import Avatar from '../componant/VideoCallLogs/Avatar';
import { ActivityIndicator } from 'react-native-paper';
import { GetMessages } from '../controllers/Firebase/RealTimeDB/MessagingRTDB';
import { GetAttachements } from '../controllers/Firebase/RealTimeDB/AttachementsRTDB';
import { Calllog } from '../models/Entities/Calllog';
import { CallerRecord } from '../models/Entities/VideoRecords';

interface WorkOrderListParams {
  username: string;
  Calllogs :Calllog[]
}




function CallLogsScreen({route}: {route: any}) {
  const {username,Calllogs} = route.params as WorkOrderListParams;
  const navigation = useNavigation();
  const Calllogss = useRef<Calllog[]>();
const messages = useRef<any[]>([]);
const Attachements = useRef<any[]>([]);
const records = useRef<CallerRecord[]>([]);
const [isLoading, setIsLoading] = useState(false);

const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(Calllogs);

  const handleSearch = (text :any) => {
    const query = text.trim();
    setSearchQuery(query);

    const filteredData = Calllogs.filter((log) =>
      log.Reciever.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredUsers(filteredData);
  };
  
const _handelnavigateTodetails = async (ConversationId : string , item : any) =>{
setIsLoading(true)
messages.current =[];
records.current =[];
Attachements.current = [];

 await GetMessages(ConversationId,messages);
 console.log('ba',messages.current);
 await GetRecords(ConversationId,records)
 console.log(ConversationId);
 console.log("reco",records.current)
 await GetAttachements(ConversationId,Attachements)
 console.log("attach", Attachements.current)
 navigation.navigate('DetailsCallLogs' ,  {ConversationId: ConversationId , messages: messages.current , item:item , records : records.current , attachements: Attachements.current})
 setIsLoading(false)
}

  const renderItem = ({item}: any) => (
    <TouchableOpacity style={styles.listItem} onPress={async () =>await _handelnavigateTodetails(item.ConversationId.toString() , item)}>
      <View style={styles.leftContainer}>
        <View>
          <Avatar
          username={item.Reciever}
          size={_Heightrapport/14.4}

          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.callerName}>{item.Reciever}</Text>
          <Text style={styles.timestamp}>{item.date}</Text>
        </View>
      </View>
      <Image
        source={require('../assets/Icons/right-up.png')}
        style={styles.anotherIcon}
      />
    </TouchableOpacity>
  );

  

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

      <View style={styles.whiteContainer}>
      <View style={styles.title}>
            <Text style={styles.title}>Assisstance History list </Text>
          </View>
      <View style = {{marginHorizontal : _Widthrapport/36,marginTop : _Heightrapport/24}}>
          <SearchBox
        onChangeText={handleSearch}
        value={searchQuery}
        placeholder="Search users..."
        borderRadius={10}
        onCancel ={()=>{setFilteredUsers(Calllogs)}}
        onDelete={()=>{setFilteredUsers(Calllogs)}}
        inputHeight = {_Heightrapport/20}
        
        placeholderCollapsedMargin = {_Widthrapport/8}
        searchIconCollapsedMargin = {_Widthrapport/6}
        inputStyle = {styles.text}
        //cancelButtonWidth = {{padding : 80}}
        
        cancelButtonStyle ={styles.cancel}
       
      /></View>
        <View style={styles.scrll}>
          <FlatList
            data={filteredUsers.sort((a, b) => b.time - a.time)}
            renderItem={renderItem}
            keyExtractor={item => item.ConversationId.toString()}
          />
          </View>
      </View>
      {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrll: {
    borderTopLeftRadius: _Heightrapport/18,
    borderTopRightRadius: _Heightrapport/18,
    paddingTop :  _Heightrapport/60,
    paddingBottom : _Heightrapport/25
   },
  listItem: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: _Widthrapport/22.5,
    paddingVertical: _Heightrapport/60,
    borderBottomWidth: 0.25,
    borderBottomColor: '#CCCCCC66',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: _Heightrapport/14.4,
    height: _Heightrapport/14.4,
    borderRadius: _Heightrapport/36,
    marginRight: _Widthrapport/30,
  },
  textContainer: {
    flexDirection: 'column',
    color: 'black',
    paddingLeft : _Heightrapport>1000?(_Widthrapport)/8:_Widthrapport/10
  },
  callerName: {
    fontSize: _Heightrapport/40,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'DMSans-Medium',
    textTransform: 'capitalize',

  },
  timestamp: {
    fontSize: _Heightrapport/51.5,
    color: '#888888',
  },
  anotherIcon: {
    width: _Heightrapport/36,
    height: _Heightrapport/36,
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
  whiteContainer: {
    position: 'relative',
    top: -_Heightrapport/3.48, 
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
  text: {
    fontSize : _Heightrapport/48 ,
    width : 20 
    
  },
  cancel : {
   // width : _Widthrapport/5,
    
    
  },
  title: {
    color: '#004343',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: _Widthrapport/36,

    //paddingBottom: _Heightrapport/144,
    paddingTop: _Heightrapport/40,
  },
  loadingIndicator: {
    position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  alignItems: 'center',
  justifyContent: 'center',

  },
  
});

export default CallLogsScreen;
