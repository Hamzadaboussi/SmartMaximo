import { FirebaseDatabaseTypes, firebase } from '@react-native-firebase/database';


export class MessagesDAO {
    private conversationId : string
  
    constructor(conversationId : string ){
    this.conversationId = conversationId;  
  }
  
  
  async Read_Messages(
    messages: React.MutableRefObject<any[] | undefined>
  ) { 
    console.log("ici")
    const conversationRef = firebase
        .app()
        .database(
          'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref('conversations')
        .child(this.conversationId);
        
          await conversationRef.once('value', snapshot => {
            const conversationData = snapshot.val();
            if (conversationData) {
              
              const messageList = Object.values(conversationData)  ;
              messages.current = messageList  ;
            }
            else {
              
            }
          });
  }
  
  async Create_Message (
    message : any
  ){
    
    const conversationRef = firebase
        .app()
        .database(
          'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref('conversations')
        .child(this.conversationId);
      const newReference = conversationRef.push();
      //console.error(props.conversationId);
      newReference.set(message)
  }

}
