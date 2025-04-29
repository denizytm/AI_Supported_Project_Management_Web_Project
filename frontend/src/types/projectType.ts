import internal from "stream";
import { UserType } from "./userType";

export interface ProjectRequestType {
  id : number,
  requestedBy : UserType,
  criticLevelName : string,
  isClosed : boolean,
  closingNote ?: string,
  description : string,
  closedAt : string,
  createdAt : string
}

export interface ProjectType {
  id: number;
  name: string;
  manager: UserType;
  customer: UserType;
  startDate: string;
  deadline: string;
  progress: string;
  statusName: string;
  priorityName: string;
  budget : number;
  projectType : {
    id : number;
    name : string;
  }
  projectRequests ?: ProjectRequestType[]
}
