import SQLite from 'react-native-sqlite-storage';


export class UserDao {
  private db?: SQLite.SQLiteDatabase;
  private tableName = 'Users';
  
  async connect(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'workorders.sqlite',
        location: 'default',
      });
      await this.createUserTable();
      console.log('Connected to database');
    } catch (error) {
      console.error(error); 
      throw error;
    }
  }

  async createUserTable(): Promise<void> {
    await this.db?.executeSql(  `CREATE TABLE IF NOT EXISTS ${this.tableName} (
      USERID INTEGER PRIMARY KEY,
      _lid TEXT,
      _lpwd TEXT,
      _islogged TEXT

    )`);
    await this.db?.executeSql('COMMIT');
  }

 
  async Update_User(username: string, password: string): Promise<void> {
    try {
      const count = await this.count(this.tableName);

      if (count === 0) {
        const loginPromises = await this.db?.executeSql(
          `INSERT OR REPLACE INTO ${this.tableName} (USERID, _lid, _lpwd, _islogged) VALUES (?, ?, ?, ?)`,
          [null, username, password, 'true'],
        );
        await this.db?.executeSql('COMMIT');
        console.log('user ajouter');
        await Promise.all([loginPromises]);
      } else {
        console.log(count);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async count(tablename: string): Promise<number> {
    try {
      return await new Promise((resolve, reject) => {
        console.log('dkhalt lel countr');
        console.log('he', this.db?.dbName);
        this.db?.transaction(tx => {
          tx.executeSql(
            `SELECT COUNT(*) AS count FROM ${tablename}`,
            [],
            (tx, results) => {
              const {count} = results.rows.item(0);
              console.log('ici aussi', count);
              resolve(count);
            },
            (tx, error) => {
              console.error(error);
              reject(error);
            },
          );
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async Delete_User(): Promise<void> {
    console.log('logout');
    await this.db?.executeSql(`DELETE FROM ${this.tableName}`);
  }

  
}
