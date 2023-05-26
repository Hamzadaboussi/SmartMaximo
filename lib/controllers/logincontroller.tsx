import axios from "axios";
import {encode as base64Encode} from 'base-64';
import WorkOrderDao from "../models/WorkOrderDao";

const workOrderDao = new WorkOrderDao();
workOrderDao.connect();

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

    if (response.status === 200 ) {
      console.log(response.config)
      return { success: true, data: response.data };
    } else {
      return { success: false, error: 'Invalid username or password' };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
};

  

export  async function logindb(username : string, password : string): Promise<any> {
  return workOrderDao.loginDBlocal(username,password);
};

export async function count() : Promise<any>{
  return await workOrderDao.count("Users");
}
