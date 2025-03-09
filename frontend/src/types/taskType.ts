import { TaskLabelType } from "./taskLabelType";
import { UserType } from "./userType";

export interface TaskType {
    id : number,
    taskName : string,
    taskLevel : string,
    taskLevelName : string,
    priority : string,
    priorityName : string,
    assignedUser : UserType,
    status : string,
    statusName : string,
    progress : number,
    startDateString : string,
    dueDateString : string,
    typeName : string,
    taskLabel : TaskLabelType,
    taskId ?: number
}