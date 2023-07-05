import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMessage, faPaperPlane,faArrowsUpDownLeftRight, faPaperclip, faArrowLeft, faMinimize} from '@fortawesome/free-solid-svg-icons';
import { _Heightrapport, _Widthrapport } from '../../../../StylingUtils';
import { sendMessage, subscribeToNewMessages } from '../../../controllers/Firebase/RealTimeDB/MessagingRTDB';
let h = _Heightrapport
let w =_Widthrapport



interface Props {
  conversationId: number;
  messages: any[];
  current_username?: string;
  target_token?: string;
  setChatmaximize: React.Dispatch<React.SetStateAction<boolean>>
  setShowChatOverlay: React.Dispatch<React.SetStateAction<boolean>>

}

const ChatWindow = (props: Props) => {
  const [messages, setMessages] = useState<any[]>(props.messages);
  const [inputMessage, setInputMessage] = useState<string>('');
  const flatListRef = useRef<FlatList | null>(null);
  useEffect(() => {
    const conversationRef = firebase
      .app()
      .database(
        'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
      )
      .ref('conversations')
      .child(props.conversationId.toString());
console.log("jeyy")
      subscribeToNewMessages(conversationRef,setMessages);
      
    return () => {
      conversationRef.off('child_added');
    };
  }, [props.conversationId.toString()]);

  
  const timestampToTimeString = (timestamp: number) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Add leading zeros to minutes if necessary
    const minute = minutes < 10 ? `0${minutes}` : minutes.toString();
    minutes = parseInt(minute, 10);

    return `${hours}:${minutes} ${amOrPm}`;
  };
  return (
    <View style={styles.windowcontainer}>

      <View style={styles.senderContainer}>
      <TouchableOpacity onPress={() => props.setChatmaximize(false)}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              color="#FDB215"
              size={_Heightrapport / 36}
            />
          </TouchableOpacity>
        <FontAwesomeIcon
          icon={faMessage}
          style={styles.squareMessagesIcon}
          size={h / 24}
        />
        <Text style={styles.calleeName}>{props.current_username} </Text>
        <TouchableOpacity onPress={() => {props.setShowChatOverlay(true);props.setChatmaximize(false)}}>
            <FontAwesomeIcon
              icon={faMinimize}
              color="#FDB215"
              size={_Heightrapport / 46}
            />
          </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={styles.flex1} behavior="height" keyboardVerticalOffset={80}>
      <View style={styles.list}>
        <FlatList
        ref={flatListRef}
          data={messages}
          renderItem={({item}) => (
            <View>
              <View
                style={
                  item.sender === props.current_username
                    ? styles.myMessage
                    : styles.otherMessage
                }>
                <Text style={styles.text}>{` ${item.text}`}</Text>
              </View>
              <Text
                style={
                  item.sender === props.current_username
                    ? styles.mydate
                    : styles.otherdate
                }>
                {timestampToTimeString(item.timestamp)}
              </Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          onContentSizeChange={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({animated: true});
            }
          }}
          onLayout={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({animated: true});
            }
          }}
        />
      </View>
      </KeyboardAvoidingView>
      <View style={styles.bottomView}>
        <TextInput
          value={inputMessage}
          onChangeText={text => setInputMessage(text)}
          placeholder="Type a message..."
          style={styles.input}
          placeholderTextColor="#000000"
          
        />
        <TouchableOpacity onPress={()=>sendMessage(inputMessage,props.current_username,props.conversationId.toString(),setInputMessage)} style={styles.button}>
          <FontAwesomeIcon
            size={h/20}
            icon={faPaperPlane}
            style={{color: '#FDB215', alignItems: 'center'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    windowcontainer: {
        height: _Heightrapport,
        width: _Widthrapport,
        flex: 1,
        backgroundColor: '#F8F8FD',
      },
      bottomView: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 2,
      },
  overlayContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: w / 1.5,
    height: h / 2,
    
    paddingBottom: 10,
    borderTopLeftRadius: h / 25,
    borderTopRightRadius: h / 25,
    elevation: 4,
    
    
  },
  flex1: {
    //flex: 1,
    paddingBottom : 10
  },

  scrollViewContent: {
    flexGrow: 1,
  },

  input: {
    height: h/14,
    borderColor: '#94cadc',
    //borderWidth: 0.5,
    borderBottomRightRadius: w/72,
    borderBottomLeftRadius: w/72,
    paddingHorizontal: w/36,
    marginVertical: 0,
    color: '#000000',
    fontFamily: 'Roboto-light',
    backgroundColor: 'white',
    fontSize: h / 46,
    width : w-w/6,
    
  },
  myMessage: {
    backgroundColor: '#e4e4e4',
    alignSelf: 'flex-end',
    paddingVertical: _Heightrapport/144,
    paddingHorizontal: _Widthrapport/36,
    borderBottomLeftRadius: _Heightrapport/72,
    marginVertical: _Heightrapport/144,
    maxWidth: '70%',
    
  },
  mydate: {
    
    alignSelf: 'flex-end',
    paddingVertical: 0,
    paddingHorizontal: _Widthrapport/36,
    borderBottomLeftRadius: _Heightrapport/72,
    marginVertical: 0,
    maxWidth: '70%',
    fontSize : _Heightrapport/72,
  },
  list: {
    paddingTop: h / 36,
    //paddingBottom: h / 72,
    paddingHorizontal: w / 36,
    //height: h -h / 4 - h/18,
    //borderBottomColor: '#FDEFC2',
   // borderBottomWidth: h / 220,
   
  },
  otherMessage: {
    backgroundColor: '#FDEFC2',
    alignSelf: 'flex-start',
    padding: _Heightrapport/72,
    
    marginVertical: _Heightrapport/144,
    maxWidth: '70%',
    borderBottomRightRadius: _Heightrapport/72,
  },
  otherdate: {
    
    alignSelf: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: _Widthrapport/36,
    borderRadius: _Heightrapport/90,
    marginVertical: 0,
    maxWidth: '70%',
    fontSize : _Heightrapport/72,
  },

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
  text: {
    color: '#212427',
    fontFamily: 'DMSans-Regular',
    fontSize: h / 40,
  },
  
  
  

  

  senderContainer: {
    width: w ,
    height: h / 12,
    backgroundColor: '#FDEFC2',
    //borderTopLeftRadius: h / 25,
   // borderTopRightRadius: h / 25,
    
    
    justifyContent: 'space-evenly',
    
    alignItems: 'center',
    flexDirection: 'row',
  },
  squareMessagesIcon: {
    color: '#FDB215',
    fontSize: h / 9,
    marginBottom: 0,
    //alignSelf: 'center',
    paddingLeft: w / 100,
  },
  calleeName: {
    marginRight : w/9,
    fontSize: h / 36,
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: 'DMSans-Regular',
  },
  timestamp :{
    fontSize: _Heightrapport/90,
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: 'DMSans-Medium',
  },
  button: {
    //alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 5,
    //marginTop: 10,
    paddingRight: 30,
  },
  Movemessages: {
    color: '#FDB215',
    fontSize: h / 9,
    marginBottom: 0,
    //alignSelf: 'center',
   alignSelf : "center",
   alignContent : 'center',
   marginTop : _Heightrapport/72,
  },
  botbuttons:{
    flexDirection: 'column',
    alignContent : 'space-between',
    alignSelf: 'center',
  }
});

export default ChatWindow;
