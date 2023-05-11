import { WoActivity } from './WoActivity';
import { WoLog } from './WoLogModel';

export interface WorkOrder {
    workorderid: number;
    description: string;
    status: string;
    assetnum: string;
    wopriority: string;
    location: string;
    schedstart: string;
    woActivities?: WoActivity[];
    wologs?: WoLog[];
  }