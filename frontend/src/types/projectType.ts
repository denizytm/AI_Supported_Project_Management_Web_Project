import { UserType } from "./userType";

export interface UserProjectType {
  id: number;
  userId: number;
  user?: UserType;
  projectId: number;
  project?: ProjectType;
}

export interface ProjectRequestType {
  id: number;
  requestedBy: UserType;
  criticLevelName: string;
  isClosed: boolean;
  closingNote?: string;
  description: string;
  closedAt: string;
  createdAt: string;
}

export interface ProjectType {
  id: number;
  name: string;
  description : string;
  manager: UserType;
  customer: UserType;
  startDate: string;
  deadline: string;
  progress: string;
  statusName: string;
  priorityName: string;
  budget: number;
  spentBudget: number;
  userProjects ?: UserProjectType[];
  projectType: {
    id: number;
    name: string;
  };
  projectRequests?: ProjectRequestType[];
}
