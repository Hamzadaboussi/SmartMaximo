import firestore,{FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { firebase } from '@react-native-firebase/database';
import { Calllog } from '../../../models/Entities/Calllog';
import { CallerRecord } from '../../../models/Entities/VideoRecords';
import { RecordsDAO } from '../../../models/DAO/RecordsDAO';
import { VideoSessionDAO } from '../../../models/DAO/VideoSession';

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

export  async function get_SessionId ()  : Promise<string>{
  const token = await messaging().getToken();
  const usersRef = firestore().collection('users')
  const queryRef = await usersRef.where('deviceToken', '==', token).get();
  //console.log("this is queryRef",queryRef);
let sessionId =''
  if (queryRef.empty) {
      console.log('No matching documents.');
      return "";
    }  
  queryRef.forEach(doc => {
      //console.log(doc.id, '=>', doc.data());
      //console.log("dodod",doc.data().username.toString())
      sessionId =doc.data().sessionId.toString()
      
    });
    return ( sessionId.toString());
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
export async function CreateChat_firestore(sender : string , reciever : string,id : React.MutableRefObject<string>) {
  const currentDate = new Date();
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formattedDate = `${weekdays[currentDate.getDay()]}, ${currentDate.getDate()} ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const randomNumber = Math.floor(Math.random() * (10000000000 )) ;

    const Session = new VideoSessionDAO(randomNumber);
    await Session.Create_VideoSession(sender,reciever,formattedDate)
    
    id.current= randomNumber.toString()
  
}

export async function getConversation_Id (receiver : string |undefined , sender : string , role : string) : Promise<string>{
  console.log("-- reciever",receiver,"---sender",sender);
    const chatRef = firestore().collection('Chat');
    const queryRef = await chatRef
  .where('Sender', '==', sender)
  .where('Reciever', '==', receiver)
  .orderBy('date', 'desc') 
  .limit(1) 
  .get();
    let id ="";
    let temp =0;
    if (queryRef.empty) {
        console.log('No matching documents.');
        return "";
      }  
    queryRef.forEach(doc => {
        //console.log(doc.id, '=>', doc.data());
        //console.log("dodod",doc.data().ConversationId.toString())
         id =doc.data().ConversationId.toString()
         temp = doc.data().date;
         console.log("bababab" , id);
        
      });
  //     const queryRef1 = await chatRef
  // .where('Sender', '==', receiver)
  // .where('Reciever', '==',  sender)
  // .orderBy('date', 'desc') 
  // .limit(1) 
  // .get();
  //   let id1 ="";
  //   let temp1 =0;
    
  //   if (queryRef1.empty) {
  //       console.log('No matching documents.');
  //       return "";
  //     }  
  //   queryRef1.forEach(doc => {
  //       //console.log(doc.id, '=>', doc.data());
  //       //console.log("dodod",doc.data().ConversationId.toString())
  //        id1 =doc.data().ConversationId.toString();
  //        temp1 = doc.data().date;
  //        console.log("bababab1" , id1);
        
  //     });
      //if(role =="caller"){
        console.log("this is conv id",id)
        return id.toString();
        
      // }
      // else {
      //   console.log("this is conv id",id1)
      //   return id1.toString();
        
      // }
      

    
}
export async function Addrecords (
  id :string | undefined,
  url : string ,
  role : string,
  duaration : string ,
  ) {

    const recordData = {
      videoLink: url,
      Duration : duaration,
    };
    console.log(id)
const record = new RecordsDAO(id?parseInt(id):0)
await record.Create_Record(recordData,role);


}

export async function getCallLogs(username: string, Calllogs: React.MutableRefObject<Calllog[] | undefined>) {
  const Session = new VideoSessionDAO(20);
  await Session.Read_Attachments(username,Calllogs);
}



export async function GetRecords(
  conversationId: string,
  records: React.MutableRefObject<any[]>
) {
  const record = new RecordsDAO(parseInt(conversationId))
  await record.Read_Record(records)
}
