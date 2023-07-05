import {
  faArrowLeft,
  faListCheck,
  faArrowRightFromBracket,
  faKey,
  faCheck,
  faMapMarkerAlt,
  faScrewdriverWrench,
  faArrowUp,
  faArrowTrendUp,
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
  Button,
  Modal,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import CircularProgress from 'react-native-circular-progress';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Easing} from 'react-native';
import {Animated} from 'react-native';
import renderWorkOrder from '../componant/WorkOrders/Workordercard';
import getAllWorkOrders from '../controllers/WorkOrders/workOrderController';
import WorkOrderDao from '../models/DAO/WorkOrderDao';
import {WorkOrder} from '../componant/WorkOrder';
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
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';

function WorkorderDetails({route}: {route: any}) {
  const {item} = route.params;
  const [allWorkOrders, setAllWorkOrders] = useState<WorkOrder[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const navigation = useNavigation();
  const [loadingg, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activities, setactivities] = useState<any[]>();
  const [Wologs, setwologs] = useState<any[]>();

  const handleAskAssisstance = () => {
    navigation.navigate('CreateRoom');
  };

  useEffect(() => {
    console.log('ye sahbyy');
    if (!activities && !Wologs) {
      setLoading(true);
    }
    console.log(loadingg);
  });

  useEffect(() => {
    _handelfetch_data();
  }, [loadingg]);

  useEffect(() => {
    setLoading(false);
    console.log(activities);
    console.log(Wologs);
  }, [activities, Wologs]);

  const _handelfetch_data = async () => {
    console.log('yodkol');
    const activities = await getwActivitiesdb(item.workorderid);
    const Wologs = await getwologdb(item.workorderid);
    setactivities(activities);
    setwologs(Wologs);
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
        <Text style={styles.TopContainer}>My Work Orders </Text>
      </View>

      <View style={styles.whiteContainer}>
        <ScrollView contentContainerStyle={{paddingTop: 0}}>
          <View style={styles.title}>
            <Text style={styles.title}>{item.description} </Text>
            <View style={styles.id}>
              <FontAwesomeIcon icon={faKey} style={styles.icon2} />
              <Text
                style={styles.workOrderTitle1}>{` ${item.workorderid}`}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleAskAssisstance}>
              <Text style={styles.buttonText}>Ask for Assisstance</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.id1}>
            <View style={styles.id4}>
              <Text style={styles.workOrderTitle1}>{` ${'Schedstart'}`}</Text>
              <View style={styles.id}>
                <FontAwesomeIcon icon={faClock} style={styles.icon2} />
                <Text
                  style={styles.workOrderTitle1}>{` ${item.schedstart.substring(
                  0,
                  10,
                )}`}</Text>
              </View>
              <Text style={styles.workOrderTitle2}>{` ${'Location'}`}</Text>
              <View style={styles.id}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon2} />
                <Text
                  style={styles.workOrderTitle1}>{` ${item.location}`}</Text>
              </View>
            </View>
            <View style={styles.id4}>
              <Text style={styles.workOrderTitle1}>{` ${'AssetNum'}`}</Text>
              <View style={styles.id}>
                <FontAwesomeIcon
                  icon={faScrewdriverWrench}
                  style={styles.icon2}
                />
                <Text
                  style={styles.workOrderDeadline1}>{` ${item.assetnum}`}</Text>
              </View>
              <Text style={styles.workOrderTitle2}>{` ${'Status'}`}</Text>
              <View style={styles.id}>
                <FontAwesomeIcon icon={faListCheck} style={styles.icon2} />
                <Text style={styles.workOrderDeadline1}>{item.status}</Text>
              </View>
            </View>
          </View>
          <View style={styles.id1}>
            <View style={styles.id4}></View>
            <View></View>
          </View>

          <View style={styles.title}>
            {activities?.length === 0 ? (
              <Text style={styles.title}>No Work Activities</Text>
            ) : (
              <Text style={styles.title}>Work Activities</Text>
            )}
          </View>
          <View style={styles.spinnerContainer}>
            <Spinner
              isVisible={loadingg}
              size={_Heightrapport/24}
              type="FadingCircleAlt"
              color="#000000"
            />
          </View>
          {!loadingg && (
            <View>
              {activities != undefined && activities.length > 0 && (
                <FlatList
                  data={activities}
                  horizontal
                  renderItem={renderwoActivities}
                  keyExtractor={item => item?.taskid?.toString()}
                  style={{
                    
                    paddingVertical: 0,
                    paddingHorizontal: _Widthrapport/24,
                  }}
                  ItemSeparatorComponent={() => <View style={{width: 10}} />}
                  ListFooterComponent={() => (
                    <View style={{paddingRight: 30}} />
                  )}
                  contentContainerStyle={{paddingBottom: 0}}
                />
              )}
            </View>
          )}
          <View style={styles.wotitle}>
            {Wologs?.length === 0 ? (
              <Text style={styles.title}>No Work Logs Provided</Text>
            ) : (
              <Text style={styles.title}>Work Logs</Text>
            )}
          </View>
          <View style={styles.spinnerContainer}>
            <Spinner
              isVisible={loadingg}
              size={_Heightrapport/24}
              type="FadingCircleAlt"
              color="#000000"
            />
          </View>

          {!loadingg && (
            <View>
              {Wologs != undefined && Wologs.length > 0 && (
                <FlatList
                  data={Wologs}
                  horizontal
                  renderItem={renderwoLogs}
                  keyExtractor={item => item?.worklogid?.toString()}
                  style={{
                   // height: 280,
                    paddingVertical: 10,
                    paddingHorizontal: _Widthrapport/24,
                  }}
                  ItemSeparatorComponent={() => <View style={{width: _Widthrapport/36}} />}
                  ListFooterComponent={() => (
                    <View style={{paddingRight: 30}} />
                  )}
                  contentContainerStyle={{paddingBottom: 30}}
                />
              )}
            </View>
          )}
          
        </ScrollView>
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
  whiteContainer: {
    position: 'relative',
    top: -_Heightrapport/3.27, 
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

    paddingBottom: _Heightrapport/24,
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
  icon2: {
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Medium',
    
    alignItems: 'center',

    //paddingBottom: 30,
    Color: '#2D5151',
  },
  icon3: {
    position: 'absolute',
    top: '5%',
    right: '5%',
    color: '#77E6B6',
    //fontSize: 20,
    fontFamily: 'DMSans-Medium',
    
    alignItems: 'center',

    //paddingBottom: 30,
    Color: '#212427',
  },
  
  title: {
    color: '#004343',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Bold',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: _Heightrapport/72,

    paddingBottom: _Heightrapport/144,
    paddingTop: _Heightrapport/48,
  },

  wotitle: {
    color: '#004343',
    fontSize: _Heightrapport/36,
    fontFamily: 'DMSans-Bold',
    alignItems: 'center',
    justifyContent: 'center',

    paddingBottom: _Heightrapport/144,
  },

  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  spinnerText: {
    color: '#FFF',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  id: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',

    paddingHorizontal: 0,
  },
  id1: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',

    paddingTop: _Heightrapport/36,
    paddingHorizontal: _Widthrapport/8.6,
  },
  id4: {
    //alignItems: 'flex-start',
    //justifyContent: 'flex-start',

    paddingHorizontal: 0,
  },
  workOrderTitle1: {
    fontFamily: 'DMSans-Regular',
    fontSize: _Heightrapport/48,
    paddingLeft: 0,
    color: '#2D5151',
  },
  workOrderTitle2: {
    fontFamily: 'DMSans-Regular',
    fontSize: _Heightrapport/48,
    paddingLeft: 0,
    color: '#2D5151',
    paddingTop: _Heightrapport/24,
  },
  workOrderDeadline1: {
    fontFamily: 'DMSans-Regular',
    color: '#2D5151',
    marginBottom: _Heightrapport/144,
    fontSize: _Heightrapport/55.3,
    paddingLeft: _Heightrapport/144,
  },
  button: {
    backgroundColor: '#2ecc71',
    borderRadius: _Heightrapport/144,
    paddingVertical: _Heightrapport/72,
    paddingHorizontal: _Widthrapport/36,
    marginHorizontal: _Widthrapport/36,
    marginTop : "4%"
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize : _Heightrapport/51.5
    
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WorkorderDetails;
