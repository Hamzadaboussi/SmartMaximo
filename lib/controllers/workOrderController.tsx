import axios from 'axios';
import WorkOrderDao from '../models/WorkOrderDao';

const maximoBaseUrl = 'http://training.smartech-tn.com:9219/maximo/oslc/os/mxwodetail?oslc.select=*';
const workOrderDao = new WorkOrderDao();
workOrderDao.connect();

export default async function getAllWorkOrders(): Promise<any> {
    try {
      const response = await axios.get(maximoBaseUrl, {
        params: {
          'oslc.select': '*,rel.woactivity{*}',
          '_lid': 'maxadmin',
          '_lpwd': 'maxadmin123',
          'lean': 1,
          'oslc.pageSize': 10,
          'oslc.page': 1
        }
      });
      console.log("fetch is done");
      const workOrders: any[] = [];
      if (response.data && response.data.member) {
        response.data.member.forEach((workOrder: any) => {
          const { workorderid, description, status, assetnum, wopriority, location, schedstart } = workOrder ?? {};
          const woActivities = workOrder.woactivity?.map((woActivity: any) => {
            const { taskid, description, status } = woActivity ?? {};
            return { taskid, description, status };
          }) ?? [];
          const wologs = workOrder.worklog?.map((wolog: any) => {
            const { worklogid, description, logtype, createdate, createby } = wolog ?? {};
            return { worklogid, description, logtype, createdate, createby };
          }) ?? [];
          workOrders.push({
            workorderid: workorderid ?? '',
            description: description ?? '',
            status: status ?? '',
            assetnum: assetnum ?? '',
            wopriority: wopriority ?? '',
            location: location ?? '',
            schedstart: schedstart ?? '',
            woActivities,
            wologs,
          });
        });
      }
      await workOrderDao.saveAllWorkOrders(workOrders);
      console.log("saved berassmi")
      return workOrders;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
