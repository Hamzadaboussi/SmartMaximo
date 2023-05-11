import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import getAllWorkOrders  from '../controllers/workOrderController' ;
import SQLite, { enablePromise } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';
import { count, login, logindb } from '../controllers/logincontroller';
import { Alert } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { WorkOrder } from '../componant/WorkOrder';
import NavigationStack from './stack/stacknavigation';
import { getwodb } from '../controllers/getwodatabase';



async function fetchWorkOrders() {
  const workOrders = await getAllWorkOrders();

  const wo = await getwodb();
  console.log(wo);

  return workOrders

  //const wo = getwodb();
 // console.log(wo);

}
async function basedata() {
  //const workOrders = await getAllWorkOrders();

  const wo = await getwodb();
  console.log(wo);

  return wo

  //const wo = getwodb();
 // console.log(wo);

}

function WelcomeScreen() {
  const navigation = useNavigation();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  

  
  const handleContinue = async () => {
    // Here, you can add your login logic
    
    try {
      const c = await count();
      console.log(c);
      if (c > 0) {
        const woorkOrders = await basedata();
        navigation.navigate('WorkOrderList', { woorkOrders: woorkOrders });
      }
      else {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
    }

    
  };
  return (
    <><ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <FastImage
          source={require('../assets/hearts&magic.gif')}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover} />

        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo2.png')} style={styles.image} />

        </View>
        <View style={styles.whiteContainer}>
          <Text style={styles.loginpara}>Welcome Back </Text>
          <Text style={styles.tagnpara}>To Smart Maximo Application </Text>
          

            
          
          <TouchableOpacity style={styles.loginButton} onPress={handleContinue}>
            <Text style={styles.loginText}>Continue</Text>
          </TouchableOpacity>
          
        </View>

      </View>
    </ScrollView>
    {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
      )}
    <Snackbar visible={showSnackBar} onDismiss={() => setShowSnackBar(false)} duration={Snackbar.DURATION_SHORT}>An error occurred. Please try again.</Snackbar></>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    alignItems: "center",
    
  },
  backgroundImage: {
    flex: 0,
    height: '60%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteContainer: {
    position: "relative",
    top:  - 60, // 10 pixels overlapping
    left: 0,
    height: '100%',
    width: '100%',
    borderTopLeftRadius: 70, // Set the top-left border radius
    backgroundColor: '#F8F8FD',
    justifyContent: "flex-start",
    alignItems: "center",
    
    
    /* Add your styles for white container */
  },
  logoContainer: {
    position: 'absolute',
    top: '22%',
    left: '36%',
    borderRadius: 50,
    
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    paddingBottom : 30
  },
  image: {
    width: '150%',
    height: '150%',
    resizeMode: 'contain',
    
    
  },
  loginpara : {
    color : "#212427" ,
    fontSize : 30 , 
    fontFamily : 'DMSans-Medium',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : "25%",
    paddingBottom : 10
     
  },
  tagnpara: {
    color : "#212427" ,
    fontSize : 20 , 
    fontFamily : 'DMSans-Medium',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : 0,
    paddingBottom : 10
     
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 15,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '80%',
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color : "#000",
    fontFamily: 'Roboto-Light',
  },
  icon: {
    marginRight: 10,
    Color: '#212427',
  },
  loginButton: {
    backgroundColor: '#212427',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: "15%",
    width: '80%',
    height : 50
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
  },
  form : {
    justifyContent: "flex-start",
    
    paddingTop :30
  },
  Signup : {
    color : "#212427" ,
    fontSize : 15 , 
    fontFamily : 'Roboto-Regular',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : 90,
    paddingBottom : 20,
     
  },
  
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#F8F8FD',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
    loadingIndicator: {
      backgroundColor: '#F8F8FD',
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#ffffff',
      borderStyle: 'solid',
      borderTopColor: '#00aeef',
      alignSelf: 'center',
      marginTop: 20,
      marginBottom: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  


export default WelcomeScreen;