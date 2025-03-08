import {
  GanttComponent,
  Inject,
  Selection,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-gantt";
import { TaskType } from "@/types/taskType";
import { useEffect, useState } from "react";

interface GanttChartProps {
  taskMap: Map<string, TaskType[]>;
  taskTypes: string[];
}

export default function GanttChart({ taskTypes, taskMap }: GanttChartProps) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    if (taskTypes.length > 0 && taskMap.size > 0) {
      const formattedData = taskTypes
        .map((type) => {
          const taskData = taskMap.get(type);
          if (taskData?.length) {
            return {
              TaskID: 1,
              TaskName: type,
              StartDate: new Date("04/02/2025"),
              EndDate: new Date("04/21/2025"),
              subtasks: [
                ...taskData.map((task, index) => ({
                  TaskID: task.id,
                  TaskName: task.taskName,
                  StartDate: new Date(task.dueDate),
                  Duration: 3,
                  Progress: task.progress,
                  Priority: task.priorityName,
                  Assigned:
                    task.assignedUser.name + " " + task.assignedUser.lastName,
                  Status: task.statusName,
                  Predecessor: "1",
                })),
              ],
            };
          }
          return null;
        })
        .filter((task) => task !== null);

      setData(formattedData);
      setReady(true);
    }
  }, [taskMap, taskTypes]);

  const taskFields: any = {
    id: "TaskID",
    name: "TaskName",
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

  if (!ready || !data) {
    return <>Loading...</>;
  }

  const labelSettings: any = {
    leftLabel: "TaskName",
  };
  const projectStartDate: Date = new Date("04/01/2025");
  const projectEndDate: Date = new Date("01/01/2026");

  return (
    <div className="control-pane">
      <div className="control-section">
        <GanttComponent
          id="Default"
          dataSource={data}
          treeColumnIndex={1}
          taskFields={taskFields}
          labelSettings={labelSettings}
          height="800px"
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
        >
          <ColumnsDirective>
            <ColumnDirective field="TaskID" width="80"></ColumnDirective>
            <ColumnDirective
              field="TaskName"
              headerText="Task Name"
              width="250"
              clipMode="EllipsisWithTooltip"
            ></ColumnDirective>
            <ColumnDirective field="StartDate"></ColumnDirective>
            <ColumnDirective field="Duration"></ColumnDirective>
            <ColumnDirective field="Assigned"></ColumnDirective>
            <ColumnDirective field="Progress"></ColumnDirective>
            <ColumnDirective field="Status"></ColumnDirective>
            <ColumnDirective
              field="Priority"
              headerText="Priority"
              width="120"
            ></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Selection]} />
        </GanttComponent>
      </div>
    </div>
  );
}
