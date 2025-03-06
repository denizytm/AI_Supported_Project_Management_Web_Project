import { UserType } from "./userType";

export interface TaskType {
    taskName : string,
    label : string,
    taskLevel : string,
    taskLevelName : string,
    priority : string,
    priorityName : string,
    assigned : UserType,
    status : string,
    statusName : string,
    progress : number,
    risk : string,
}