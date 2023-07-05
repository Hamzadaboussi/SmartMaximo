import SQLite from 'react-native-sqlite-storage';
import { WoActivity } from '../Entities/WoActivity';


export class WoActivityDao {
  private db?: SQLite.SQLiteDatabase;
  private tableName = 'Taches';

  async connect(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'workorders.sqlite',
        location: 'default',
      });
     
      await this.createWorkActivitiesTable(this.tableName);
     
      console.log('Connected to database');
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
   async createWorkActivitiesTable(tableName : string): Promise<void> {
    await this.db?.executeSql( `
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
      WORKORDERID INTEGER NOT NULL,
      TASKID INTEGER NOT NULL,
      DESCRIPTION TEXT,
      STATUS TEXT,
      PRIMARY KEY (WORKORDERID, TASKID),
      FOREIGN KEY (WORKORDERID) REFERENCES ${this.tableName}(WORKORDERID) ON DELETE CASCADE
    )`);
    await this.db?.executeSql('COMMIT');
  }

  async Update_WoActivities(workOrderId: number, activities: WoActivity[]): Promise<void> {
    try {
      const promises = activities.map(async (activity) => {
        await this.db?.executeSql(
          `INSERT OR REPLACE INTO ${this.tableName} (WORKORDERID, TASKID, DESCRIPTION, STATUS)
          VALUES (?, ?, ?, ?)`,
          [workOrderId, activity.taskid, activity.description, activity.status]
        );
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  async Read_wActivities(id: number): Promise<WoActivity[]> {
    try {
      const Woactivity: WoActivity[] = [];
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
                const wo: WoActivity = {
                  taskid: row.TASKID,
                  description: row.DESCRIPTION,
                  status: row.STATUS,
                };
                Woactivity.push(wo);
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
      return Woactivity;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
