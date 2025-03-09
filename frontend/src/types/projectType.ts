import { UserType } from "./userType";

export interface ProjectType {
  id: string;
  name: string;
  manager: UserType;
  deadline: string;
  progress: string;
  statusName: string;
  priorityName: string;
  budget : number
}
