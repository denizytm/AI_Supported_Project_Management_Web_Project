"use client";

import GanttChart from "@/components/projectManagement/GanttChart"
import { ProjectType } from "@/types/projectType";
import { TaskType } from "@/types/taskType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard (){

    const [projectData, setProjectData] = useState<ProjectType>({
        id : "0",
        budget : 0,
        deadline : "0000-00-00",
        manager : {
          id : "0",
          email : "loading",
          name : "loading",
          lastName : "loading",
          profficiencyLevelName : "loading",
          roleName : "loading",
          statusName : "loading",
          taskRoleName : "loading"
        },
        name : "loading",
        priorityName : "loading",
        progress : "loading",
        statusName : "loading"
      });
      const [usersData, setUsersData] = useState<Array<UserType>>([]);
    
      const [tasks, setTasks] = useState<Array<TaskType>>([]);
      const [taskMap, setTaskMap] = useState(new Map<string, Array<TaskType>>());
      const [taskTypes, setTaskTypes] = useState<Array<string>>([]);
    
      const [ready1, setReady1] = useState(false);
      const [ready2, setReady2] = useState(false);
    
      const [isModalOpen,setIsModalOpen] = useState(false);
    
      const router = useRouter();
      const searchParams = useSearchParams();
    
      useEffect(() => {
        (async () => {
          const response = await axios.get(
            `http://localhost:5110/api/projects/management?id=${1}`
          );
    
          if (response.status) {
            const data: Array<TaskType> = response.data.taskDtos;
            setProjectData(response.data.project);
            setUsersData(response.data.users);
    
            let types: Array<string> = [];
    
            for (let i = 0; i < data.length; i++)
              if (!types.includes(data[i].typeName)) types.push(data[i].typeName);
    
            setTaskTypes(types);
            setTasks(data);
            setReady1(true);
          }
        })();
      }, []);
    
      useEffect(() => {
        if (ready1 && tasks && tasks.length && taskTypes && taskTypes.length) {
          const newTaskMap = new Map<string, Array<TaskType>>();
    
          for (let typeName of taskTypes) {
            newTaskMap.set(
              typeName,
              tasks.filter((task) => task.typeName == typeName)
            );
          }
    
          setTaskMap(newTaskMap);
          setReady2(true);
        }
      }, [taskTypes]);

    if(!tasks.length || !taskTypes.length) return (<div>Loading...</div>)

    return (
        <div className="w-11/12 mx-auto">
            <GanttChart {...{taskMap,taskTypes}} />
        </div>
    )
}
