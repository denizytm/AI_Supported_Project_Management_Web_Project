"use client";

import { TaskType } from "@/types/taskType";
import {
  GanttComponent,
  EditDialogFieldsDirective,
  DayMarkers,
  EditDialogFieldDirective,
  Inject,
  Edit,
  Selection,
  Toolbar,
  ColumnsDirective,
  ColumnDirective,
  EventMarkersDirective,
  EventMarkerDirective,
} from "@syncfusion/ej2-react-gantt";
import { useEffect, useState } from "react";

interface GanttChartProps {
  taskMap: Map<string, TaskType[]>;
  taskTypes: string[];
}

export default function GanttChart2({ taskTypes, taskMap }: GanttChartProps) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<any[]>();

  useEffect(() => {
    if (taskTypes.length > 0 && taskMap.size > 0) {
      const formattedData = taskTypes
        .map((type,index) => {
          const taskData = taskMap.get(type);
          if (taskData?.length) {
            return {
              TaskID: index,
              TaskName: type,
              StartDate: new Date("04/02/2025"),
              EndDate: new Date("04/21/2025"),
              subtasks: taskData.map((task, index, array) => ({
                TaskID: task.id,
                TaskName: task.taskName,
                /* StartDate: new Date(task.dueDate), */
                Duration: 3,
                Progress: task.progress,
                Priority: task.priorityName,
                Assigned: task.assignedUser.name + " " + task.assignedUser.lastName,
                Status: task.statusName,
                Predecessor: index > 0 ? array[index - 1].id.toString() : "",  // Önceki task ID’sini bağlıyoruz
              })),
              
            };
          }
          return null;
        })
        .filter((task) => task !== null);

      setData(formattedData);
      setReady(true);
    }
  }, [taskMap, taskTypes]);

  let startDate: any;
  const taskFields: any = {
    id: "TaskID",
    name: "TaskName",
    startDate: "StartDate",
    endDate: "EndDate",
    duration: "Duration",
    progress: "Progress",
    dependency: "Predecessor",
    child: "subtasks",
    notes: "info",
    resourceInfo: "resources",
  };
  const resourceFields: any = {
    id: "resourceId",
    name: "resourceName",
  };
  const editSettings: any = {
    allowAdding: true,
    allowEditing: true,
    allowDeleting: true,
    allowTaskbarEditing: true,
    showDeleteConfirmDialog: true,
  };
  const customFn = (args: any) => {
    var endDate;
    var gantt = (document.getElementsByClassName("e-gantt")[0] as any)
      .ej2_instances[0];
    if (args.element && args.value) {
      endDate = new Date(args.value);
      if (!startDate && gantt.editModule.dialogModule["beforeOpenArgs"]) {
        startDate =
          gantt.editModule.dialogModule["beforeOpenArgs"].rowData[
            "ganttProperties"
          ].startDate;
        endDate =
          gantt.editModule.dialogModule["beforeOpenArgs"].rowData[
            "ganttProperties"
          ].endDate;
      }
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
    }
    return startDate <= endDate;
  };
  const actionbegin = (args: any) => {
    if (
      args.columnName === "EndDate" ||
      args.requestType === "beforeOpenAddDialog" ||
      args.requestType === "beforeOpenEditDialog"
    ) {
      startDate = args.rowData.ganttProperties.startDate;
    }
    if (
      args.requestType === "taskbarediting" &&
      args.taskBarEditAction === "ChildDrag"
    ) {
      startDate = args.data.ganttProperties.startDate;
    }
  };
  const splitterSettings: any = {
    position: "35%",
  };
  const projectStartDate: Date = new Date("01/01/2025");
  const projectEndDate: Date = new Date("01/01/2026");
  const gridLines: any = "Both";
  const toolbar: any = [
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
  const timelineSettings: any = {
    topTier: {
      unit: "Week",
      format: "MMM dd, y",
    },
    bottomTier: {
      unit: "Day",
    },
  };
  const labelSettings: any = {
    leftLabel: "TaskName",
    rightLabel: "resources",
  };
  const eventMarkerDay1: Date = new Date("4/17/2024");

  return (
    <div className="control-pane">
      <div className="control-section">
        <GanttComponent
          id="Editing"
          dataSource={data}
          dateFormat={"MMM dd, y"}
          treeColumnIndex={1}
          allowSelection={true}
          showColumnMenu={false}
          highlightWeekends={true}
          allowUnscheduledTasks={true}
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
          taskFields={taskFields}
          timelineSettings={timelineSettings}
          labelSettings={labelSettings}
          splitterSettings={splitterSettings}
          height="410px"
          editSettings={editSettings}
          gridLines={gridLines}
          toolbar={toolbar}
          resourceFields={resourceFields}
          actionBegin={actionbegin}
        >
          <ColumnsDirective>
            <ColumnDirective field="TaskID" width="80"></ColumnDirective>
            <ColumnDirective
              field="TaskName"
              headerText="Job Name"
              width="250"
              clipMode="EllipsisWithTooltip"
              validationRules={{
                required: true,
                minLength: [
                  5,
                  "Task name should have a minimum length of 5 characters",
                ],
              }}
            ></ColumnDirective>
            <ColumnDirective field="StartDate"></ColumnDirective>
            <ColumnDirective
              field="EndDate"
              validationRules={{
                date: true,
                required: [
                  customFn,
                  "Please enter a value greater than the start date.",
                ],
              }}
            ></ColumnDirective>
            <ColumnDirective
              field="Duration"
              validationRules={{ required: true }}
            ></ColumnDirective>
            <ColumnDirective
              field="Progress"
              validationRules={{ required: true, min: 0, max: 100 }}
            ></ColumnDirective>
            <ColumnDirective field="Predecessor"></ColumnDirective>
          </ColumnsDirective>
          <EditDialogFieldsDirective>
            <EditDialogFieldDirective
              type="General"
              headerText="General"
            ></EditDialogFieldDirective>
            <EditDialogFieldDirective type="Dependency"></EditDialogFieldDirective>
            <EditDialogFieldDirective type="Resources"></EditDialogFieldDirective>
            <EditDialogFieldDirective type="Notes"></EditDialogFieldDirective>
          </EditDialogFieldsDirective>
          <EventMarkersDirective>
            <EventMarkerDirective
              day={eventMarkerDay1}
              label="Project approval and kick-off"
            ></EventMarkerDirective>
          </EventMarkersDirective>
          <Inject services={[Edit, Selection, Toolbar, DayMarkers]} />
        </GanttComponent>
      </div>
    </div>
  );
}
