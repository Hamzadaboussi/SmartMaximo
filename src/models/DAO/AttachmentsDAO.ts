import { FirebaseDatabaseTypes, firebase } from '@react-native-firebase/database';


export class AttachmentsDAO {
    private conversationId : string
  
    constructor(conversationId : string ){
    this.conversationId = conversationId;  
  }
  
  
  async Read_Attachments(
    Attachments: React.MutableRefObject<any[] | undefined>
  ) { 
    const conversationRef = firebase
        .app()
        .database(
          'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref('Attachements')
        .child(this.conversationId);
        
          await conversationRef.once('value', snapshot => {
            const conversationData = snapshot.val();
            if (conversationData) {
              
              const AttachementsList = Object.values(conversationData)  ;
              Attachments.current = AttachementsList  ;
            }
            else {
              
            }
          });
  }
  
  async Create_Attachments (
    Attachment : any
  ){
    
    const conversationRef = firebase
        .app()
        .database(
          'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
        )
        .ref('Attachements')
        .child(this.conversationId.toString());
      const newReference = conversationRef.push();
      console.error(this.conversationId);
      newReference.set(Attachment).then(() => console.log('saved in realtimeDB'));
  }

}
