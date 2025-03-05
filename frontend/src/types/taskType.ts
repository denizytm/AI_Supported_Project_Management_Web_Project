import { UserType } from "./userType";

export interface TaskType {
    taskName : string,
    label : string,
    taskLevel : string,
    priority : string,
    assigned : UserType,
    status : string,
    progress : string,
    risk : string,
}