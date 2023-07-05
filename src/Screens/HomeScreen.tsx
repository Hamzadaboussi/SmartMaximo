import {
  faArrowLeft,
  faArrowRightFromBracket,
  faScrewdriverWrench,
  faArrowUp,
  faArrowTrendUp,
  faBriefcase,
  faVideo,
  faClockRotateLeft,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import {faClock} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useEffect, useRef, useState} from 'react';
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
import FastImage from 'react-native-fast-image';
import CircularProgress from 'react-native-circular-progress';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Easing} from 'react-native';
import {Animated} from 'react-native';
import renderWorkOrder, { WorkOrder } from '../componant/WorkOrders/Workordercard';
import getAllWorkOrders from '../controllers/WorkOrders/workOrderController';
import WorkOrderDao from '../models/DAO/WorkOrderDao';
import {useNavigation} from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import {useRoute} from '@react-navigation/native';
import axios from 'axios';
import {Logoutdb, logoutMaximo} from '../controllers/Authentification/logout';
import {
  getwActivitiesdb,
  getwodb,
  getwologdb,
} from '../controllers/LocalDB/getwodatabase';
import { getCallLogs, get_CurrentUsername } from '../controllers/Firebase/Firestore/FirebaseQuery';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';
import { ActivityIndicator } from 'react-native-paper';
import { Calllog } from '../models/Entities/Calllog';

interface WorkOrderListParams {
  woorkOrders: WorkOrder[]
  username : string
}

function HomeScreen() {
  const Calllogs = useRef<Calllog[]>();

  const [isLoading, setIsLoading] = useState(false);
   const navigation = useNavigation();
  const route = useRoute();
  const { woorkOrders ,username } = route.params as WorkOrderListParams;
  const logout = async () => {
    try {
      console.log('waywa');
      const result = await logoutMaximo();
      const a = await Logoutdb();
      
      
      navigation.navigate("Inter");
    } catch (error) {
      console.error(error);
    }
  };
  const _handelfetchCalllogs = async() =>{
    setIsLoading(true)
    await getCallLogs(username,Calllogs)
    navigation.navigate('CallLogs', { username: username ,Calllogs:Calllogs.current });
    setIsLoading(false)
  }
  const currentDate = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formattedDate = `${weekdays[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    function countCompletedWorkOrders(workOrders: WorkOrder[]): number {
        const completedWorkOrders = workOrders.filter(order => order.status === "COMP");
        return completedWorkOrders.length;
      }
      const completedCount = countCompletedWorkOrders(woorkOrders);
      function countINPRGWorkOrders(workOrders: WorkOrder[]): number {
        const completedWorkOrders = workOrders.filter(order => order.status === "INPRG");
        return completedWorkOrders.length;
      }
      const INPRGCount = countINPRGWorkOrders(woorkOrders);

      function countCLOSEWorkOrders(workOrders: WorkOrder[]): number {
        const completedWorkOrders = workOrders.filter(order => order.status === "CLOSE");
        return completedWorkOrders.length;
      }
      const CLOSECount = countCLOSEWorkOrders(woorkOrders);
      
      

  return (
    <View style={styles.container}>
      <FastImage
        source={require('../assets/hearts&magic.gif')}
        style={styles.backgroundImage}
        resizeMode={FastImage.resizeMode.cover}
      />

      <TouchableOpacity
        style={styles.icon3}
        onPress={() => {
          logout();
        }}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} style={styles.icon}  size={_Heightrapport/40}/>
      </TouchableOpacity>
      <View style={styles.squareContainer}>
        <View>
        <TouchableOpacity onPress={() => navigation.navigate('WorkOrderList', { woorkOrders: woorkOrders })}  activeOpacity={0.9}>
        <View style={styles.topSquare}>
            <View style = {styles.iconcontainer}>
            <FontAwesomeIcon icon={faBriefcase} style={styles.squareIcon} size={_Heightrapport/28.8} />
            </View>
            <Text style={styles.squareText}>Work Orders</Text>
            <Text style={styles.squareTextDescription}>View all your workorders</Text>
          </View>
          </TouchableOpacity >
          <TouchableOpacity onPress={() => _handelfetchCalllogs()}  activeOpacity={0.9}>
          <View style={styles.topSquare}>
            <View style = {styles.iconcontainer}>
            <FontAwesomeIcon icon={faClockRotateLeft} style={styles.squareIcon} size={_Heightrapport/28.8} />
            </View>
            <Text style={styles.squareText}>Call Logs</Text>
            <Text style={styles.squareTextDescription}>View your Call history</Text>
          </View>
          </TouchableOpacity>
        </View>
        <View>
          
        <TouchableOpacity onPress={() => navigation.navigate('CreateRoom')}>
        <View style={styles.topSquare}>
            <View style = {styles.iconcontainer}>
            <FontAwesomeIcon icon={faVideo} style={styles.squareIcon} size={_Heightrapport/28.8} />
            </View>
            <Text style={styles.squareText}>Video Assistance</Text>
          </View>
        </TouchableOpacity>
          <View style={styles.topSquare}>
            <View style = {styles.iconcontainer}>
            <FontAwesomeIcon icon={faGear} style={styles.squareIcon} size={_Heightrapport/28.8} />
            </View>
            <Text style={styles.squareText}>Settings</Text>
            <Text style={styles.squareTextDescription}>Configure App Settings</Text>
          </View>
        </View>
      </View>
      <View style={styles.TopContainer}>
        <Text style={styles.TopText}>Hello , {username} </Text>
      </View>
      <View style={styles.TopContainer2}>
        <Text style={styles.TopText2}>{formattedDate} </Text>
      </View>

      <View style={styles.NumContainer}>
        <View style={styles.Group1}>
          <Text style={styles.Number}>0{INPRGCount} </Text>
          <Text style={styles.text}>Task In Progress </Text>
        </View>
        <View style={styles.Group1}>
          <Text style={styles.Number}>0{completedCount} </Text>
          <Text style={styles.text}>Task Completed </Text>
        </View>
        <View style={styles.Group1}>
          <Text style={styles.Number}>0{CLOSECount} </Text>
          <Text style={styles.text}>Task Closed </Text>
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
  
  container: {
    flex: 1,

    backgroundColor: '#F8F8FD',
  },
  backgroundImage: {
    flex: 0,
    height: _Heightrapport*0.5,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteContainer: {
   

  },
  TopContainer: {
    position: 'absolute',
    top: _Heightrapport*0.05,

    color: '#F8F8FD',

    alignItems: 'flex-start',
    paddingLeft: _Widthrapport/18,
    paddingBottom: _Heightrapport/24,
  },
  NumContainer: {
    position: 'absolute',
    top: _Heightrapport*0.18,

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
    paddingLeft: _Widthrapport/16,
    fontFamily: 'DMSans-Medium',
    flexDirection: 'column',

    alignContent: 'flex-start',
  },
  Number: {
    color: '#F8F8FD',
    fontFamily: 'DMSans-Medium',
    fontSize: _Heightrapport/12,
  },
  text: {
    color: '#F8F8FD',
    fontSize: _Heightrapport/48,
    width: _Widthrapport/4.5,
  },
  TopText: {
    alignItems: 'flex-end',
    color: '#F8F8FD',
    fontSize: _Heightrapport/28.8,
    fontFamily: 'DMSans-Medium',
    textTransform: 'capitalize',

  },
  TopContainer2: {
    position: 'absolute',
    top: _Heightrapport*0.1,

    color: '#F8F8FD',
    fontSize: _Heightrapport/48,
    fontFamily: 'DMSans-Medium',

    alignItems: 'flex-end',
    paddingLeft: _Widthrapport/16,
    paddingBottom: _Heightrapport/24,
  },
  TopText2: {
    fontSize: _Heightrapport/48,
    fontFamily: 'DMSans-Medium',
    color: '#F8F8FD',
  },
  squareContainer: {
    position: 'absolute',
    top: _Heightrapport/2 -_Heightrapport/9,
    flexDirection: 'row',
    marginLeft: _Widthrapport/2-Dimensions.get('window').width / 2.5-(_Widthrapport/16)*1.5,
  },
  topSquare: {
    width: Dimensions.get('window').width / 2.5,
    height: _Heightrapport / 4.5,
    backgroundColor: 'white',
    marginBottom: _Heightrapport/36,
    borderRadius: _Heightrapport/48,
    marginLeft: _Widthrapport/16,
  },

  icon: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    color: '#77E6B6',
    //fontSize: 20,
    //fontFamily: 'DMSans-Medium',
    //height: _Heightrapport,
    //width: 13.59,
    alignItems: 'center',

    paddingBottom: _Heightrapport/24,
    Color: '#212427',
  },
  
  icon3: {
    position: 'absolute',
    top: '5%',
    right: '10%',
    color: '#77E6B6',
    //fontSize: 40,
    //fontFamily: 'DMSans-Medium',
    height: _Heightrapport/60,
    alignItems: 'center',

    paddingBottom: _Heightrapport/24,
    Color: '#212427',
  },
  squareIcon: {
    color: '#77E6B6',
    
    alignSelf : "center",
    paddingTop : _Heightrapport/18
    
  },
  squareText: {
    color: '#212427',
    fontSize: _Heightrapport/36,
    marginLeft : _Widthrapport/36,
    marginTop : _Heightrapport/36,
    fontFamily: 'DMSans-Bold', 
  },
  iconcontainer : {
    width : "25%",
    height : "25%",
    backgroundColor : "#E0F4F4",
    marginLeft : _Widthrapport/36,
    marginTop : _Heightrapport/72 ,
    alignItems : "center",
    borderRadius : 8,
  },
  squareTextDescription : {
    color: '#212427',
    fontSize: _Heightrapport/72,
    marginLeft : _Widthrapport/36,
    marginTop : _Heightrapport/72,
    fontFamily: 'DMSans-Regular', 
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

export default HomeScreen;
