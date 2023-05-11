import WorkOrderDao from '../models/WorkOrderDao';
const workOrderDao = new WorkOrderDao();
workOrderDao.connect();

export  async function getwodb(): Promise<any> {
    const ha = await workOrderDao.getwlogs(204080);
    console.log("this is wolog")
    console.log(ha)
    return workOrderDao.getwo();
  };

export  async function getwologdb(id : number): Promise<any> {
    return workOrderDao.getwlogs(id);
  };

export  async function getwActivitiesdb(id : number): Promise<any> {
    return workOrderDao.getwActivities(id);
  };