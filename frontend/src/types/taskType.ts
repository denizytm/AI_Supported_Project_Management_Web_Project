import { UserType } from "./userType";

export interface TaskType {
    taskName : string,
    label : string,
    taskLevel : string,
    taskLevelName : string,
    priority : string,
    priorityName : string,
    assignedUser : UserType,
    status : string,
    statusName : string,
    progress : number,
    dueDate : Date
}