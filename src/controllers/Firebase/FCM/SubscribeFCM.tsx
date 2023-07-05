import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { get_Username_fromtoken } from '../Firestore/FirebaseQuery';

export const requestNotificationPermission = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      console.log('Device Token:', token);
    } catch (error: any) {
      console.error(
        'Failed to request notification permission:',
        error.message,
      );
    }
  };
// export const unsubscribeBackground =  messaging().setBackgroundMessageHandler(
//     async remoteMessage => {
//       console.log('Received background notification:', remoteMessage);
//     },
//   );
  export const unsubscribeBackground = (
    targett: React.MutableRefObject<string | undefined>,
    id :React.MutableRefObject<string>,
    targettusername: React.MutableRefObject<string | undefined>,

  ) => {
    const onMessageHandler = async (remoteMessage: any) => {
      console.log('Received background notification:', remoteMessage);
      const { data } = remoteMessage;
  
      console.log('yababa');
      if (remoteMessage.data?.type === 'inCall') {
        console.log('yaa');
      } else {
        const targettoken = remoteMessage.data?.targettoken;
        const convID = remoteMessage.data?.ConversationID;
        //settargettoken(targettoken);
        targett.current = targettoken;
        const targetusernamee =  await get_Username_fromtoken(targett.current);
        id.current =convID;
        targettusername.current=targetusernamee;
        console.log('Sender Token:', targettoken);
      }
      // Handle the incoming notification in your app
    };
  
    messaging().setBackgroundMessageHandler(onMessageHandler);
  
    return () => {
      messaging().setBackgroundMessageHandler(onMessageHandler); 
    };
  };

  export const unsubscribeForeground = (
    targett: React.MutableRefObject<string | undefined>,
    id :React.MutableRefObject<string>,
    targettusername: React.MutableRefObject<string | undefined>,

  ) => {
    const onMessageHandler = async (remoteMessage: any) => {
      console.log('Received foreground notification:', remoteMessage);
      const { data } = remoteMessage;
  
      console.log('yababa');
      if (remoteMessage.data?.type === 'inCall') {
        console.log('yaa');
      } else {
        const targettoken = remoteMessage.data?.targettoken;
        const convID = remoteMessage.data?.ConversationID;
        //settargettoken(targettoken);
        targett.current = targettoken;
        const targetusernamee =  await get_Username_fromtoken(targett.current);
        id.current =convID;
        targettusername.current=targetusernamee;
        console.log('Sender Token:', targettoken);
      }
     
    };
  
    messaging().onMessage(onMessageHandler);
  
    return () => {
      messaging().onMessage(onMessageHandler); 
    };
  };
  
    
