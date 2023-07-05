import axios from "axios";

export const sendNotificationToJoin = async (key : string , name : string,token : string , id :React.MutableRefObject<string>) => {
    const serverKey = 'AAAAPAWvWSM:APA91bGJ4wGYlLUjY1L2eLh2Bf8EKlBXFlToji78sNGC_0w-uI6y-FPelGSJ0pEKSuFXOInwynyMtRWh3gd7fTbl6n0Lvd4xaotQn1QilmJT3U3w_vGtjJTsq5-CWfpScsQbLEw2SbU1';
    const fcmEndpoint = 'https://fcm.googleapis.com/fcm/send';
  
    const notificationData = {
      to: key,
      notification: {
        title: name+' is trying to reach you ',
        body: 'Click here to Answer',
      },
      data: {
        targettoken: token ,
        ConversationID: id.current,
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
