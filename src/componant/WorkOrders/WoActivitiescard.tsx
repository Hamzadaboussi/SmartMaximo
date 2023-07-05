import { faArrowLeft, faCheck, faKey, faScrewdriverWrench, faArrowUp, faArrowTrendUp, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
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
import { WoActivity } from '../../models/Entities/WoActivity'
import { _Heightrapport, _Widthrapport } from '../../../StylingUtils';

const renderwoActivities = ({ item }: { item: WoActivity }) => {



    return (
        <TouchableOpacity activeOpacity={1} onPress={() => console.log('workOrderContainer pressed')} >
            <View style={styles.workOrderContainer}>
                <View style={styles.workOrderDescription}>
                    <View>
                        <View style={styles.id}>
                            <FontAwesomeIcon icon={faKey} style={styles.icon2} size={_Heightrapport/48}/>
                            <Text style={styles.workOrderTitle}>{` ${item.taskid}`}</Text>
                        </View>

                    </View>


                </View>
                <Text style={styles.DescriptionLable}>{"Description :"}</Text>
                <Text style={styles.workOrderDescription}>{item.description}</Text>



                <View style={styles.dab}>
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({



    icon2: {


        fontSize: (_Heightrapport-((_Heightrapport-720)/2))/36,
        fontFamily: 'DMSans-Medium',
        height: 12,
        width: 13.59,
        alignItems: 'center',

        paddingBottom: 30,
        Color: '#2D5151',
    },




    workOrderContainer: {
        backgroundColor: '#FFF',
        borderRadius: _Heightrapport/48,
        paddingHorizontal: _Widthrapport/36,
        paddingVertical: _Heightrapport/72,
        marginBottom: 30,
        marginTop: _Heightrapport/144,
        width: _Widthrapport/1.44-(_Widthrapport-360)/2,
        height:  _Heightrapport/3.5-(_Heightrapport-720)/5,
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
        fontSize: (_Heightrapport-((_Heightrapport-720)/2))/60,
        paddingLeft: 10,
        color: '#2D5151',
    },
    workOrderDescription: {
        fontFamily: 'DMSans-Bold',
        color: '#2D5151',
        marginBottom: 0,
        fontSize: (_Heightrapport-((_Heightrapport-720)/2))/40,
        paddingHorizontal: 5,
        height : 'auto',
        minHeight : 42,
    },
    DescriptionLable: {
        fontFamily: 'DMSans-Regular',
        color: '#2D5151',
        marginBottom: 1,
        fontSize: 13,
        paddingHorizontal: 5,
        paddingTop : 10,
    },
    workOrderStatus: {
        fontFamily: 'DMSans-Regular',
        marginTop: 15,
        width: 'auto',
        maxHeight: 40,
        
        paddingright: 30,
       
        borderWidth: 0.5, 
        color: '#212427',
        borderColor: "#21242760",
        backgroundColor: "#77E6B610"



    },

    id: {
        flexDirection: 'row',
        alignItems: 'center',


        paddingHorizontal: 5,

    },
    dab: {
        flexDirection: 'row',
        paddingBottom: 5,
        justifyContent: 'center',
        
    },
    

});

export default renderwoActivities