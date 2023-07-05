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
} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faMessage, faPaperPlane,faArrowsUpDownLeftRight} from '@fortawesome/free-solid-svg-icons';
import { _Heightrapport, _Widthrapport } from '../../../../StylingUtils';
import { sendMessage, subscribeToNewMessages } from '../../../controllers/Firebase/RealTimeDB/MessagingRTDB';
let h = _Heightrapport
let w =_Widthrapport

if(_Heightrapport>1000){
   h = _Heightrapport*0.75
   w = _Widthrapport*0.75

}


interface Props {
  conversationId: number;
  messages: any[];
  current_username?: string;
  target_token?: string;
 setIsMoving: React.Dispatch<React.SetStateAction<boolean>>
 top : number ,
 left : number ,
}

const ChatOverlay = (props: Props) => {
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
    <View style={[
      styles.overlayContainer,
      {top: props.top, left: props.left},
    ]}>

      <View style={styles.senderContainer}>
        <FontAwesomeIcon
          icon={faMessage}
          style={styles.squareMessagesIcon}
          size={h / 24}
        />
        <Text style={styles.calleeName}>{props.current_username} </Text>
      </View>
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
      <View>
        <TextInput
          value={inputMessage}
          onChangeText={text => setInputMessage(text)}
          placeholder="Type a message..."
          style={styles.input}
          placeholderTextColor="#000000"
          
        />
        <View style={styles.botbuttons}>
        <TouchableOpacity onPress={()=>sendMessage(inputMessage,props.current_username,props.conversationId.toString(),setInputMessage)} style={styles.button}>
          <FontAwesomeIcon
            size={h/18}
            icon={faPaperPlane}
            style={{color: '#FDB215', alignItems: 'center'}}
          />
        </TouchableOpacity>
        
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
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

  scrollViewContent: {
    flexGrow: 1,
  },

  input: {
    height: h/18,
    borderColor: '#94cadc',
    borderWidth: 0.5,
    borderBottomRightRadius: w/72,
    borderBottomLeftRadius: w/72,
    paddingHorizontal: w/36,
    marginVertical: 0,
    color: '#000000',
    fontFamily: 'Roboto-light',
    backgroundColor: 'white',
    fontSize: h / 50,
    
  },
  myMessage: {
    backgroundColor: '#e4e4e4',
    alignSelf: 'flex-end',
    paddingVertical: h / 144,
    paddingHorizontal: w / 36,
    borderBottomLeftRadius: h / 72,
    marginVertical: h / 144,
    maxWidth: '70%',
  },
  mydate: {
    alignSelf: 'flex-end',
    paddingVertical: 0,
    paddingHorizontal: w / 36,
    borderBottomLeftRadius: h / 72,
    marginVertical: 0,
    maxWidth: '70%',
    fontSize: h / 72,
  },
  list: {
    paddingTop: h / 36,
    paddingBottom: h / 72,
    paddingHorizontal: w / 36,
    height: h / 2-h / 12,
    borderBottomColor: '#FDEFC2',
    borderBottomWidth: h / 220,
  },
  otherMessage: {
    backgroundColor: '#FDEFC2',
    alignSelf: 'flex-start',
    padding: h / 72,

    marginVertical: h / 144,
    maxWidth: '70%',
    borderBottomRightRadius: h / 72,
  },
  otherdate: {
    alignSelf: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: w / 36,
    borderRadius: h / 90,
    marginVertical: 0,
    maxWidth: '70%',
    fontSize: h / 72,
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
    fontSize: h / 45,
  },
  
  
  

  

  senderContainer: {
    width: w / 1.5,
    height: h / 12,
    backgroundColor: '#FDEFC2',
    borderTopLeftRadius: h / 25,
    borderTopRightRadius: h / 25,
    
    
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
  timestamp: {
    fontSize: h / 90,
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: 'DMSans-Medium',
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 5,
    marginTop: 10,
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

export default ChatOverlay;
