import axios from "axios";
import {encode as base64Encode} from 'base-64';
import WorkOrderDao from "../../models/DAO/WorkOrderDao";
import { UserDao } from "../../models/DAO/UserDAO";

const workOrderDao = new WorkOrderDao();
workOrderDao.connect();
const userDao = new UserDao();
userDao.connect();

export const login = async (username: string, password: string) => {
  const credentials = `${username}:${password}`;
  const encodedCredentials = base64Encode(credentials);
  const authHeader = `maxauth ${encodedCredentials}`;

  try {
    const response = await axios.post(
      'http://training.smartech-tn.com:9219/maximo/oslc/login',
      {},
      {
        headers: {
          Authorization: authHeader,
        },
        params: {
          _lid: username,
          _lpwd: password,
          _timestamp: new Date().getTime(),
        },
        timeout: 1000,
      },
    );

    if (response.status === 200) {
      const sessionId = response.headers['set-cookie'];
      console.log('Session ID:', sessionId);
      return { success: true, data: response.data, sessionId: sessionId };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  } catch (error : any) {
    console.log(error);
    console.log("lee")
    return { success: false, error: error };
  }
};


  

export  async function logindb(username : string, password : string): Promise<any> {
  const userDaoo = new UserDao();
  await userDaoo.connect();
  return userDaoo.Update_User(username,password);
};

export async function count() : Promise<any>{
  const userDaoo = new UserDao();
  await userDaoo.connect();  
  console.log("hey")
  return await userDaoo.count("Users");
}
