import { FirebaseDatabaseTypes, firebase } from '@react-native-firebase/database';

import firestore, {
    FirebaseFirestoreTypes,
  } from '@react-native-firebase/firestore';
import { Calllog } from '../Entities/Calllog';

export class VideoSessionDAO {
    private conversationId : number
  
    constructor(conversationId : number ){
    this.conversationId = conversationId;  
  }
  
  
  async Read_Attachments(
    username: string, Calllogs: React.MutableRefObject<Calllog[] | undefined>
  ) { 
    const chatData: Calllog[] = []; 

  const chatRef = firestore().collection('Chat');
  const querySnapshot = await chatRef
    .where('Sender', '==', username)
    .orderBy('date', 'asc')
    .orderBy('time', 'asc')
    .get();

  if (querySnapshot.empty) {
    console.log('No matching documents.');
    return []; // Return an empty array if no documents are found
  }

  querySnapshot.forEach((doc) => {
    console.log(doc.data());
    chatData.push(doc.data() as Calllog); // Push the document data to chatData array
  });

  Calllogs.current = chatData;
  }
  


  async Create_VideoSession (
    sender : string , reciever : string,formattedDate: string

  ){
    
    const chatRef = firestore().collection('Chat');
    
    await chatRef.add({
        Sender: sender,
        Reciever: reciever,
        ConversationId : this.conversationId,
        time : Date.now(),
        date : formattedDate,

      });

}}
