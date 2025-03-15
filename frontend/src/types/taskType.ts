import { TaskLabelType } from "./taskLabelType";
import { TasktypeType } from "./tasktypeType";
import { UserType } from "./userType";

export interface TaskType {
    id : number,
    description : string,
    taskType : TasktypeType,
    taskLevelName : string,
    priority : string,
    priorityName : string,
    assignedUser : UserType,
    status : string,
    statusName : string,
    progress : number,
    startDateString : string,
    dueDateString : string,
    taskLabel : TaskLabelType,
    taskId ?: number,
    taskTypeId : number,
    userId : number
}