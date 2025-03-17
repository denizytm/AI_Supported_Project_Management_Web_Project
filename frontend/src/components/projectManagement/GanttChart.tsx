import {
  GanttComponent,
  Inject,
  Selection,
  ColumnsDirective,
  ColumnDirective,
  Toolbar,
} from "@syncfusion/ej2-react-gantt";
import { TaskType } from "@/types/taskType";
import { useEffect, useState } from "react";

interface GanttChartProps {
  taskMap: Map<string, TaskType[]>;
  minStartDate: string;
  maxDueDate: string;
}

export default function GanttChart({ taskMap }: GanttChartProps) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
   
      const formattedData = Object.entries(taskMap)
        .map(([taskType, taskList], index) => {
          if (taskList.length > 0) {
            return {
              TaskID: index + 1,
              TaskName: taskType,
              subtasks: taskList.map((task : TaskType) => ({
                TaskID: task.id,
                TaskName: task.description, 
                LabelName: task.taskLabel.label,
                StartDate: new Date(task.startDateString),
                EndDate: new Date(task.dueDateString),
                Progress: task.progress,
                Priority: task.priorityName,
                Assigned: `${task.assignedUser.name} ${task.assignedUser.lastName}`,
                Status: task.statusName,
                Predecessor: task?.taskId?.toString() || "",
              })),
            };
          }
          return null;
        })
        .filter((task) => task !== null);

      setData(formattedData);
      setReady(true);

  }, [taskMap]);

  /* let dataSource = [
    {
        TaskID: 1,
        TaskName: 'Project Initiation',
        StartDate: new Date('04/02/2019'),
        EndDate: new Date('05/21/2019'),
        subtasks: [
            { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
            { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/29/2019'), Duration: 6, Progress: 50, Predecessor: 2 }
        ]
    },
  ]; */

  const taskFields: any = {
    id: "TaskID",
    name: "TaskName",
    label: "LabelName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    child: "subtasks",
    priority: "Priority",
    status: "Status",
    assigned: "Assigned",
    dependency: "Predecessor",
  };

  const toolbar: string[] = [
    "Add",
    "Edit",
    "Update",
    "Delete",
    "Cancel",
    "ExpandAll",
    "CollapseAll",
    "Indent",
    "Outdent",
  ];

  const labelSettings: any = {
    leftLabel: "TaskName",
  };

  if (!ready || !data) {
    return <>Loading...</>;
  }

  return (
    <div className="control-pane">
      <div className="control-section">
        <GanttComponent
          id="Editing"
          dataSource={data}
          treeColumnIndex={1}
          taskFields={taskFields}
          labelSettings={labelSettings}
          height="800px"
          toolbar={toolbar}
        >
          <ColumnsDirective>
            <ColumnDirective
              field="TaskID"
              width="80"
              headerText=" "
            ></ColumnDirective>
            <ColumnDirective
              field="TaskName"
              headerText="Task Name"
              width="250"
            ></ColumnDirective>
            <ColumnDirective field="LabelName"></ColumnDirective>
            <ColumnDirective field="StartDate"></ColumnDirective>
            <ColumnDirective field="EndDate"></ColumnDirective>
            <ColumnDirective field="Duration"></ColumnDirective>
            <ColumnDirective field="Assigned"></ColumnDirective>
            <ColumnDirective field="Progress"></ColumnDirective>
            <ColumnDirective
              field="Priority"
              headerText="Priority"
              width="120"
            ></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Selection, Toolbar]} />
        </GanttComponent>
      </div>
    </div>
  );
}
