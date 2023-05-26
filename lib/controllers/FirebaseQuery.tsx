import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

export  async function get_CurrentUsername ()  : Promise<string>{
    const token = await messaging().getToken();
    const usersRef = firestore().collection('users')
    const queryRef = await usersRef.where('deviceToken', '==', token).get();
    //console.log("this is queryRef",queryRef);
let user =''
    if (queryRef.empty) {
        console.log('No matching documents.');
        return "";
      }  
    queryRef.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        //console.log("dodod",doc.data().username.toString())
         user =doc.data().username.toString()
        
      });
      return ( user.toString());
}
export  async function get_Username_fromtoken (
    token? : string
)  : Promise<string>{
    const usersRef = firestore().collection('users')
    const queryRef = await usersRef.where('deviceToken', '==', token).get();
    console.log("this is queryRef",queryRef);
let user =''
    if (queryRef.empty) {
        console.log('No matching documents.');
        return "";
      }  
    queryRef.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        //console.log("dodod",doc.data().username.toString())
         user =doc.data().username.toString()
        
      });
      return ( user.toString());
}
export async function CreateChat_firestore(sender : string , reciever : string) {

    const chatRef = firestore().collection('Chat');
    const randomNumber = Math.floor(Math.random() * (10000000000 )) ;
    await chatRef.add({
        Sender: sender,
        Reciever: reciever,
        ConversationId : randomNumber,
        date : Date.now()
      });
  
}

export async function getConversation_Id (receiver : string |undefined , sender : string) : Promise<string>{
    const chatRef = firestore().collection('Chat');
    const queryRef = await chatRef
  .where('Sender', 'in', [sender, receiver])
  .where('Reciever', 'in', [sender, receiver])
  .get();
    let id ="";
    
    if (queryRef.empty) {
        console.log('No matching documents.');
        return "";
      }  
    queryRef.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        //console.log("dodod",doc.data().ConversationId.toString())
         id =doc.data().ConversationId.toString()
         //console.log("bababab" , id);
        
      });
      return id.toString();

    
}