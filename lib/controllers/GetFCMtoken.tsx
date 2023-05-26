import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

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
export const unsubscribeBackground =  messaging().setBackgroundMessageHandler(
    async remoteMessage => {
      console.log('Received background notification:', remoteMessage);
      // Handle the incoming notification in the background
    },
  );


  export const unsubscribeForeground = (
    settargettoken: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    const onMessageHandler = async (remoteMessage: any) => {
      console.log('Received foreground notification:', remoteMessage);
      const { data } = remoteMessage;
  
      console.log('yababa');
      if (remoteMessage.data?.type === 'inCall') {
        console.log('yaa');
      } else {
        const targettoken = remoteMessage.data?.targettoken;
        settargettoken(targettoken);
  
        console.log('Sender Token:', targettoken);
      }
      // Handle the incoming notification in your app
    };
  
    messaging().onMessage(onMessageHandler);
  
    return () => {
      messaging().onMessage(onMessageHandler); // Add this line to remove the event listener
    };
  };
  
    
