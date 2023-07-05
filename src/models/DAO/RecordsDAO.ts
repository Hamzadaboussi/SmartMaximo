import {FirebaseDatabaseTypes, firebase} from '@react-native-firebase/database';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { CallerRecord } from '../Entities/VideoRecords';

export class RecordsDAO {
  private conversationId: number;

  constructor(conversationId: number) {
    this.conversationId = conversationId;
  }

  async Read_Record(
    records: React.MutableRefObject<any[]>
  ) {
    const chatRef = firestore().collection('Chat');
  const Logs : CallerRecord[] = [];

  try {
    const querySnapshot = await chatRef
      .where('ConversationId', '==', parseInt(this.conversationId.toString(), 10))
      .get();

    const promises = querySnapshot.docs.map((doc) => {
      const callerRecordsCollection = doc.ref.collection('caller records');

      return callerRecordsCollection.get().then((callerRecordsSnapshot) => {
        callerRecordsSnapshot.forEach((callerRecordDoc) => {
          const callerRecordData = callerRecordDoc.data();
          Logs.push(callerRecordData as CallerRecord);
        });
      });
    });

    await Promise.all(promises);

    records.current = Logs;
  } catch (error) {
    console.log('Error getting documents: ', error);
  }
  }

  async Create_Record(
    recordData: any,
    role:  string,
    ) {
    const chatRef = firestore().collection('Chat');
    const queryRef = await chatRef
      .where('ConversationId', '==', this.conversationId)
      .get();

    if (queryRef.empty) {
      console.log('No matching documents.');
      return;
    }

    queryRef.forEach(doc => {
      const docRef = chatRef.doc(doc.id);
      console.log(`${role} records`);
      const a = `${role} records`;

      const recordsCollectionRef = docRef.collection(a);

      const newRecordDocRef = recordsCollectionRef.doc();

      

      newRecordDocRef.set(recordData);

      console.log('Record document added successfully!');
    });
  }
}
