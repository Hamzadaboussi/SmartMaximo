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
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';

interface Props {
  conversationId: number;
  messages: any[];
  current_username?: string;
  target_token?: string;
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

    const subscribeToNewMessages = () => {
      conversationRef.on('child_added', snapshot => {
        const newMessage = snapshot.val();
        setMessages(prevMessages => [...prevMessages, newMessage]);
      });
    };

    subscribeToNewMessages();

    return () => {
      conversationRef.off('child_added');
    };
  }, [props.conversationId.toString()]);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const message = {
        text: inputMessage,
        sender: props.current_username,
        timestamp: Date.now(),
      };

      const conversationRef = firebase
        .app()
        .database(
          'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref('conversations')
        .child(props.conversationId.toString());
      const newReference = conversationRef.push();
      console.error(props.conversationId);
      newReference.set(message).then(() => setInputMessage(''));
    }
  };

  return (
    <View style={styles.overlayContainer}>
      <View style={styles.list}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({item}) => (
            <View
              style={
                item.sender === props.current_username
                  ? styles.myMessage
                  : styles.otherMessage
              }>
              <Text style={styles.text}>{` ${item.text}`}</Text>
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
      <View >
      <TextInput
        value={inputMessage}
        onChangeText={text => setInputMessage(text)}
        placeholder="Type a message..."
        style={styles.input}
        placeholderTextColor="#000000"
      />
      <TouchableOpacity onPress={sendMessage} style={styles.button}>
        <FontAwesomeIcon
          size={40}
          icon={faPaperPlane}
          style={{color: '#3792cb', alignItems: 'center'}}
        />
      </TouchableOpacity>
    </View>
    </View>
  );
};
const styles = StyleSheet.create({
  overlayContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    width: Dimensions.get('window').width / 1.5,
    height: Dimensions.get('window').height / 3,
    bottom: Dimensions.get('window').width / 2,
    left: Dimensions.get('window').width / 4,
    paddingBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
  },
  
  scrollViewContent: {
    flexGrow: 1,
  },
  text: {
    color: '#212427',
    fontFamily: 'Roboto-light',
  },
  input: {
    height: 40,
    borderColor: '#94cadc',
    borderWidth: 0.5,
    borderBottomRightRadius : 5,
    borderBottomLeftRadius : 5,
    paddingHorizontal: 10,
    marginVertical: 0,
    color: '#000000',
    fontFamily: 'Roboto-light',
    backgroundColor: 'white',
  },
  headerContainer: {
    backgroundColor: 'lightblue',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 5,
  },
  usernameBar: {
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  usernameText: {
    fontWeight: 'bold',
    color: 'black',
  },
  myMessage: {
    backgroundColor: '#e4e4e4',
    alignSelf: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
  },
  otherMessage: {
    backgroundColor: '#94cadc',
    alignSelf: 'flex-start',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    maxWidth: '70%',
  },
  list: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    height : Dimensions.get('window').height / 3,
  },
  button: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius : 10,
    borderColor : "white",
    borderWidth: 5,
    marginTop : 10 ,
  },
});

export default ChatOverlay;
