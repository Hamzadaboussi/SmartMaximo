 import { NativeModules } from 'react-native';

 const { ScreenshotModule } = NativeModules;

// ScreenshotModule.captureScreen()
//   .then((imagePath : any) => {
//     console.log('Screenshot captured:', imagePath);
//   })
//   .catch((error : any) => {
//     console.error('Failed to capture screenshot:', error);
//   });


const captureScreen = async (path : string) => {
   
      await ScreenshotModule.captureScreen(path);
    
  };
export const handleScreenCapture = async () => {
    const path = '/storage/emulated/0/Android/data/com.stage/files/ReactNativeRecordScreen/HD2023-06-06-16-03-53.png';
    await captureScreen(path);
    // Process or use the captured screenshot as needed
  };