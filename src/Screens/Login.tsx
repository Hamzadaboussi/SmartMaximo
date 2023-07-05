import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import getAllWorkOrders  from '../controllers/WorkOrders/workOrderController' ;
import SQLite, { enablePromise } from 'react-native-sqlite-storage';
import { useNavigation } from '@react-navigation/native';
import { count, login, logindb } from '../controllers/Authentification/logincontroller';
import { Snackbar } from 'react-native-paper';

import { getwodb } from '../controllers/LocalDB/getwodatabase';
import messaging from '@react-native-firebase/messaging';
import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import { get_CurrentUsername } from '../controllers/Firebase/Firestore/FirebaseQuery';
import { _Heightrapport, _Widthrapport } from '../../StylingUtils';

async function fetchWorkOrders() {
  const workOrders = await getAllWorkOrders();

  //const wo = await getwodb();
  console.log("wsselt aaaa");
  //console.log(wo);

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
async function createUserInFirestore(username: string,sessionId : string, token: string) {
  try {
    // Get a reference to the "users" collection in Firestore
    const usersRef = firestore().collection('users');

    // Query the "users" collection to check if a document with the same username already exists
    const querySnapshot = await usersRef.where('username', '==', username).get();

    // If a document with the same username already exists, update its token
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userRef = usersRef.doc(userDoc.id);
      await userRef.update({
        deviceToken: token,
        sessionId:sessionId,
      });

      console.log('User token updated successfully in Firestore');
      return;
    }

    // Create a new document with the username and device token
    await usersRef.add({
      username: username,
      deviceToken: token,
      sessionId : sessionId
    });

    console.log('User created successfully in Firestore');
  } catch (error) {
    console.error('Error creating/updating user in Firestore:', error);
  }
}


function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [r, setr] = useState("");

  useEffect(() => {
    const testlogging = async () => {
      try {
        const c = await count();
        console.log("hab");
        if (c > 0) {
          const woorkOrders = await basedata();
          const username = await get_CurrentUsername();
          navigation.navigate('HomeScreen', { woorkOrders:  woorkOrders, username : username  });
        
        }
      } catch (error) {
        console.error(error);
      }
    };

    console.log("heeey");
    testlogging();
  }, );

  
  const handleLogin = async () => {
    // Here, you can add your login logic
    console.log(`Email: ${email}, Password: ${password}`);
    try {
      if(email !=="" && password !==""){
       //--here const response = await login(email, password);
       //--here const { success, data, sessionId, error } = response;
        
    
    //--here if (success) {
    if (true) {
        if(true){
        //--here   console.log(success);
        setIsLoading(true);
        //--here const woorkOrders = await fetchWorkOrders();
        const woorkOrders = [''];
        setIsLoading(false);
        console.log('false');
         await logindb(email,password);
         const c = await count();
         console.log(c);
        
        

        console.log("success");
        messaging().requestPermission();
        messaging()
      .getToken()
      .then((token) => {
        // Use the obtained device token as needed (e.g., save it in Firestore)
        console.log('Device Token:', token);
        //--here createUserInFirestore(email, sessionId?sessionId[0]:'none',token);
        createUserInFirestore(email, 'none',token);
      });
      //const woorkOrders = await basedata();
      const username = await get_CurrentUsername();
      setIsLoading(false);
      navigation.navigate('HomeScreen', { woorkOrders:  woorkOrders, username : username  });
        
      

      } 
    }}
    else{
      //--here setr(error.message);
      setShowSnackBar(true);
    }
  //--here }
    } catch (error) {
      console.error(error);
      setShowSnackBar(true);
    }

    
  };
  return (
    <>
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
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faEnvelope} style={styles.icon} />
              <TextInput
                placeholder='Email '
                placeholderTextColor={"#212427"}
                value={email}
                onChangeText={setEmail}

                style={styles.input} />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} style={styles.icon} />
              <TextInput
                placeholder='Password '
                placeholderTextColor={"#212427"}
                value={password}
                onChangeText={setPassword}

                style={styles.input}
                secureTextEntry />
            </View>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.Signup}>Don't have any account ? Sign Up </Text>
        </View>

      </View>
    
    {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
      )}
    <Snackbar visible={showSnackBar} onDismiss={() => setShowSnackBar(false)} duration={Snackbar.DURATION_SHORT}><Text style={{color:"white"}}>${r}</Text></Snackbar></>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
    backgroundColor: '#F8F8FD',
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#F8F8FD',
    
  },
  backgroundImage: {
    flex: 0,
    height: _Heightrapport*0.45,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whiteContainer: {
    position: "relative",
    top:  - _Heightrapport/7.2, 
    left: 0,
    height: _Heightrapport+_Heightrapport/7.2- _Heightrapport*0.45 ,
    width: '100%',
    borderTopLeftRadius: _Heightrapport/10.2, 
    backgroundColor: '#F8F8FD',
    justifyContent: "flex-start",
    alignItems: "center",
    
    
    
  },
  logoContainer: {
    position: 'absolute',
    top: (_Heightrapport*0.45-_Heightrapport/7.2)/2-(_Heightrapport/7.2)/2,
    left: _Widthrapport/2-(_Widthrapport/3.6)/2,
    
    
    justifyContent: 'center',
    alignItems: 'center',
    width: _Widthrapport/3.6,
    height: _Heightrapport/7.2,
    
  },
  image: {
    width: '150%',
    height: '150%',
    resizeMode: 'contain',
    
    
  },
  loginpara : {
    color : "#212427" ,
    fontSize : _Heightrapport/24 , 
    fontFamily : 'Roboto-Medium',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : _Heightrapport/18,
    paddingBottom : _Heightrapport/72,
     
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: _Heightrapport/48,
    marginVertical: _Heightrapport/72,
    paddingVertical: _Heightrapport/144,
    paddingHorizontal: _Widthrapport/36,
    width: _Widthrapport*0.8,
  },
  input: {
    flex: 1,
    paddingHorizontal: _Widthrapport/36,
    fontSize:   _Heightrapport/45,
    color : "#000",
    fontFamily: 'Roboto-Light',
  },
  icon: {
    marginRight: _Widthrapport/36,
    Color: '#212427',
  },
  loginButton: {
    backgroundColor: '#212427',
    borderRadius: _Heightrapport/48,
    paddingVertical: _Heightrapport/60,
    paddingHorizontal: _Widthrapport/18,
    marginTop: _Heightrapport/36,
    width: _Widthrapport*0.8,
    height : _Heightrapport/14.4
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: _Heightrapport/45,
    textAlign: 'center',
    fontFamily: 'Roboto-Light',
  },
  form : {
    justifyContent: "flex-start",
    
    paddingTop :_Heightrapport/24
  },
  Signup : {
    color : "#212427" ,
    fontSize : _Heightrapport/48 , 
    fontFamily : 'Roboto-Regular',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : _Heightrapport/8,
    paddingBottom : _Heightrapport/36,
     
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
  


export default LoginScreen;