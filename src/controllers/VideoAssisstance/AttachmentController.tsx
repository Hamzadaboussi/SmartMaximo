import {FirebaseStorageTypes} from '@react-native-firebase/storage';
import ImagePicker, { launchImageLibrary,ImagePickerResponse,MediaType  } from 'react-native-image-picker';
import storage  from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import DocumentPicker, { DocumentPickerResponse, isCancel, types } from 'react-native-document-picker';
import {firebase} from '@react-native-firebase/database';
import { Alert } from 'react-native';
import { RDB_Send_Attachment } from '../Firebase/RealTimeDB/AttachementsRTDB';
import { uploadImage, uploadPDF } from '../Firebase/Storage/AttachementsStorage';

export const getFixedUri = async (uri: string): Promise<string> => {
  if (uri.startsWith('content://')) {
      const destPath = `${RNFS.TemporaryDirectoryPath}/tempVideo`;
      await RNFS.copyFile(uri, destPath);
      return destPath;
  }
  return uri;
};

export const handleChoosePDF =async (ConversationId: string) => {
  DocumentPicker.pickSingle({
    type: [DocumentPicker.types.pdf],
  })
    .then((response: any) => {
      if (!response.didCancel && response.uri) {
        console.log(response.uri)
        uploadPDF(response.uri, ConversationId);
      } else {
        console.log('PDF selection cancelled');
      }
    })
    .catch((error) => {
      console.error('DocumentPicker Error:', error);
    });
};








export const handleChooseImage = (
   ConversationId : string
) => {
  const options = {
    mediaType: 'photo' as MediaType,
    maxWidth: 2000,
    maxHeight: 2000,
  };

 launchImageLibrary(options, (response: ImagePickerResponse | undefined) => {
    if (response && !response.didCancel && !response.errorCode && response.assets && response.assets.length > 0) {
      const selectedImage = response.assets[0];
      if (selectedImage.uri) {
        uploadImage(selectedImage.uri,ConversationId);
      } else {
        console.log('Selected image URI is undefined');
      }
    } else {
      console.log('Image selection cancelled or an error occurred.');
    }
  });
};


