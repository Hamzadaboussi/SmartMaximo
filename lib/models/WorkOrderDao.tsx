import React from 'react';
import SQLite, { enablePromise } from 'react-native-sqlite-storage';


interface WorkOrder {
  workorderid: number;
  description: string;
  status: string;
  assetnum: string;
  wopriority: string;
  location: string;
  schedstart: string;
  woActivities?: WoActivity[];
  wologs?: WoLog[];
}

interface WoActivity {
  taskid: number;
  description: string;
  status: string;
}

interface WoLog {
  worklogid: number;
  description: string;
  logtype: string;
  createdate: string;
  createby: string;
}

export default class WorkOrderDao {
  private db?: SQLite.SQLiteDatabase ;
  private tableNameW = 'workorders';
  private tableNameT = 'Taches';
  private tableNameL = 'Logs';

  
  
  

  async connect(): Promise<void> {
    
    try {
      this.db = await SQLite.openDatabase({
        name: 'workorderrrs.sqlite',
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
      
        
      this.db.transaction((tx) => {
        tx.executeSql(
          'SELECT name FROM sqlite_temp_master WHERE type="table"',
          [],
          (tx, results) => {
            console.log("Query completed");
      
            
      
            for (let i = 0; i < results.rows.length; i++) {
              const tableName = results.rows.item(i).name;
      
              console.log(`Table name: ${tableName}`);
            }
          },
          (error) => {
            console.error(error);
          }
        );
      });
        
          
        
      
      console.log('Connected to database');
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
      try {
        const countResult = await this.db?.executeSql(`SELECT COUNT(*) FROM ${this.tableNameW}`);
        
        const count = countResult && countResult[0].rows.item(0)['COUNT(*)'];
        console.log('this is count');
        console.log(count); 
      } catch (error) {
        console.error(error);
      }


    } catch (error) {
      console.error(error);
      
      throw error;
    }
  }
  async getwo(): Promise<WorkOrder[]> {
    try {
      
      const result = await this.db?.executeSql(`SELECT * FROM ${this.tableNameW}`);
      
      if (!result || result[0].rows.length === 0) {
        
        return [];
      }
      const rows = result[0].rows;
      const workOrders: WorkOrder[] = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows.item(i);
        const wo: WorkOrder = {
          workorderid: row.workorderid,
          description: row.description,
          status: row.status,
          assetnum: row.assetnum,
          wopriority: row.wopriority,
          location: row.location,
          schedstart: row.schedstart,
        };
        workOrders.push(wo);
      }
      console.log("wsselt xD");
      return workOrders;
    } catch (error) {
      console.error(error);
      throw error;
    }
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



