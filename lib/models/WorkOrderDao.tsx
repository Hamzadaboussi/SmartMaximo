import React from 'react';
import SQLite, { enablePromise } from 'react-native-sqlite-storage';
import { Alert, PermissionsAndroid } from 'react-native';
import { WoLog } from './WoLogModel';
import { WorkOrder } from './WorkOrderModel';
import { WoActivity } from './WoActivity';








export default class WorkOrderDao {
  private db?: SQLite.SQLiteDatabase ;
  private tableNameW = 'workorders';
  private tableNameT = 'Taches';
  private tableNameL = 'Logs';
  private tableNameU = 'Users';

  
  
  

  async connect(): Promise<void> {
    
    try {
      this.db = await SQLite.openDatabase({
        name: 'workorders.sqlite',
        location: 'default',
       
      });
      await this.db.executeSql(
          `CREATE TABLE IF NOT EXISTS ${this.tableNameW} (
            WORKORDERID INTEGER PRIMARY KEY,
            DESCRIPTION TEXT,
            STATUS TEXT,
            ASSETNUM TEXT,
            WOPRIORITY TEXT,
            LOCATION TEXT,
            SCHEDSTART  TEXT
          )`
      );
      await this.db?.executeSql('COMMIT');
      
      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${this.tableNameT} (
          WORKORDERID INTEGER NOT NULL,
          TASKID INTEGER NOT NULL,
          DESCRIPTION TEXT,
          STATUS TEXT,
          PRIMARY KEY (WORKORDERID, TASKID),
          FOREIGN KEY (WORKORDERID) REFERENCES ${this.tableNameW}(WORKORDERID) ON DELETE CASCADE
        )`
      );
      await this.db?.executeSql('COMMIT');
      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${this.tableNameL} (
          WORKORDERID INTEGER NOT NULL,
          WORKLOGID INTEGER NOT NULL,
          DESCRIPTION TEXT,
          LOGTYPE TEXT,
          CREATEDATE TEXT,
          CREATEBY Text,
          PRIMARY KEY (WORKORDERID, WORKLOGID),
          FOREIGN KEY (WORKORDERID) REFERENCES ${this.tableNameW}(WORKORDERID) ON DELETE CASCADE
        )`
      );
      await this.db?.executeSql('COMMIT');

      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS ${this.tableNameU} (
          USERID INTEGER PRIMARY KEY,
          _lid TEXT,
          _lpwd TEXT,
          _islogged TEXT

        )`
    );
    await this.db?.executeSql('COMMIT');
      

        
          
        
      
      console.log('Connected to database');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async loginDBlocal(username: string, password: string): Promise<void> {
    try {
      const count = await this.count(this.tableNameU)

      if ( count === 0) {
        const loginPromises = await this.db?.executeSql(
          `INSERT OR REPLACE INTO ${this.tableNameU} (USERID, _lid, _lpwd, _islogged) VALUES (?, ?, ?, ?)`,
          [null, username, password , "true"]
        );
        await this.db?.executeSql('COMMIT');
        console.log("user ajouter");
        await Promise.all([loginPromises]);
      }
      else {
        console.log(count)
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
}


  async saveAllWorkOrders(workOrders: WorkOrder[]): Promise<void> {
    try {
      
      
      const promises = workOrders.map(async (workOrder) => {
        await this.db?.executeSql(
          `INSERT OR REPLACE INTO ${this.tableNameW} (WORKORDERID, DESCRIPTION, STATUS, ASSETNUM, WOPRIORITY, LOCATION, SCHEDSTART) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            workOrder.workorderid,
            workOrder.description,
            workOrder.status,
            workOrder.assetnum,
            workOrder.wopriority,
            workOrder.location,
            workOrder.schedstart,
          ]
        );
        await this.db?.executeSql('COMMIT');
       
        if (workOrder.woActivities) {
          const activityPromises = workOrder.woActivities.map(async (activity) => {
            await this.db?.executeSql(
              `INSERT OR REPLACE INTO ${this.tableNameT} (WORKORDERID, TASKID, DESCRIPTION, STATUS) 
                 VALUES (?, ?, ?, ?)`,
              [workOrder.workorderid, activity.taskid, activity.description, activity.status]
            );
            await this.db?.executeSql('COMMIT');
          });
          await Promise.all(activityPromises);
        }
        if (workOrder.wologs) {
          const logsPromises = workOrder.wologs.map(async (log) => {
            await this.db?.executeSql(
              `INSERT OR REPLACE INTO ${this.tableNameL} (WORKORDERID, WORKLOGID, DESCRIPTION, LOGTYPE , CREATEDATE ,CREATEBY) 
                VALUES (?, ?, ?, ?,?,?)`,
              [workOrder.workorderid, log.worklogid, log.description, log.logtype ,log.createdate ,log.createby ]
            );
            await this.db?.executeSql('COMMIT');
          });
          await Promise.all(logsPromises);
        }
      });
  
      await Promise.all(promises);
      await this.db?.executeSql('COMMIT');
      console.log('savd to database');
      if (this.db) {
        console.log('Database is opened!');
        console.log(this.db);
      } else {
        console.log('Database is not opened!');
      }
      


    } catch (error) {
      console.error(error);
      
      throw error;
    }
  }

  async requestExternalStoragePermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External Storage Permission',
          message: 'This app needs access to your external storage to be able to read data from your device.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        throw new Error('Storage permission not granted');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  async getwo(): Promise<WorkOrder[]> {
    try {
      const workOrders: WorkOrder[] = [];
      console.log("dkhalt");
      await new Promise<void>((resolve, reject) => {
        this.db?.transaction((tx) => {
          tx.executeSql(`SELECT * FROM ${this.tableNameW}`, [], (tx, results) => {
            console.log("Queery completed");
  
            // Get rows with Web SQL Database spec compliance.
  
            const len = results.rows.length;
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              const wo: WorkOrder = {
                workorderid: row.WORKORDERID,
                description: row.DESCRIPTION,
                status: row.STATUS,
                assetnum: row.ASSETNUM,
                wopriority: row.WOPRIORITY,
                location: row.LOCATION,
                schedstart: row.SCHEDSTART,
              };
              workOrders.push(wo);
            }
            console.log("wsselt xD");
            
            resolve();
          }, (tx, error) => {
            console.error(error);
            reject(error);
          });
        });
      });
      return workOrders;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getwlogs(id : number): Promise<WoLog[]> {
    try {
      const worklogs: WoLog[] = [];
      console.log("dkhalt");
      await new Promise<void>((resolve, reject) => {
        this.db?.transaction((tx) => {
          tx.executeSql(`SELECT * FROM ${this.tableNameL} WHERE WORKORDERID = ${id} `, [], (tx, results) => {
            console.log("Queery completed");
  
            // Get rows with Web SQL Database spec compliance.
  
            const len = results.rows.length;
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              const wo: WoLog = {
                worklogid: row.WORKLOGID,
                description: row.DESCRIPTION,
                logtype : row.LOGTYPE,
                createdate: row.CREATEDATE,
                createby: row.CREATEBY,
              };
              worklogs.push(wo);
            }
            console.log("wsselt xD");
            
            resolve();
          }, (tx, error) => {
            console.error(error);
            reject(error);
          });
        });
      });
      return worklogs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getwActivities(id : number): Promise<WoActivity[]> {
    try {
      const Woactivity: WoActivity[] = [];
      console.log("dkhalt");
      await new Promise<void>((resolve, reject) => {
        this.db?.transaction((tx) => {
          tx.executeSql(`SELECT * FROM ${this.tableNameT} WHERE WORKORDERID = ${id} `, [], (tx, results) => {
            console.log("Queery completed");
  
            // Get rows with Web SQL Database spec compliance.
  
            const len = results.rows.length;
            for (let i = 0; i < len; i++) {
              const row = results.rows.item(i);
              const wo: WoActivity = {
                taskid: row.TASKID,
                description: row.DESCRIPTION,
                status : row.STATUS,
                
              };
              Woactivity.push(wo);
            }
            console.log("wsselt xD");
            
            resolve();
          }, (tx, error) => {
            console.error(error);
            reject(error);
          });
        });
      });
      return Woactivity;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async count(tablename: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.db?.transaction(tx => {
        tx.executeSql(`SELECT * FROM ${tablename}`, [], (tx, results) => {
          console.log("Query completed");
  
          const len = results.rows.length;
          resolve(len);
        }, (tx, error) => {
          console.error(error);
          reject(error);
        });
      });
    });
  }
 
  
  async logout(): Promise<void>{
    console.log("logout")
    await this.db?.executeSql(`DELETE FROM ${this.tableNameU}`);

    
    

  }
  
  

/*
  async saveWorkOrder(workOrder) {
    try {
      const promises = workOrder.map((workOrder) =>
        this.db.run(
          `INSERT OR REPLACE INTO ${this.tableNameW} (WORKORDERID, DESCRIPTION, STATUS, ASSETNUM, WOPRIORITY, LOCATION, SCHEDSTART  ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [workOrder.WORKORDERID, workOrder.DESCRIPTION, workOrder.STATUS, workOrder.ASSETNUM, workOrder.WOPRIORITY, workOrder.LOCATION, workOrder.SCHEDSTART ]
        )
      );
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async updateWorkOrder(workOrder) {
    try {
      await this.db.run(
        `UPDATE ${this.tableNameW} SET DESCRIPTION = ?, STATUS = ?, ASSETNUM = ?, WOPRIORITY = ?, LOCATION = ?, SCHEDSTART = ? WHERE WORKORDERID = ?`,
        [workOrder.DESCRIPTION, workOrder.STATUS, workOrder.ASSETNUM, workOrder.WOPRIORITY, workOrder.LOCATION, workOrder.SCHEDSTART, workOrder.WORKORDERID]
      );
      return workOrder;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async deleteWorkOrder(WORKORDERID) {
    try {
      await this.db.run(`DELETE FROM ${this.tableNameW} WHERE WORKORDERID = ?`, WORKORDERID);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getAllWorkOrders() {
    try {
      const rows = await this.db.all(`SELECT * FROM ${this.tableNameW}`);
      return rows.map((row) => ({
        WORKORDERID: row.WORKORDERID,
        description: row.description,
        status: row.status,
        location: row.location,
      }));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getWorkOrderById(WORKORDERID) {
    try {
      const row = await this.db.get(`SELECT * FROM ${this.tableNameT} WHERE WORKORDERID = ?`, WORKORDERID);
      if (row) {
        return {
          WORKORDERID: row.WORKORDERID,
          description: row.description,
          status: row.status,
          location: row.location,
        };
      }
      return null;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }/*/
}
