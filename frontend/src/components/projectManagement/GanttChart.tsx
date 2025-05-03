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
import EditTaskModal from "./EditTaskModal";

interface GanttChartProps {
  tasks: TaskType[];
  taskMap: Map<string, TaskType[]>;
  projectId: number;
}

export default function GanttChart({
  taskMap,
  tasks,
  projectId,
}: GanttChartProps) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<any[]>();

  const [modalVisibleStatus, setModalVisibleStatus] = useState({
    create: false,
    edit: false,
    delete: false,
  });
  const [selectedTaskIdFromGantt, setSelectedTaskIdFromGantt] = useState(0);

  useEffect(() => {
    const formattedData = Object.entries(taskMap)
      .map(([taskType, taskList], index) => {
        if (taskList.length > 0) {
          return {
            TaskID: index + 1,
            TaskName: taskType,
            subtasks: taskList.map((task: TaskType) => ({
              TaskID: task.id,
              TaskName: task.description,
              LabelName: task.taskLabel.label,
              StartDate: new Date(task.startDateString),
              EndDate: new Date(task.dueDateString),
              Progress: task.statusName == "Done" ? 100 : 0,
              Priority: task.priorityName,
              Assigned: task.assignedUser
                ? `${task.assignedUser.name} ${task.assignedUser.lastName}`
                : "None",
              Proficiency : task.assignedUser?.proficiencyLevelName,
              Status: task.statusName,
              Predecessor: task?.taskId?.toString() || "",
              TaskLevel: task.taskLevelName,
            })),
          };
        }
        return null;
      })
      .filter((task) => task !== null);

    setData(formattedData);
    setReady(true);
  }, [taskMap]);

  const taskFields: any = {
    id: "TaskID",
    name: "TaskName",
    label: "LabelName",
    status: "Status",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    child: "subtasks",
    priority: "Priority",
    assigned: "Assigned",
    proficiency: "Proficiency",
    dependency: "Predecessor",
    taskLevel: "TaskLevel",
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

  const handleRowDataBound = (args: any) => {
    const data = args.data;
    const row = args.row;

    const cells = row.getElementsByTagName("td");

    const taskLevelCell = cells[3];
    const priorityCell = cells[4]; 
    const proficiencyCell = cells[6]; 

    if (data.TaskLevel === "Beginner") {
      taskLevelCell.style.color = "#22c55e"; 
    } else if (data.TaskLevel === "Intermediate") {
      taskLevelCell.style.color = "#eab308"; 
    } else if (data.TaskLevel === "Expert") {
      taskLevelCell.style.color = "#ef4444";
    }

    if (data.Priority === "Low") {
      priorityCell.style.color = "#22c55e"; 
    } else if (data.Priority === "Medium") {
      priorityCell.style.color = "#eab308"; 
    } else if (data.Priority === "High" || data.Priority === "Critical") {
      priorityCell.style.color = "#ef4444"; 
    }

    if (data.Proficiency === "Junior") {
      proficiencyCell.style.color = "#22c55e"; 
    } else if (data.TaskLevel === "Mid") {
      proficiencyCell.style.color = "#eab308"; 
    } else if (data.TaskLevel === "Senior") {
      proficiencyCell.style.color = "#ef4444";
    }

  };

  const handleRowSelect = (args: any) => {
    const selectedTaskId = args.data.TaskID;

    setSelectedTaskIdFromGantt(selectedTaskId);
    setModalVisibleStatus((mv) => ({ ...mv, edit: true }));
  };

  return (
    <div className="control-pane">
      <div className="control-section">
        {modalVisibleStatus.edit && (
          <EditTaskModal
            {...{
              modalVisibleStatus,
              setModalVisibleStatus,
              projectId: projectId,
              tasks,
              selectedTaskIdFromGantt,
            }}
          />
        )}
        <GanttComponent
          id="Editing"
          dataSource={data}
          treeColumnIndex={1}
          taskFields={taskFields}
          labelSettings={labelSettings}
          height="800px"
          toolbar={toolbar}
          rowDataBound={handleRowDataBound}
          rowSelected={handleRowSelect}
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
            <ColumnDirective field="TaskLevel"></ColumnDirective>
            <ColumnDirective
              field="Priority"
              headerText="Priority"
              width="120"
            ></ColumnDirective>
            <ColumnDirective field="Assigned"></ColumnDirective>
            <ColumnDirective field="Proficiency"></ColumnDirective>
            <ColumnDirective field="Status"></ColumnDirective>
            <ColumnDirective field="Progress"></ColumnDirective>
            <ColumnDirective field="Duration"></ColumnDirective>
            <ColumnDirective field="StartDate"></ColumnDirective>
            <ColumnDirective field="EndDate"></ColumnDirective>
          </ColumnsDirective>
          <Inject services={[Selection, Toolbar]} />
        </GanttComponent>
      </div>
    </div>
  );
}
