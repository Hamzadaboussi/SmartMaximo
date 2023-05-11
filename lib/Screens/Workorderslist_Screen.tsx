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
import renderWorkOrder from '../componant/Workordercard';
import getAllWorkOrders from '../controllers/workOrderController';
import WorkOrderDao from '../models/WorkOrderDao';
import { WorkOrder } from '../componant/WorkOrder';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Logoutdb } from '../controllers/logout';
import { getwActivitiesdb,getwodb, getwologdb } from '../controllers/getwodatabase';
//import CookieManager from 'react-native-cookies';








interface WorkOrderListParams {
    woorkOrders: WorkOrder[];
}



/*
const data = [
    { id: "SER1", status: 'On Progress', description: 'Fix the broken door', deadline: '2022-05-01' },
    { id: "SER2", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER3", status: 'New', description: 'Install new lights', deadline: '2022-07-23' },
    { id: "SER4", status: 'On Progress', description: 'Repair the roof', deadline: '2022-08-09' },
    { id: "SER5", status: 'New', description: 'Install new lights', deadline: '2022-07-23' },
    { id: "SER6", status: 'On Progress', description: 'Repair the roof', deadline: '2022-08-09' },
    { id: "SER7", status: 'New', description: 'Install new lights', deadline: '2022-07-23' },
    { id: "SER8", status: 'On Progress', description: 'Repair the roof', deadline: '2022-08-09' },
    { id: "SER9", status: 'On Progress', description: 'Repair the roof', deadline: '2022-08-09' },
    { id: "SER10", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER21", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER22", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER23", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER24", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER25", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER26", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    { id: "SER27", status: 'Completed', description: 'Paint the wall', deadline: '2022-06-15' },
    
]*/




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
        setLoading(true)
        const activities = await getwActivitiesdb(item.workorderid);
        const Wologs = await getwologdb(item.workorderid);
        console.log("chedda");
        
        navigation.navigate('WorkorderDetails', { activities, Wologs: Wologs, item: item });
        setLoading(false)
      }
      
    useEffect(() => {
        const fetchWorkOrders = async () => {
            try {
                const { woorkOrders } = route.params as WorkOrderListParams;
                console.log("yezeuuuuuuuuuuuuuur" + woorkOrders);
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
            
            <TouchableOpacity style={styles.icon3} onPress={() => { logout(); }}>
                <FontAwesomeIcon icon={faArrowRightFromBracket} style={styles.icon} />
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
                {totalPages > 1 && (
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
                )}



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
        top: - 150, // 10 pixels overlapping
        left: 0,
        height: '77%',
        width: '100%',
        borderTopLeftRadius: 40, // Set the top-left border radius
        borderTopRightRadius: 40,
        backgroundColor: '#F8F8FD',
        justifyContent: "flex-start",
        alignItems: "center",
        paddingBottom: 20,


        /* Add your styles for white container */
    },
    TopContainer: {
        position: 'absolute',
        top: '5%',

        color: "#F8F8FD",
        fontSize: 20,
        fontFamily: 'DMSans-Medium',

        alignItems: 'center',

        paddingBottom: 30
    },

    icon: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        color: "#77E6B6",
        fontSize: 20,
        fontFamily: 'DMSans-Medium',
        height: 12,
        width: 13.59,
        alignItems: 'center',

        paddingBottom: 30,
        Color: '#212427',
    },
    icon2: {


        fontSize: 20,
        fontFamily: 'DMSans-Medium',
        height: 12,
        width: 13.59,
        alignItems: 'center',

        paddingBottom: 30,
        Color: '#2D5151',
    },
    icon3: {
        position: 'absolute',
        top: '5%',
        right: '5%',
        color: "#77E6B6",
        fontSize: 20,
        fontFamily: 'DMSans-Medium',
        height: 12,
        width: 13.59,
        alignItems: 'center',

        paddingBottom: 30,
        Color: '#212427',
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "flex-start",
        height: 40,
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
        marginRight: 10,
    },
    filterButton: {

        paddingVertical: 8,
        paddingHorizontal: 13,
        borderRadius: 5,
        height: 40,
    },
    filterButtonSelected: {
        backgroundColor: '#BBDEFB',
    },
    filterButtonText: {

        color: '#F8F8FD',
        fontSize: 16,
        fontFamily: 'DMSans-Regular',
    },
    title: {
        color: "#004343",
        fontSize: 20,
        fontFamily: 'DMSans-Bold',

        justifyContent: "flex-start",


        paddingLeft: -12,
        paddingBottom: 12,
        paddingTop: 12
    },

    activeFilterButton: {
        backgroundColor: '#FFFFFF33',

    },
    paginationContainer: {
        flexDirection: 'row',
        marginTop: 10,


        paddingHorizontal: 20,
        alignSelf: "flex-end",
        justifyContent: 'center',

    },
    paginationButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,



    },
    activePaginationButton: {
        backgroundColor: '#77E6B6',
    },
    paginationText: {
        fontSize: 16,
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
