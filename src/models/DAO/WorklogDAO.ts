import SQLite from 'react-native-sqlite-storage';
import { WoLog } from '../Entities/WoLogModel';

export class WoLogDao {
  private db?: SQLite.SQLiteDatabase;
  private tableName = 'Logs';

  async connect(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'workorders.sqlite',
        location: 'default',
      });
     
      await this.createWorkLogsTable(this.tableName);
      
      console.log('Connected to database');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createWorkLogsTable(tableName :string): Promise<void> {
    await this.db?.executeSql( `
    CREATE TABLE IF NOT EXISTS ${this.tableName} (
      WORKORDERID INTEGER NOT NULL,
      WORKLOGID INTEGER NOT NULL,
      DESCRIPTION TEXT,
      LOGTYPE TEXT,
      CREATEDATE TEXT,
      CREATEBY Text,
      PRIMARY KEY (WORKORDERID, WORKLOGID),
      FOREIGN KEY (WORKORDERID) REFERENCES ${this.tableName}(WORKORDERID) ON DELETE CASCADE
    )`);
    await this.db?.executeSql('COMMIT');
  }

  async Read_wlogs(id: number): Promise<WoLog[]> {
    try {
      const worklogs: WoLog[] = [];
      console.log('dkhalt');
      await new Promise<void>((resolve, reject) => {
        this.db?.transaction(tx => {
          tx.executeSql(
            `SELECT * FROM ${this.tableName} WHERE WORKORDERID = ${id} `,
            [],
            (tx, results) => {
              console.log('Queery completed');

              const len = results.rows.length;
              for (let i = 0; i < len; i++) {
                const row = results.rows.item(i);
                const wo: WoLog = {
                  worklogid: row.WORKLOGID,
                  description: row.DESCRIPTION,
                  logtype: row.LOGTYPE,
                  createdate: row.CREATEDATE,
                  createby: row.CREATEBY,
                };
                worklogs.push(wo);
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
      return worklogs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async Update_WoLogs(workOrderId: number, logs: WoLog[]): Promise<void> {
    try {
      const promises = logs.map(async (log) => {
        await this.db?.executeSql(
          `INSERT OR REPLACE INTO ${this.tableName} (WORKORDERID, WORKLOGID, DESCRIPTION, LOGTYPE, CREATEDATE, CREATEBY)
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            workOrderId,
            log.worklogid,
            log.description,
            log.logtype,
            log.createdate,
            log.createby,
          ]
        );
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
