import { mediaDevices } from 'react-native-webrtc';

interface SourceInfo {
    deviceId: string;
    facing: string;
    kind: string;
    label: string;
  }
  
  export default class Utils {
      static async getStream() {
          let isFront = true;
          const sourceInfos: SourceInfo[] = await mediaDevices.enumerateDevices() as SourceInfo[];

          console.log(sourceInfos);
          let VideoSourceId;
          for (let i = 0; i < sourceInfos.length; i++) {
              const sourceInfo = sourceInfos[i];
              if (
                  sourceInfo.kind == 'videoinput' &&
                  sourceInfo.facing == (isFront ? 'front' : 'environment')
              ) {
                  VideoSourceId = sourceInfo.deviceId;
              }
          }
          const stream = await mediaDevices.getUserMedia({
              audio: true,
              video: {
                  width: 640,
                  height: 480,
                  frameRte: 30,
                  facingMode: isFront ? 'user' : 'environment',
                  deviceId: VideoSourceId,
              },
          });
          if (typeof stream != 'boolean') return stream;
          return null;
      }
  }
  