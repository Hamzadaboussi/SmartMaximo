
import { FirebaseDatabaseTypes, firebase } from '@react-native-firebase/database';
import { MessagesDAO } from '../../../models/DAO/MessagesDAO';

export async function  GetMessages (
    ConversationId : string,
    messages: React.MutableRefObject<any[] | undefined>
  ){
    const messagesDAO = new MessagesDAO(ConversationId)
    await messagesDAO.Read_Messages(messages)   
  } 

export const subscribeToNewMessages = (
  conversationRef: FirebaseDatabaseTypes.Reference,
    setMessages: (value: React.SetStateAction<any[]>) => void    
    ) => {    
    conversationRef.on('child_added', snapshot => {
      console.log('hedhyheya')
      const newMessage = snapshot.val();
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });
  };

 export const sendMessage = (
    inputMessage : string,
    username : string | undefined,
    conversationId : string,
    setInputMessage: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const message = {
      text: inputMessage,
      sender: username,
      timestamp: Date.now(),
    };
    const messages = new MessagesDAO(conversationId);
    if (inputMessage.trim() !== '') {
      messages.Create_Message(message)

      setInputMessage('')
    }
  };