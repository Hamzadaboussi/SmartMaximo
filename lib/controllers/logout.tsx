import WorkOrderDao from "../models/WorkOrderDao";

const workOrderDao = new WorkOrderDao();
workOrderDao.connect();

export async function Logoutdb() : Promise<number>{
    console.log("yay");
    await workOrderDao.logout();
    return 1;
  }