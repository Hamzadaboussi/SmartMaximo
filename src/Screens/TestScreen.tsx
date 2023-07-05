import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { View, ImageBackground, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView,  Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import getAllWorkOrders  from '../controllers/WorkOrders/workOrderController' ;
import SQLite, { enablePromise } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';
import { count, login, logindb } from '../controllers/Authentification/logincontroller';
import { Alert } from 'react-native';
import { Snackbar } from 'react-native-paper';
import NavigationStack from '../stack/stacknavigation';
import { getwodb } from '../controllers/LocalDB/getwodatabase';
import { get_CurrentUsername } from '../controllers/Firebase/Firestore/FirebaseQuery';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';
import { ActivityIndicator } from 'react-native-paper';

//import { handleScreenCapture } from '../Bridge/ScreenshotModule';



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
  const test =useRef<Boolean>(false)
  console.log(_Widthrapport);
  console.log(_Heightrapport);
  
// const _handelLogintest = async ()=>{
//   while(test.current==false){
//     try{
//     await handleContinue();}
//     catch (e : any) { 
//       console.error("failed");
//     };
    
//   }
// };
  
  const handleContinue = async () => {
    setIsLoading(true);
    //handleScreenCapture();
    const username = await get_CurrentUsername();
    console.error(username);
    
      const c = await count();
      
      console.log("this is c",c);
      if (c > 0) {
        const woorkOrders = await  getwodb();
        //navigation.navigate('WorkOrderList', { woorkOrders: woorkOrders });
        test.current=true
        navigation.navigate('HomeScreen', { woorkOrders: woorkOrders , username : username});
        setIsLoading(false)
      }
      else {
        test.current=true
        navigation.navigate('Login');
        setIsLoading(false)
      }
    
    
    
  };
  

  
  return (
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
          

            
          
          <TouchableOpacity style={styles.loginButton} onPress={async()=> await handleContinue()}>
            <Text style={styles.loginText}>Continue</Text>
          </TouchableOpacity>
          
        </View>
        {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
      )}

      </View>
    
  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    alignItems: "center",
    
  },
  backgroundImage: {
    flex: 0,
    height: _Heightrapport*0.6,
    width: _Widthrapport,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteContainer: {
    position: "relative",
    top:  - _Heightrapport/6, 
    left: 0,
    height: _Heightrapport+_Heightrapport/6-_Heightrapport*0.6,
    width: '100%',
    borderTopLeftRadius: _Widthrapport/5.14,
    backgroundColor: '#F8F8FD',
    //justifyContent: "flex-start",
    alignItems: "center",
    
    
    
    /* Add your styles for white container */
  },
  logoContainer: {
    position: 'absolute',
    top: ((_Heightrapport*0.6-_Heightrapport/6)/2)-(_Widthrapport/3.6)/4,
    left: _Widthrapport*0.36,
    
    justifyContent: 'center',
    alignItems: 'center',
    width: _Widthrapport/3.6,
    height: _Heightrapport/7.2,
    paddingBottom : _Heightrapport/24
  },
  image: {
    width: '150%',
    height: '150%',
    resizeMode: 'contain',
    
    
  },
  loginpara : {
    
    color : "#212427" ,
    fontSize : _Widthrapport/12 , 
    fontFamily : 'DMSans-Medium',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : (_Heightrapport+_Heightrapport/6-_Heightrapport*0.6)/4,
    paddingBottom : _Heightrapport/72
     
  },
  tagnpara: {
    color : "#212427" ,
    fontSize : _Heightrapport/36 , 
    fontFamily : 'DMSans-Medium',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : 0,
    paddingBottom : _Heightrapport/72
     
  },
  
  
 
  loginButton: {
    backgroundColor: '#212427',
    alignContent :'flex-end',
    borderRadius: 15,
    paddingVertical: _Heightrapport/60,
    paddingHorizontal: _Widthrapport/18,
    marginTop: (_Heightrapport+_Heightrapport/6-_Heightrapport*0.6)*15/100,
    width: _Widthrapport*0.8,
    height : _Heightrapport/14,
    
    
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: _Widthrapport/22.5,
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
  },
 
  Signup : {
    color : "#212427" ,
    fontSize : _Widthrapport/21.3 , 
    fontFamily : 'Roboto-Regular',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : _Heightrapport/8,
    paddingBottom : _Heightrapport/36,
     
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
  


export default WelcomeScreen;