import { FirebaseDatabaseTypes } from "@react-native-firebase/database";
import {firebase} from '@react-native-firebase/database';
import { AttachmentsDAO } from "../../../models/DAO/AttachmentsDAO";



export const subscribeToNewAttachements = (
    AttachmentsRef: FirebaseDatabaseTypes.Reference,
    SetAttachements: React.Dispatch<React.SetStateAction<any[]>>
) => {
    AttachmentsRef.on('child_added', snapshot => {
      const newAttachement = snapshot.val();
      SetAttachements(prevAttachment => [...prevAttachment, newAttachement]);
    });
  };

 export const RDB_Send_Attachment = (
    uri : string , 
    Filename : string , 
    sender : string , 
    conversationId : string,
  ) => {
   
      const Attach = {
        Uri: uri,
        sender: sender,
        FileName : Filename,
        timestamp: Date.now(),
      };
  
      const attachments = new AttachmentsDAO(conversationId)
      attachments.Create_Attachments(Attach)
    
  };

  export async function  GetAttachements (
    ConversationId : string,
    Attachments: React.MutableRefObject<any[] | undefined>
  ){
    
    const attachment = new AttachmentsDAO(ConversationId)
    attachment.Read_Attachments(Attachments)
  } 