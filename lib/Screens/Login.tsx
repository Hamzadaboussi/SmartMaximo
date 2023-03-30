import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { View, ImageBackground, StyleSheet, Image, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import FastImage from 'react-native-fast-image';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Here, you can add your login logic
    console.log(`Email: ${email}, Password: ${password}`);
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <FastImage
          source={require('../assets/hearts&magic.gif')}
          style={styles.backgroundImage}
          resizeMode={FastImage.resizeMode.cover}
        />
        
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo2.png')} style={styles.image} />
          
        </View>
        <View style={styles.whiteContainer} >
        <Text style={styles.loginpara}>Welcome Back </Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={ faEnvelope } style={styles.icon} />
          <TextInput
            placeholder='Email '
            placeholderTextColor={"#212427" }
            value={email}
            onChangeText={setEmail}
            
            style={styles.input}
          />
          </View>

          <View style={styles.inputContainer}>
          <FontAwesomeIcon icon={ faLock  } style={styles.icon} />
            <TextInput
              placeholder='Password '
              placeholderTextColor={"#212427" }
              value={password}
              onChangeText={setPassword}
              
              style={styles.input}
              secureTextEntry
            />
        </View>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.Signup}>Don't have any account ? Sign Up </Text>
        </View>
        
      </View>
    </ScrollView>
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
});

export default LoginScreen;
