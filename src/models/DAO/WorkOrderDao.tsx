import React from 'react';
import SQLite, {enablePromise} from 'react-native-sqlite-storage';
import {Alert, PermissionsAndroid} from 'react-native';
import {WoLog} from '../Entities/WoLogModel';
import {WorkOrder} from '../Entities/WorkOrderModel';
import {WoActivity} from '../Entities/WoActivity';
import { WoLogDao } from './WorklogDAO';
import { WoActivityDao } from './WorkActivitiesDAO';
import {  UserDao } from './UserDAO';

export default class WorkOrderDao {
  private db?: SQLite.SQLiteDatabase;
  private tableNameW = 'workorders';

  private woLogDao: WoLogDao;
  private woActivityDao: WoActivityDao;
  private UserDao : UserDao; 

  constructor() {
    this.woActivityDao = new WoActivityDao();
    this.woLogDao = new WoLogDao();
    this.UserDao = new UserDao();
  }
  
  async connect(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'workorders.sqlite',
        location: 'default',
      });
      await this.createWorkOrderTable();
      await this.woActivityDao.createWorkActivitiesTable(this.tableNameW);
      await this.woLogDao.createWorkLogsTable(this.tableNameW);
      await this.UserDao.createUserTable();
      console.log('Connected to database');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private async createWorkOrderTable(): Promise<void> {
    await this.db?.executeSql(`
      CREATE TABLE IF NOT EXISTS ${this.tableNameW} (
        WORKORDERID INTEGER PRIMARY KEY,
        DESCRIPTION TEXT,
        STATUS TEXT,
        ASSETNUM TEXT,
        WOPRIORITY TEXT,
        LOCATION TEXT,
        SCHEDSTART TEXT
      )
    `);
    await this.db?.executeSql('COMMIT');
  }
  
  
  async Update_WorkOrders(workOrders: WorkOrder[]): Promise<void> {
    try {
      const promises = workOrders.map(async workOrder => {
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
          ],
        );
        await this.db?.executeSql('COMMIT');

        if (workOrder.woActivities) {
          await this.woActivityDao.Update_WoActivities(workOrder.workorderid, workOrder.woActivities);
        }
  
        if (workOrder.wologs) {
          await this.woLogDao.Update_WoLogs(workOrder.workorderid, workOrder.wologs);
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

  
  async Read_WorkOrders(): Promise<WorkOrder[]> {
    try {
      const workOrders: WorkOrder[] = [];
      console.log('dkhalt');
      await new Promise<void>((resolve, reject) => {
        this.db?.transaction(tx => {
          tx.executeSql(
            `SELECT * FROM ${this.tableNameW}`,
            [],
            (tx, results) => {
              console.log('Queery completed');

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
              console.log('wsselt xD');

              resolve();
            },
            (tx, error) => {
              console.error(error);
              reject(error);
            },
          );
        });
      });
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
