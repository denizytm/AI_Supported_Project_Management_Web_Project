import internal from "stream";
import { UserType } from "./userType";

export interface ProjectRequestType {
  id : number,
  requestedBy : UserType,
  criticLevelName : string,
  isClosed : boolean,
  closingNote ?: string,
  description : string,
  closedAt : Date,
}

export interface ProjectType {
  id: number;
  name: string;
  manager: UserType;
  customer: UserType;
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
