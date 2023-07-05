import WorkOrderDao from "../../models/DAO/WorkOrderDao";
import axios from "axios";
import {encode as base64Encode} from 'base-64';
import { get_CurrentUsername, get_SessionId } from "../Firebase/Firestore/FirebaseQuery";
import { UserDao } from "../../models/DAO/UserDAO";

const workOrderDao = new WorkOrderDao();

export async function logoutMaximo  ()  {
  console.log("hey")
  const SessionId = await get_SessionId();

  try {
    const response = await axios.get(
      'http://training.smartech-tn.com:9219/maximo/oslc/logout',
      {
        headers: {
          MaxAuth: SessionId, 
        },
      }
    );

    if (response.status === 200) {
      console.log(response.config);
      return { success: true };
    } else {
      return { success: false, error: 'Logout failed' };
    }
  } catch (error) {
    console.log('hedha howa lerreure',error);
    return { success: false, error: error };
  }
};

export async function Logoutdb() : Promise<number>{
  const userDaoo = new UserDao();
  await userDaoo.connect();

    await userDaoo.Delete_User();
    return 1;
  }