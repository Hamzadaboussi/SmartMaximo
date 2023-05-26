import { Platform } from 'react-native';
import AudioRecorderPlayer, { AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType, OutputFormatAndroidType, RecordBackType } from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';



export const path = Platform.select({
    ios: undefined,
    android:  `${RNFS.ExternalStorageDirectoryPath}/Music/myaudio.mp3`,
  });

  const audioRecorderPlayer = new AudioRecorderPlayer();
  audioRecorderPlayer.setSubscriptionDuration(0.1);

export const onStartRecord = async (
    
) => {
    
    const audioSet: AudioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
    };

    console.log('audioSet', audioSet);

    const uril = await audioRecorderPlayer.startRecorder(path, audioSet);

    
    console.log(`uriiii: ${uril}`);
  };

 export const onStopRecord = async (
    
    setRecordSecs:React.Dispatch<React.SetStateAction<number>>
  ) => {
    const result = await audioRecorderPlayer.stopRecorder();
    
    setRecordSecs(0);
    console.log("this is result",result);
  };