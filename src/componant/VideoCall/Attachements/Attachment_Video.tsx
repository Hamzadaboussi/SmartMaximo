import {
  faArrowLeft,
  faMessage,
  faClapperboard,
  faImage,
  faLock,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Button,
  Modal,
  Dimensions,
  Image,
} from 'react-native';
import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import { faCircleXmark} from '@fortawesome/free-solid-svg-icons';
import * as Animatable from 'react-native-animatable';
import {_Heightrapport, _Widthrapport} from '../../../../StylingUtils';
import {
  RefrechAttachment_Button,
  SendImageAttachment_Button,
  SendPdfAttachment_Button,
} from './Attachment_Buttons';
import ImagePicker, {
  launchImageLibrary,
  ImagePickerResponse,
  MediaType,
} from 'react-native-image-picker';
import {
  
  handleChooseImage,
  handleChoosePDF,
} from '../../../controllers/VideoAssisstance/AttachmentController';
import {firebase} from '@react-native-firebase/database';
import ImageView from 'react-native-image-viewing';
import PDFView from 'react-native-view-pdf';
import { subscribeToNewAttachements } from '../../../controllers/Firebase/RealTimeDB/AttachementsRTDB';



interface Props {
  Attachments: any[];
  setShowAttachments: React.Dispatch<React.SetStateAction<boolean>>;
  ConversationId: string;
  imagesRef: FirebaseStorageTypes.Reference;
}

const Attachment_Video = (props: Props) => {
  const [Attachements, SetAttachements] = useState<any[]>(props.Attachments);
  const [isImageViewVisible, setImageViewVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isPdfViewerVisible, setPdfViewerVisible] = useState(false);
  useEffect(() => {
    const AttachmentsRef = firebase
      .app()
      .database(
        'https://videoassistance-aea92-default-rtdb.europe-west1.firebasedatabase.app/',
      )
      .ref('Attachements')
      .child(props.ConversationId.toString());

    

    subscribeToNewAttachements(AttachmentsRef,SetAttachements);

    return () => {
      AttachmentsRef.off('child_added');
    };
  }, [props.ConversationId.toString()]);

  // const attachmentsArray = Object.entries(props.Attachments).map(([index, value]) => ({
  //   index: parseInt(index, 10),
  //   value,
  // }));

  const closeImageViewer = () => {
    setImageViewVisible(false);
  };
  const openPdfViewer = () => {
    setPdfViewerVisible(true);
  };
  const _handelSendImage = () => {
    handleChooseImage(props.ConversationId ? props.ConversationId : '123');
  };
  const _handelRefresh = () => {
    //getDownloadURLs(props.imagesRef,props.setAttachments)
  };
  const _handelSendPdf = () => {
    handleChoosePDF(props.ConversationId ? props.ConversationId : '123');
  };
  const renderItem = ({item}: any) => {
    //console.log('bdee yerander');
    //getDownloadURLs(props.imagesRef,props.setAttachments)
    const isPDF = item.FileName.toLowerCase().endsWith('.pdf');
    const openImageViewer = () => {
      // Determine the index of the selected image in Attachements array
      console.log('houny');
      const index = Attachements.findIndex(
        attachment => attachment.FileName === item.FileName,
      );
      setSelectedImageIndex(index);
      setImageViewVisible(true);
    };

    if (isPDF) {
      return (
        <View>
          <TouchableOpacity onPress={openPdfViewer}>
            <View style={styles.pdfContainer}>
              <View style={styles.pdftag}>
                <Text style={styles.pdftagtext}>PDF</Text>
              </View>
              <FontAwesomeIcon
                size={_Heightrapport / 14}
                icon={faPaperclip}
                style={{
                  color: '#FFF',
                  alignItems: 'center',
                  paddingTop: _Heightrapport / 4.8 - _Heightrapport / 40,
                }}
              />
              <Text style={styles.pdftext}>Name : </Text>

              <Text style={styles.pdftext}>{item.FileName}</Text>
            </View>
          </TouchableOpacity>
          {isPdfViewerVisible && (
            <Modal
              visible={isPdfViewerVisible}
              onRequestClose={() => setPdfViewerVisible(false)}>
              <PDFView
                fadeInDuration={250.0}
                style={{flex: 1}}
                resource={item.Uri} // Update with the correct URI of the PDF file
              />
              <TouchableOpacity
        style={styles.icon}
        onPress={() => {
          setPdfViewerVisible(false)
        }}>
        <Animatable.View
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
      >
        
        <FontAwesomeIcon icon={faCircleXmark} color='red' size={Dimensions.get('window').height/20}   />
        </Animatable.View>
        </TouchableOpacity>
        
            </Modal>
          )}
        </View>
      );
    } else {
      // Render image item
      return (
        <View>
          <TouchableOpacity onPress={openImageViewer}>
            <Image source={{uri: item.Uri}} style={styles.image} />
          </TouchableOpacity>
          <ImageView
            images={Attachements.map(attachment => ({uri: attachment.Uri}))}
            imageIndex={selectedImageIndex}
            visible={isImageViewVisible}
            onRequestClose={closeImageViewer}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.AttachmentIcon}>
          <TouchableOpacity onPress={() => props.setShowAttachments(false)}>
            <FontAwesomeIcon
              icon={faArrowLeft}
              color="white"
              size={_Heightrapport / 36}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.title}>
          <Text style={styles.text}>Attachments</Text>
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.container1}>
          <FlatList
            data={Attachements}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.uri}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </View>
      <View style={styles.footer}>
        {/* <View style={styles.footersubtitle}>
          <RefrechAttachment_Button Send={_handelRefresh} />
        </View> */}
        <View style={styles.sendIcons}>
          <SendImageAttachment_Button Send={_handelSendImage} />
          <SendPdfAttachment_Button Send={_handelSendPdf} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: _Heightrapport,
    width: _Widthrapport,
    flex: 1,
    backgroundColor: '#F8F8FD',
  },
  header: {
    width: _Widthrapport,
    height: _Heightrapport / 10,
    backgroundColor: '#5F56EE',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
  },
  AttachmentIcon: {
    paddingLeft: _Widthrapport / 10,
    paddingRight: _Widthrapport / 10,
  },
  text: {
    fontSize: _Heightrapport / 30,
    fontFamily: 'DMSans-Medium',
    color: 'white',
  },
  title: {
    paddingLeft: _Widthrapport / 24,
  },
  body: {
    marginHorizontal: _Widthrapport / 24,
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    top: _Heightrapport < 1000 ? _Heightrapport * 0.9 : _Heightrapport * 0.83,
    //right : _Widthrapport/20,
    height: _Heightrapport / 10,
    width: _Widthrapport,
    //backgroundColor : 'red',

    flexDirection: 'row',
    alignItems: 'center',
  },
  footersubtitle: {
    paddingLeft: _Widthrapport / 12,

    bottom: 20,
  },
  footertext: {
    fontSize: _Heightrapport / 40,
    fontFamily: 'DMSans-Medium',
    color: '#5F56EE',
  },
  sendIcons: {
    //paddingRight: _Widthrapport / 12,
    flexDirection: 'row',
    position: 'absolute',

    right: 10,
    bottom: 20,

    alignContent: 'space-around',
  },
  container1: {
    //flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    marginTop: 20,
    marginBottom: 20,
    paddingBottom: 10,
    height: _Heightrapport / 1.4,
    //borderWidth: _Heightrapport/720,
    borderColor: '#DAD4FF',
  },
  listContainer: {},
  image: {
    width: Dimensions.get('window').width / 2.5,
    height: Dimensions.get('window').width / 1.8,
    margin: 10,
    borderRadius: _Heightrapport / 72,
  },
  pdfContainer: {
    width: Dimensions.get('window').width / 2.5,
    height: Dimensions.get('window').width / 1.8,
    backgroundColor: '#5F56EE',
    margin: 10,
    borderRadius: _Heightrapport / 72,
    alignItems: 'center',
    alignContent: 'center',
    verticalAlign: 'center',
    flexDirection: 'column',
  },
  pdftext: {
    fontSize: _Heightrapport / 60,
    fontFamily: 'DMSans-Medium',
    color: 'white',
    paddingTop: _Heightrapport / 200,
    paddingHorizontal: _Widthrapport / 72,
    textAlign : 'center',
  },
  pdftag: {
    position: 'absolute',
    top: '5%',
    left: '5%',
  },
  pdftagtext: {
    fontSize: _Heightrapport / 60,
    fontFamily: 'DMSans-Bold',
    color: 'white',
    textAlign: 'center',
    alignSelf: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  icon : {
    position :'absolute',
    top : Dimensions.get('window').height/20,
    right : Dimensions.get('window').width/20,
    width : Dimensions.get('window').width/10,
    height : Dimensions.get('window').height/20
    
        },
});

export default Attachment_Video;
