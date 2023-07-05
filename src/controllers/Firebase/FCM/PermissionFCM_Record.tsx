import axios from "axios";
import { Alert } from "react-native";

export const sendNotification_Record = async (key : string , request? : string , responce? : string ) => {
    const serverKey = 'AAAAPAWvWSM:APA91bGJ4wGYlLUjY1L2eLh2Bf8EKlBXFlToji78sNGC_0w-uI6y-FPelGSJ0pEKSuFXOInwynyMtRWh3gd7fTbl6n0Lvd4xaotQn1QilmJT3U3w_vGtjJTsq5-CWfpScsQbLEw2SbU1';
    const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';
  
    const notificationData = {
      to: key,
      notification: {
        title: ' The person that youre calling is trying to record ',
        body: 'approuve it ',
      },
      data: {
        Responce: responce,
        Request: request,
        type: "inCall"
      },
    };
  
    try {
      const response = await axios.post(fcmEndpoint, notificationData, {
        headers: {
          'Authorization': `Bearer ${serverKey}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Notification sent successfully:', response.data);
    } catch (error:any) {
      console.error('Failed to send notification:', error.message);
    }
  };

  export const showConfirmationDialogPermisson_Record = (
    targettoken : string,

  ) => {
    
    Alert.alert(
      'Recording Request',
      'Do you want that the callee recorde the video call?',
      [
        {
          text: 'Deny',
          onPress: () => {
            //setpeerpermission(true)
            console.error(targettoken)
            sendNotification_Record(targettoken, "" ,"no"  );
          },
          style: 'cancel',
        },
        {
          text: 'Accept',
          onPress: () => {
            
            sendNotification_Record(targettoken, "" ,"yes"  );
          
          },
        },
      ],
      { cancelable: false }
      );
    };