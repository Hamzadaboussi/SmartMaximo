
import SQLite, { enablePromise } from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const directoryPath = `${RNFS.ExternalStorageDirectoryPath}/Android/data/com.appname/db`;
RNFS.mkdir(directoryPath);
const dbFilePath = `${directoryPath}/workorders.sqlite`;
interface WorkOrder {
  workorderid: number;
  description: string;
  status: string;
  assetnum: string;
  wopriority: string;
  location: string;
  schedstart: string;
}

async function datab() {
  function runQuery(query: string, params: any[] = []): Promise<any[]> {
    console.log(`Running query: ${query}`);
    console.log(`With params: ${params}`);
    return new Promise((resolve, reject) => {
      
      db.transaction((tx) => {
        tx.executeSql(
          query,
          params,
          (_, result) => {
            setTimeout(() => {
              console.log(`Query succeeded: ${query}`);
              console.log(result.rows.raw());
              resolve(result.rows.raw());
            }, 1000); // wait for 1 second before logging the results
          },
          (_, error) => {
            setTimeout(() => {
              console.log(`Query failed: ${query}`);
              console.error(error);
              reject(error);
            }, 1000); // wait for 1 second before logging the error
          }
        );
      });
    });
  }
  
  
  var db = await SQLite.openDatabase({
    name: "workorders.sqlite",
    location: 'Documents',
    createFromLocation: 1,
  });
  await RNFS.copyFileAssets('workorders.sqlite', 'Documents/workorders.sqlite')
  .then(() => {
    console.log('Database file copied to external storage location');
  })
  .catch((error) => {
    console.error('Error copying database file to external storage location:', error);
  });
  await db.transaction((txn) => {
    txn.executeSql(
      `CREATE TABLE IF NOT EXISTS 'workorders' (
        WORKORDERID INTEGER PRIMARY KEY,
        DESCRIPTION TEXT,
        STATUS TEXT,
        ASSETNUM TEXT,
        WOPRIORITY TEXT,
        LOCATION TEXT,
        SCHEDSTART  TEXT
      )`, [],
      (_txn, res) => {
        console.log('table created successfully');
      },
      (error) => {
        console.log(`Error: ${error}`);
      },
    );
  });
  await db.transaction((txn) => {
    txn.executeSql(
      `INSERT OR REPLACE INTO 'workorders' (WORKORDERID, DESCRIPTION, STATUS, ASSETNUM, WOPRIORITY, LOCATION, SCHEDSTART) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            12,
            "hamza",
            "hamza",
            "hamza",
            "hamza",
            "hamza",
            "hamza",
          ],
      (_txn, res) => {
        console.log('table created successfully');
      },
      (error) => {
        console.log(`Error: ${error}`);
      },
    );
  });
  runQuery('SELECT COUNT(*) FROM workorders')
  .then((results) => {
    console.log(`Query results: ${results}`);
  })
  .catch((error) => {
    console.error(`Query failed with error: ${error}`);
  });

  
}