import { WoActivityDao } from '../../models/DAO/WorkActivitiesDAO';
import WorkOrderDao from '../../models/DAO/WorkOrderDao';
import { WoLogDao } from '../../models/DAO/WorklogDAO';
const workOrderDao = new WorkOrderDao();
workOrderDao.connect();

export  async function getwodb(): Promise<any> {
  const workOrderDaoo = new WorkOrderDao();
  await workOrderDaoo.connect();

    const wo = await workOrderDaoo.Read_WorkOrders()
    return wo;
  };

export  async function getwologdb(id : number): Promise<any> {
  const wolog = new WoLogDao();
  await wolog.connect()
    return wolog.Read_wlogs(id);
  };

export  async function getwActivitiesdb(id : number): Promise<any> {
  const woactivity = new WoActivityDao() ;
  await woactivity.connect()
    return woactivity.Read_wActivities(id);
  };