import { faArrowLeft, faArrowRightFromBracket, faScrewdriverWrench, faArrowUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import CircularProgress from 'react-native-circular-progress';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Easing } from 'react-native';
import { Animated } from 'react-native';
import renderWorkOrder, { WorkOrder } from '../componant/WorkOrders/Workordercard';
import getAllWorkOrders from '../controllers/WorkOrders/workOrderController';
import WorkOrderDao from '../models/DAO/WorkOrderDao';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Logoutdb } from '../controllers/Authentification/logout';
import { getwActivitiesdb,getwodb, getwologdb } from '../controllers/LocalDB/getwodatabase';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';








interface WorkOrderListParams {
    woorkOrders: WorkOrder[];
}







function WorkOrderList() {
    const [filter, setFilter] = useState('All');
    const [totalPages, settotalPages] = useState();
    const [allWorkOrders, setAllWorkOrders] = useState<WorkOrder[]>([]);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [orders, setOrders] = useState<WorkOrder[]>([]);

    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const route = useRoute();
    const logout = async () => {

        try {
            console.log("waywa")
            const a = await Logoutdb();
            //CookieManager.clearAll(() => {
             //   console.log('Cookies cleared!');
             // });
            navigation.navigate("Inter");
        } catch (error) {

            console.error(error);

        }
    }
    const handlePress = async (item: WorkOrder) => {
        //setLoading(true)
       // const activities = await getwActivitiesdb(item.workorderid);
        //const Wologs = await getwologdb(item.workorderid);
        //console.log("chedda");
        
        navigation.navigate('WorkorderDetails', { item: item });
        //navigation.navigate('WorkorderDetails', { activities, Wologs: Wologs, item: item });

        //setLoading(false)
      }
      
    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const { woorkOrders } = route.params as WorkOrderListParams;
                console.log("workordrer" + woorkOrders);
                if (!woorkOrders.length) {
                    setLoading(true);
                    return;
                }
                setOrders(woorkOrders);
                setAllWorkOrders(woorkOrders);
                setWorkOrders(woorkOrders.slice(0, itemsPerPage));
                settotalPages(Math.ceil(woorkOrders.length / itemsPerPage));
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchWorkOrders();
    }, []);





    useEffect(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        setWorkOrders(allWorkOrders.slice(start, end));
    }, [allWorkOrders, currentPage, itemsPerPage]);

    const filterWorkOrders = (status: string) => {
        setFilter(status);
        if (status === 'All') {
            setAllWorkOrders(orders);
            settotalPages(Math.ceil(orders.length / itemsPerPage));
            setCurrentPage(1);
        } else {
            // filter work orders by status
            const filteredWorkOrders = orders.filter((wo) => wo.status === status);
            setAllWorkOrders(filteredWorkOrders);
            settotalPages(Math.ceil(filteredWorkOrders.length / itemsPerPage));
            setCurrentPage(1);
        }
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
        <FontAwesomeIcon icon={faArrowLeft} style={styles.icon}  size={_Heightrapport/40}/>
      </TouchableOpacity>
            
            <TouchableOpacity style={styles.icon3} onPress={() => { logout(); }}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} style={styles.icon} size={_Heightrapport/40} />
            </TouchableOpacity>
            <View style={styles.TopContainer}>

                <Text style={styles.TopContainer} >My Work Orders </Text>

            </View>

            <View style={styles.filterBar}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'All' && styles.activeFilterButton]}
                        onPress={() => filterWorkOrders('All')}>
                        <Text style={styles.filterButtonText}>All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'INPRG' && styles.activeFilterButton]}
                        onPress={() => filterWorkOrders('INPRG')}>
                        <Text style={styles.filterButtonText}>On Progress</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'COMP' && styles.activeFilterButton]}
                        onPress={() => filterWorkOrders('COMP')}>
                        <Text style={styles.filterButtonText}>Completed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'WAPPR' && styles.activeFilterButton]}
                        onPress={() => filterWorkOrders('Scheduled')}>
                        <Text style={styles.filterButtonText}>Scheduled</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'WPLAN' && styles.activeFilterButton]}
                        onPress={() => filterWorkOrders('WPLAN')}>
                        <Text style={styles.filterButtonText}>In Planning</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'CAN' && styles.activeFilterButton]}
                        onPress={() => filterWorkOrders('CAN')}>
                        <Text style={styles.filterButtonText}>Cancelled</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, filter === 'CLOSE' && styles.activeFilterButton]}
                        onPress={() => filterWorkOrders('CLOSE')}>
                        <Text style={styles.filterButtonText}>Closed</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>


            <View style={styles.whiteContainer} >
                <View style={styles.title}>

                    <Text style={styles.title} >{filter} Work Orders </Text>

                </View>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerText}
                />
                {!loading && (
                    <FlatList
                        data={workOrders}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() =>
                                    handlePress(item)
                                }
                            >
                                {renderWorkOrder({ item })}
                            </TouchableOpacity>
                        )}
                        style={{ flexGrow: 1, height: 430 }}
                    />
                )}
                {/* {totalPages?totalPages:1 > 1 && (
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.paginationContainer}
                    >
                        {[...Array(totalPages)].map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.paginationButton,
                                    currentPage === index + 1 && styles.activePaginationButton,
                                ]}
                                onPress={() => setCurrentPage(index + 1)}
                            >
                                <Text style={styles.paginationText}>{index + 1}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )} */}



            </View>


        </View>

    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 50,
    },
    container: {
        flex: 1,
        alignItems: "center",
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
        position: "relative",
        top: -_Heightrapport/4.8, 
        left: 0,
        height: '77%',
        width: '100%',
        borderTopLeftRadius: _Heightrapport/18, 
        borderTopRightRadius: _Heightrapport/18,
        backgroundColor: '#F8F8FD',
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: _Heightrapport/36,


       
    },
    TopContainer: {
        position: 'absolute',
        top: '5%',

        color: "#F8F8FD",
        fontSize: _Heightrapport/36,
        fontFamily: 'DMSans-Medium',

        alignItems: 'center',

        paddingBottom: _Heightrapport/24
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
    icon2: {


        fontSize: _Heightrapport/36,
        
        alignItems: 'center',

        paddingBottom: 30,
        Color: '#2D5151',
    },
    icon3: {
        position: 'absolute',
        top: '5%',
        right: '8%',
        color: "#77E6B6",
        
        
        alignItems: 'center',

        
        Color: '#212427',
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "flex-start",
        height: _Heightrapport/18,
        width: "90%",
        borderRadius: 5,
        borderColor: "#FFFFFF40",
        borderWidth: 0.5,
        paddingHorizontal: 0,


        position: 'absolute',
        top: '14%',
        left: '5%',
    },
    filterText: {
        fontWeight: 'bold',
        marginRight: _Widthrapport/36,
    },
    filterButton: {

        paddingVertical: _Heightrapport/90,
        paddingHorizontal: _Widthrapport/27.6,
        borderRadius: _Heightrapport/144,
        height: _Heightrapport/18,
    },
    filterButtonSelected: {
        backgroundColor: '#BBDEFB',
    },
    filterButtonText: {

        color: '#F8F8FD',
        fontSize: _Heightrapport/45,
        fontFamily: 'DMSans-Regular',
    },
    title: {
        color: "#004343",
        fontSize: _Heightrapport/36,
        fontFamily: 'DMSans-Bold',

        justifyContent: "flex-start",


        paddingLeft: -_Widthrapport/30,
        paddingBottom: _Heightrapport/60,
        paddingTop: _Heightrapport/60
    },

    activeFilterButton: {
        backgroundColor: '#FFFFFF33',

    },
    paginationContainer: {
        flexDirection: 'row',
        marginTop: _Heightrapport/72,


        paddingHorizontal: _Widthrapport/16,
        alignSelf: "flex-end",
        justifyContent: 'center',

    },
    paginationButton: {
        paddingVertical: _Heightrapport/120,
        paddingHorizontal: _Widthrapport/36,
        marginRight: _Widthrapport/36,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: _Heightrapport/144,



    },
    activePaginationButton: {
        backgroundColor: '#77E6B6',
    },
    paginationText: {
        fontSize: _Heightrapport/45,
        color: "#212427",
        fontFamily: 'DMSans-Medium',
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
});

export default WorkOrderList;
