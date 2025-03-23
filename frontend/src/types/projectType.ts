import internal from "stream";
import { UserType } from "./userType";

export interface ProjectType {
  id: number;
  name: string;
  manager: UserType;
  deadline: string;
  progress: string;
  statusName: string;
  priorityName: string;
  budget : number;
  projectType : {
    id : number;
    name : string;
  }
}
