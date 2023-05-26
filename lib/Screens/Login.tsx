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
import messaging from '@react-native-firebase/messaging';
import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

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
async function createUserInFirestore(username: string, token: string) {
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
      });

      console.log('User token updated successfully in Firestore');
      return;
    }

    // Create a new document with the username and device token
    await usersRef.add({
      username: username,
      deviceToken: token,
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
          navigation.navigate('WorkOrderList', { woorkOrders: woorkOrders });
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
     const response = await login(email, password);
     const { success, error } = response;
    
  if (success) {
        if(true){
        console.log(success);
        setIsLoading(true);
        const woorkOrders = await fetchWorkOrders();
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
        createUserInFirestore(email, token);
        
      });
      navigation.navigate('WorkOrderList', { woorkOrders:  woorkOrders  });
        
      

      } else {
        Alert.alert('Cant do it');
      }
    }
    else{
      setr(r);
      setShowSnackBar(true);
    }}
    } catch (error) {
      console.error(error);
      setShowSnackBar(true);
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
    </ScrollView>
    {isLoading && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size='large' color='#007AFF' />
        </View>
      )}
    <Snackbar visible={showSnackBar} onDismiss={() => setShowSnackBar(false)} duration={Snackbar.DURATION_SHORT}>${r}</Snackbar></>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
    backgroundColor: '#F8F8FD',
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
    top:  - 100, // 10 pixels overlapping
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
    top: '5%',
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
    fontFamily : 'Roboto-Medium',
    textAlign : "left",
    alignSelf :"center",
    paddingTop : 40,
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
    marginTop: 20,
    width: '80%',
    height : 50
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Roboto-Light',
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
  


export default LoginScreen;