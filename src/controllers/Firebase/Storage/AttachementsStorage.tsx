import storage  from '@react-native-firebase/storage';
import { getFixedUri } from '../../VideoAssisstance/AttachmentController';
import { RDB_Send_Attachment } from '../RealTimeDB/AttachementsRTDB';

import {FirebaseStorageTypes} from '@react-native-firebase/storage';



export const uploadPDF = async (pdfUri: string, ConversationId: string) => {
    const fileName = pdfUri.substring(pdfUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref().child(`Attachments/${ConversationId}/${fileName}.pdf`);
    const uri = await getFixedUri(pdfUri)
    const task = storageRef.putFile(uri);
  
    task
      .then(async() => {
        console.log('PDF uploaded successfully');
        const downloadURL = await storageRef.getDownloadURL();
        const fileName =  storageRef.name;
        console.log('Download URL:', downloadURL);
        console.log('File Name:', fileName);
        RDB_Send_Attachment(downloadURL,fileName,"",ConversationId)
      })
      .catch((error) => {
        console.error('Error uploading PDF:', error);
        // Handle error scenarios
      });
  };

export const uploadImage = (imageUri : string , ConversationId : string) => {
    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref().child(`Attachments/${ConversationId}/`+fileName);
  
    //const storageRef = storage().ref().child('images/' + fileName);
    const task = storageRef.putFile(imageUri);
  
    task
      .then(async () => {
        console.log('Image uploaded successfully');
        const downloadURL = await storageRef.getDownloadURL();
        const fileName =  storageRef.name;
        console.log('Download URL:', downloadURL);
        console.log('File Name:', fileName);
        RDB_Send_Attachment(downloadURL,fileName,"",ConversationId)
  
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        
        
      });
  };

  export const getDownloadURLs = (
    imagesRef: FirebaseStorageTypes.Reference,
    setAttachments: React.Dispatch<React.SetStateAction<Record<number, { url: string; fileName: string; }>>>,
  ) => {
    let newImageUrls: { url: string; fileName: string }[] = []; // Store URL and fileName
    imagesRef
      .listAll()
      .then(result => {
        const promises = result.items.map(itemRef =>
          itemRef
            .getDownloadURL()
            .then(url => {
              const fileName = itemRef.name; 
              newImageUrls.push({ url, fileName }); 
            })
            .catch(error => {
              console.error('Error getting download URL:', error);
            })
        );
  
        Promise.all(promises)
          .then(() => {
            const AttachmentsUrls: Record<number, { url: string; fileName: string }> = {}; // Update type to include fileName
            newImageUrls.forEach((data, index) => {
              AttachmentsUrls[index] = { url: data.url, fileName: data.fileName }; // Include fileName in AttachmentsUrls
              console.log('File Name:', data.fileName); 
            });
  
            console.log('Image URLs:', AttachmentsUrls);
            setAttachments(AttachmentsUrls);
          })
          .catch(error => {
            console.error('Error fetching images:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching images:', error);
      });
  };
  