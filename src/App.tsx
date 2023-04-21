import React from "react";
import "./App.css";
import { registerLicense } from "@syncfusion/ej2-base";
import {
  ScheduleComponent,
  Inject,
  Agenda,
  Day,
  Month,
  Week,
  WorkWeek,
  EventSettingsModel,
  DragAndDrop,
  Resize,
  CellClickEventArgs,
  ActionEventArgs,
  RecurrenceEditorComponent,
} from "@syncfusion/ej2-react-schedule";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as dotenv from "dotenv";

dotenv.config();

import {
  TreeViewComponent,
  DragAndDropEventArgs,
} from "@syncfusion/ej2-react-navigations";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars";

//import {mysql} from 'mysql2';

import { isJSDocReadonlyTag } from "typescript";

// LOOK AT THIS!!!
import helper from "./support/helper"
let varfoo = helper.greet("i imported my helper class with method")

// Registering Syncfusion license key
let license: string = process.env.MYLICENSE;
registerLicense(license);

type AppState = {
  newTaskTitle: string;
  tasks: { [key: string]: Object }[];
  treeViewData: { [key: string]: Object }[];
  pendingTasksData: { [key: string]: any }[];
};

class App extends React.Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      newTaskTitle: "",
      tasks: [],
      treeViewData: [],
      pendingTasksData: [],
    };
  }
  public scheduleObj: ScheduleComponent;

  componentDidMount() {
    const addTaskBtn = document.getElementById("add-task-btn");
    if (addTaskBtn) {
      addTaskBtn.addEventListener("click", this.handleAddTaskClick);
    }

    const addEventBtn = document.getElementById("add-event-btn");
    if (addEventBtn) {
      addEventBtn.addEventListener("click", this.handleAddEventClick);
    }

    const organizeTasksBtn = document.getElementById("organize-tasks-btn");
    if (organizeTasksBtn) {
      organizeTasksBtn.addEventListener("click", this.handleOrganizeTasksClick);
    }
  }

  public localData = [
    {
      Id: 1,
      Subject: "Senior Seminar Course",
      StartTime: new Date(2023, 3, 3, 13, 0),
      EndTime: new Date(2023, 3, 3, 14, 0),
      IsAllDay: false,
      Importance: "Important",
      Location: "Norfolk State University",
      RecurrenceRule: "FREQ=DAILY;BYDAY=MO,WE;INTERVAL=1;COUNT=20",
      //IsBlock: true
    },
    {
      Id: 2,
      Subject: "Software Engineering Course",
      StartTime: new Date(2023, 3, 3, 13, 30),
      EndTime: new Date(2023, 3, 3, 15, 0),
      IsAllDay: false,
      Importance: "Highly Important",
      Location: "Norfolk State University",
      RecurrenceRule: "FREQ=DAILY;BYDAY=TU,TH;INTERVAL=1;COUNT=20",
    },
    {
      Id: 3,
      Subject: "Writing Course",
      StartTime: new Date(2023, 3, 3, 11, 0),
      EndTime: new Date(2023, 3, 3, 12, 0),
      IsAllDay: false,
      Importance: "Optional",
      Location: "Norfolk State University",
      RecurrenceRule: "FREQ=DAILY;BYDAY=MO,WE,FR;INTERVAL=1;COUNT=20",
    },
    {
      Id: 4,
      Subject: "Computer Arch Course",
      StartTime: new Date(2023, 3, 3, 16, 30),
      EndTime: new Date(2023, 3, 3, 18, 0),
      IsAllDay: false,
      Importance: "Optional",
      Location: "Norfolk State University",
      RecurrenceRule: "FREQ=DAILY;BYDAY=MO,WE;INTERVAL=1;COUNT=20",
    },
    {
      Id: 5,
      Subject: "Linear Algebra",
      StartTime: new Date(2023, 3, 3, 11, 0),
      EndTime: new Date(2023, 3, 3, 12, 30),
      IsAllDay: false,
      Importance: "Optional",
      Location: "Norfolk State University",
      RecurrenceRule: "FREQ=DAILY;BYDAY=TU,TH;INTERVAL=1;COUNT=20",
    },
    {
      Id: 6,
      Subject: "Survey Programming Course",
      StartTime: new Date(2023, 3, 3, 16, 30),
      EndTime: new Date(2023, 3, 3, 18, 0),
      IsAllDay: false,
      Importance: "Optional",
      Location: "Norfolk State University",
      RecurrenceRule: "FREQ=DAILY;BYDAY=TU,TH;INTERVAL=1;COUNT=20",
    },
    {
      Id: 7,
      Subject: "African Music Course",
      StartTime: new Date(2023, 3, 3, 13, 0),
      EndTime: new Date(2023, 3, 3, 15, 0),
      IsAllDay: false,
      Importance: "Optional",
      Location: "Online",
      RecurrenceRule: "FREQ=DAILY;BYDAY=FR;INTERVAL=1;COUNT=20",
    },
  ];

  private treeViewData: { [key: string]: Object }[] = [];

  public field: Object = {
    dataSource: this.treeViewData,
    id: "Id",
    text: "Title",
  };

  //PUBLIC DATE VARIABLES SO EACH TASK HAS DIFFERENT DATE
  public startCounter = 0;
  public endCounter = 1;
  public newStart = new Date();
  public newEnd = new Date();

  handleAddTaskClick = () => {
    const newTaskId = this.state.pendingTasksData.length + 1;

    const eventData = {
      Id: newTaskId,
      Subject: "",
      StartTime: this.newStart.setHours(new Date().getHours() + this.startCounter), //new Date(),
      EndTime: this.newEnd.setHours(new Date().getHours() + this.endCounter),
      Importance: "",
    };

    this.newStart = new Date(new Date().setHours(new Date().getHours() + this.startCounter));
    this.newEnd = new Date(new Date().setHours(new Date().getHours() + this.endCounter));

    this.startCounter++;
    this.endCounter++; 

    this.scheduleObj.openEditor(eventData, "Add", true);

    this.scheduleObj.actionBegin = (args: ActionEventArgs) => {
      if (args.requestType === "eventCreate" && Array.isArray(args.data)) {
        args.cancel = true;
        const task = {
          Id: newTaskId,
          Title: args.data[0].Subject,
          Importance: args.data[0].Importance,
          StartTime: args.data[0].StartTime,
          EndTime: args.data[0].EndTime,
          Location: args.data[0].Location,
          Description: args.data[0].Description,
          RecurrenceRule: args.data[0].RecurrenceRule //TEST
        };

        this.setState((prevState) => ({
          pendingTasksData: [...prevState.pendingTasksData, task],
        }));

        this.scheduleObj.closeEditor();
      }
    };
  };

  handleAddEventClick = () => {
    if (!this.scheduleObj) {
      setTimeout(this.handleAddEventClick, 100);
      return;
    }
    
    this.scheduleObj.openEditor({
      isModal: true,
      subject: "New Event",
      event: {
        StartTime: new Date(),
        EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      },
    }, 
    "Add"
    );
    //this.localData.push(event);
  }

  handleOrganizeTasksClick = () => {
    // Order tasks by importance
    //let orderedTasks = this.state.pendingTasksData
      /* .slice()
      .sort((a: any, b: any) => {
        let HIGH_PRIORITY = 3;
        let MEDIUM_PRIORITY = 2;
        let LOW_PRIORITY = 1;

        let aPriority =
          a.Importance === "Highly Important"
            ? HIGH_PRIORITY
            : a.Importance === "Important"
            ? MEDIUM_PRIORITY
            : a.Importance === "Regular"
            ? LOW_PRIORITY
            : 0;
        let bPriority =
          b.Importance === "Highly Important"
            ? HIGH_PRIORITY
            : b.Importance === "Important"
            ? MEDIUM_PRIORITY
            : b.Importance === "Regular"
            ? LOW_PRIORITY
            : 0;

        return bPriority - aPriority;
      }); */

    // Step 2: Sort tasks based on their importance
    let sortedTasks = this.state.pendingTasksData;
    //let tempTaskArray = sorting(sortedTasks);
    

   
      let A_importance = 0;
      let B_importance = 0;

    sortedTasks.forEach((task: any) => {

          for (let i = 0; i <= sortedTasks.length - 2; i++) {

            if (task.Importance === "Highly Important") {
              A_importance = 4;
            }
            else if (task.Importance === "Important") {
              A_importance = 3;
            }
            else if (task.Importance === "Regular") {
              A_importance = 2;
            }
            else {
              A_importance = 1;
            }

            console.log ("Value for A_Importance pass at [" + i + "] is " + A_importance + " and variable holds: " + JSON.stringify(task.Importance));
      
            if (task.Importance === "Highly Important") {
              B_importance = 4;
            }
            else if (task.Importance === "Important") {
              B_importance = 3;
            }
            else if (task.Importance === "Regular") {
              B_importance = 2;
            }
            else {
              B_importance = 1;
            }

            console.log ("Value for B_Importance pass at [" + i + "] is " + B_importance + " and variable holds: " + sortedTasks[i + 1].Importance);
              
            if (A_importance < B_importance){
          
              //Temp variables to hold start and end times of current task
              let tempStartTime = sortedTasks[i].StartTime;
              let tempEndTime = sortedTasks[i].EndTime;

              //Swap start time and end time of current task and task in next index
              sortedTasks[i].StartTime = sortedTasks[i + 1].StartTime;
              sortedTasks[i].EndTime = sortedTasks[i + 1].EndTime;

              //Swap start time and end time of TASK IN NEXT Index with CURRENT
              sortedTasks[i + 1].StartTime = tempStartTime;
              sortedTasks[i + 1].EndTime = tempEndTime;

              /* //SWAP INDEXES WITH CURRENT AND NEXT INDEX
              let tempTask = a[i];

              a[i] = a[i + 1];

              a[i + 1] = tempTask; */
            }
          }
      });

    /* function checkIfSorted(a: any): boolean {

      let A_importance = 0;
      let B_importance = 0;

      for (let i = 0; i < a.length - 2; i++) {



        //ASSIGN IMPORTANCE VALUE
        if (a[i].Importance === "Highly Important") {
          A_importance = 4;
        }
        else if (a[i].Importance === "Important") {
          A_importance = 3;
        }
        else if (a[i].Importance === "Regular") {
          A_importance = 2;
        }
        else {
          A_importance = 1;
        }
  
        if (a[i + 1].Importance === "Highly Important") {
          B_importance = 4;
        }
        else if (a[i + 1].Importance === "Important") {
          B_importance = 3;
        }
        else if (a[i + 1].Importance === "Regular") {
          B_importance = 2;
        }
        else {
          B_importance = 1;
        }



        // CHECK IF IMPORTANCE BETWEEN CURRENT ELEMENT AND NEXT ARE IN ORDER OR EQUAL
        if (A_importance > B_importance || A_importance === B_importance){
          //IF IN ORDER AND IS LAST INDEX COMPARISON, RETURN TRUE
          if((i+1) === (a.length - 2)){
            return true;
          }
          // ELSE CONTINUE CHECK OF TASK ARRAY
          else {
            continue;
          }
        }
        // IF COMPARISON OF IMPORTANCE FAILS, TASKS ARE NOT FULLY SORTED, RETURN FALSE
        else {
          return false;
        }
      }
        return false;
      } */ 

    // Step 3: Loop through sorted tasks and swap StartTime and EndTime fields based on StartTime
    /* for (let i = 0; i < sortedTasks.length - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < sortedTasks.length; j++) {
        if (sortedTasks[j].StartTime.getHours() < sortedTasks[minIndex].StartTime.getHours()) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        const tempStartTime = sortedTasks[i].StartTime;
        const tempEndTime = sortedTasks[i].EndTime;

        sortedTasks[i].StartTime = sortedTasks[minIndex].StartTime;
        sortedTasks[i].EndTime = sortedTasks[minIndex].EndTime;

        sortedTasks[minIndex].StartTime = tempStartTime;
        sortedTasks[minIndex].EndTime = tempEndTime;
      }
    } */

    //sortedTasks = tempTaskArray;
  
    // Calculate free time and add tasks to the calendar
    sortedTasks.forEach((task: any) => {
    
      // Find free time slot here and update StartTime and EndTime
      let event = {
        Id: this.localData.length + 1,
        Subject: task.Title,
        StartTime: task.StartTime,
        EndTime: task.EndTime, //+ counter,
        IsAllDay: false,
        Importance: task.Importance,
        RecurrenceRule: task.RecurrenceRule,
        Location: task.Location,
        Description: task.Description,
      };


      /* if (event.Importance === "Highly Important") {
        event.EndTime = event.StartTime.setHours(event.StartTime.getHours() + 1.5);
      }
      else if (event.Importance === "Important") {
        event.EndTime = event.StartTime.setHours(event.StartTime.getHours() + 1);
      }
      else if (event.Importance === "Regular") {
        event.EndTime = event.StartTime.setHours(event.StartTime.getHours() + 0.5);
      } */


      this.localData.push(event);
    });




    // Clear pending tasks
    this.setState({ pendingTasksData: [] });

    // Refresh the calendar
    //this.scheduleObj.refresh();
  };

  /* //Allows me to drag pending tasks to calendar
  public onTreeDragStop(args: DragAndDropEventArgs): void {

    //Gets details of cell square where item is dropped
    //Will return, start time, end time, and other information of cell
    let cellData: CellClickEventArgs = this.scheduleObj.getCellDetails(args.target);

    //Create event with retrieved data
    let eventData:{[key: string]: Object} = {
      Subject: args.draggedNodeData.text,
      StartTime: cellData.startTime,
      EndTime: cellData.endTime,
      IsAllDay: cellData.isAllDay
    }

    //this.scheduleObj.openEditor(eventData,"Add",true);
    this.scheduleObj.addEvent(eventData);

  } */

  private editorWindowTemplate(props: any): JSX.Element {
    return (
      <table className="custom-event-editor">
        <tbody>
          <tr>
            <td className="e-textlabel">Subject</td>
            <td>
              <input
                id="Subject"
                className="e-field e-input"
                name="Subject"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Importance</td>
            <td>
              <DropDownListComponent
                id="EventType"
                dataSource={["Highly Important", "Important", "Regular"]}
                className="e-field"
                placeholder="Choose option"
                data-name="EventType"
                value={props.EventType || null}
              ></DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Start Time</td>
            <td>
              <DateTimePickerComponent
                id="StartTime"
                data-name="StartTime"
                className="e-field"
                value={new Date(props.startTime || props.StartTime)}
                format="dd/MM/yy hh:mm a"
              ></DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">End Time</td>
            <td>
              <DateTimePickerComponent
                id="EndTime"
                data-name="EndTime"
                className="e-field"
                value={new Date(props.endTime || props.EndTime)}
                format="dd/MM/yy hh:mm a"
              ></DateTimePickerComponent>
            </td>
          </tr>
          {/* <tr>
            <td className="e-textlabel">Recurrence</td>
            <td>
            <RecurrenceEditorComponent id="Recurrence" data-name="recurrenceRule"
            className="e-field" value={props.RecurrenceRule || props.recurrenceRule} form='FREQ=;INTERVAL=;COUNT=;'>
            </RecurrenceEditorComponent>
            </td>
          </tr> */}
          <tr>
            <td className="e-textlabel">Location</td>
            <td>
              <input
                id="Location"
                className="e-field e-input"
                name="Location"
                type="text"
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Description</td>
            <td>
              <textarea
                id="Description"
                className="e-field e-input"
                name="Description"
                rows={3}
                cols={50}
                style={{
                  width: "100%",
                  height: "30px !important",
                  resize: "vertical",
                }}
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className="whole-app">
        <div className="scheduler-component">
          <ScheduleComponent
            currentView="Month"
            ref={(schedule) =>
              (this.scheduleObj = schedule as ScheduleComponent)
            }
            eventSettings={{ dataSource: this.localData }}
            selectedDate={new Date()}
            views={["Day", "Week", "Month", "Agenda"]}
            editorTemplate={this.editorWindowTemplate.bind(this)}
          >
            <Inject
              services={[
                Day,
                Week,
                WorkWeek,
                Month,
                Agenda,
                DragAndDrop,
                Resize,
              ]}
            />
          </ScheduleComponent>
        </div>
        <div className="treeview-title-container">Pending Assignments</div>
        <div className="treeview-component">
          <TreeViewComponent
            className="inner-treeview-component"
            fields={{
              dataSource: [
                {
                  Id: "1",
                  Title: "       ",
                  expanded: true,
                  items: this.state.pendingTasksData,
                },
              ],
              id: "Id",
              text: "Title",
              child: "items",
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
