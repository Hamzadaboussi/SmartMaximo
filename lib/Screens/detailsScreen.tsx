import { faArrowLeft, faListCheck, faArrowRightFromBracket, faKey, faCheck, faMapMarkerAlt, faScrewdriverWrench, faArrowUp, faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
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
import { RouteProp, useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import renderwoActivities from '../componant/WoActivitiescard';
import renderwoLogs from '../componant/Wologscard';








const data = [
    { taskid: 2, status: 'On Progress', description: 'Fix the broken door' },
    { taskid: 3, status: 'Completed', description: 'Paint the wall' },
    { taskid: 4, status: 'New', description: 'Install new lights' },
    { taskid: 5, status: 'On Progress', description: 'Repair the roof' },
    { taskid: 6, status: 'New', description: 'Install new lights' },


]
const data2 = [
    { worklogid: 2, logtype: 'On Progress', description: 'Fix the broken door', createdate: '2007-01-03', createby: 'hamza daboussi' },
    { worklogid: 3, logtype: 'Completed', description: 'Paint the wall', createdate: '2004-10-12', createby: 'hamza daboussi' },
    { worklogid: 4, logtype: 'New', description: 'Install new lights', createdate: '2006-05-04', createby: 'hamza daboussi' },
    { worklogid: 5, logtype: 'On Progress', description: 'Repair the roof', createdate: '2014-03-02', createby: 'hamza daboussi' },
    { worklogid: 6, logtype: 'New', description: 'Install new lights', createdate: '2005-09-12', createby: 'hamza daboussi' },



]




function WorkorderDetails({ route }: { route: any }) {
    const { item, activities, Wologs } = route.params;
    const [allWorkOrders, setAllWorkOrders] = useState<WorkOrder[]>([]);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [orders, setOrders] = useState<WorkOrder[]>([]);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    return (

        <View style={styles.container}>
            <FastImage
                source={require('../assets/hearts&magic.gif')}
                style={styles.backgroundImage}
                resizeMode={FastImage.resizeMode.cover}
            />
            <TouchableOpacity style={styles.icon} onPress={() => { navigation.goBack() }}>
                <FontAwesomeIcon icon={faArrowLeft} style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.TopContainer}>

                <Text style={styles.TopContainer} >My Work Orders </Text>

            </View>


            <View style={styles.whiteContainer} >

                <ScrollView contentContainerStyle={{ paddingTop: 0 }}>
                    <View style={styles.title}>

                        <Text style={styles.title} >{item.description} </Text>
                        <View style={styles.id}>
                            <FontAwesomeIcon icon={faKey} style={styles.icon2} />
                            <Text style={styles.workOrderTitle1}>{` ${item.workorderid}`}</Text>
                        </View>


                    </View>
                    <View style={styles.id1}>
                        <View style={styles.id4}>
                            <Text style={styles.workOrderTitle1}>{` ${"Schedstart"}`}</Text>
                            <View style={styles.id}>
                                <FontAwesomeIcon icon={faClock} style={styles.icon2} />
                                <Text style={styles.workOrderTitle1}>{` ${item.schedstart.substring(0, 10)}`}</Text>

                            </View>
                            <Text style={styles.workOrderTitle2}>{` ${"Location"}`}</Text>
                            <View style={styles.id}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} style={styles.icon2} />
                                <Text style={styles.workOrderTitle1}>{` ${item.location}`}</Text>
                            </View>
                        </View>
                        <View style={styles.id4}>
                            <Text style={styles.workOrderTitle1}>{` ${"AssetNum"}`}</Text>
                            <View style={styles.id}>
                                <FontAwesomeIcon icon={faScrewdriverWrench} style={styles.icon2} />
                                <Text style={styles.workOrderDeadline1}>{` ${item.assetnum}`}</Text>
                            </View>
                            <Text style={styles.workOrderTitle2}>{` ${"Status"}`}</Text>
                            <View style={styles.id}>
                                <FontAwesomeIcon icon={faListCheck} style={styles.icon2} />
                                <Text style={styles.workOrderDeadline1}>{item.status}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.id1}>
                        <View style={styles.id4}>

                        </View>
                        <View >

                        </View>
                    </View>
                    <View style={styles.title}>
                        {activities.length === 0 ? (
                            <Text style={styles.title}>No Work Activities</Text>
                        ) : (
                            <Text style={styles.title}>Work Activities</Text>
                        )}
                    </View>
                    <Spinner
                        visible={loading}
                        textContent={'Loading...'}
                        textStyle={styles.spinnerText}
                    />
                    <View >
                        {activities.length > 0 && (
                            <FlatList
                                data={activities}
                                horizontal
                                renderItem={renderwoActivities}
                                keyExtractor={(item) => item?.taskid?.toString()}
                                style={{ height: 230, paddingVertical: 10, paddingHorizontal: 15 }}
                                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                                ListFooterComponent={() => <View style={{ paddingRight: 30 }} />}
                                contentContainerStyle={{ paddingBottom: 0 }}
                            />
                        )}
                        <View style={styles.wotitle}>
                        {Wologs.length === 0 ? (
                            <Text style={styles.title}>No Work Logs Provided</Text>
                        ) : (
                            <Text style={styles.title}>Work Logs</Text>
                        )}
                        </View>
                        {Wologs.length > 0 && (
                        <FlatList
                            data={Wologs}
                            horizontal
                            renderItem={renderwoLogs}
                            keyExtractor={(item) => item?.worklogid?.toString()}
                            style={{ height: 280, paddingVertical: 10, paddingHorizontal: 15 }}
                            ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                            ListFooterComponent={() => <View style={{ paddingRight: 30 }} />}
                            contentContainerStyle={{ paddingBottom: 30 }}
                        />
                        )}

                    </View>
                    <View style={{ height: 40 }} />



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
        top: - 220, // 10 pixels overlapping
        left: 0,
        height: '90%',
        width: '100%',
        borderTopLeftRadius: 40, // Set the top-left border radius
        borderTopRightRadius: 40,
        backgroundColor: '#F8F8FD',
        justifyContent: "flex-start",
        //alignItems: "center",
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
        alignItems: 'center',
        justifyContent: "center",
        paddingHorizontal:10 ,


        paddingBottom: 5,
        paddingTop: 15
    },

    wotitle: {
        color: "#004343",
        fontSize: 20,
        fontFamily: 'DMSans-Bold',
        alignItems: 'center',
        justifyContent: "center",



        paddingBottom: 5,

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

        paddingTop: 20,
        paddingHorizontal: 42,

    },
    id4: {

        //alignItems: 'flex-start',
        //justifyContent: 'flex-start',


        paddingHorizontal: 0,

    },
    workOrderTitle1: {
        fontFamily: 'DMSans-Regular',
        fontSize: 15,
        paddingLeft: 0,
        color: '#2D5151',
    },
    workOrderTitle2: {
        fontFamily: 'DMSans-Regular',
        fontSize: 15,
        paddingLeft: 0,
        color: '#2D5151',
        paddingTop: 30,
    },
    workOrderDeadline1: {
        fontFamily: 'DMSans-Regular',
        color: '#2D5151',
        marginBottom: 5,
        fontSize: 13,
        paddingLeft: 5,
    },
});

export default WorkorderDetails;
