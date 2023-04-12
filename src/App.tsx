import React from 'react';
import './App.css';
import { registerLicense } from '@syncfusion/ej2-base';
import { ScheduleComponent, Inject, Agenda, Day, Month, Week, WorkWeek, 
  EventSettingsModel, DragAndDrop, Resize, CellClickEventArgs, ActionEventArgs, RecurrenceEditorComponent } from '@syncfusion/ej2-react-schedule';
import { DataManager,WebApiAdaptor } from '@syncfusion/ej2-data';

import { TreeViewComponent, DragAndDropEventArgs} from '@syncfusion/ej2-react-navigations';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';

//import {mysql} from 'mysql2';


import { isJSDocReadonlyTag } from 'typescript';


// Registering Syncfusion license key
registerLicense('Mgo+DSMBaFt/QHRqVVhkVFpAaV5LQmFJfFBmRGlad1R1ckU3HVdTRHRcQl5hSX5SdU1mXnpdeHM=;Mgo+DSMBPh8sVXJ0S0J+XE9AflRGQmJAYVF2R2BJflRzfF9DZkwgOX1dQl9gSX1RdkViWndbd3FQRWc=;ORg4AjUWIQA/Gnt2VVhkQlFacldJWXxId0x0RWFab196d11MZVpBNQtUQF1hSn5QdEVjWHxWdXNQQGhb;MTM3NTE4MkAzMjMwMmUzNDJlMzBvTUVUMWwwN051Tlo0cUhQY1NMVG14bUY5b3ljODBMRFBYc2d1QW5QSmN3PQ==;MTM3NTE4M0AzMjMwMmUzNDJlMzBHOGFtb09tTzFTdmpUZ3U0RW5KakVwMWhNVVNkbERXYmVESkRpVzVJZGJvPQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmdWf1ppR2NbfE5xflZOallXVAciSV9jS31TdUdjWX5deHFSQGJVVg==;MTM3NTE4NUAzMjMwMmUzNDJlMzBGQTVRVmc4eENSakYrbi9ONlNtTDFNd0ZKOHBSQ2t5Si9rdHI3bjlsL0JNPQ==;MTM3NTE4NkAzMjMwMmUzNDJlMzBIQ3dsNUhqMVVHbHVIRmVEZ1JwWGRuOVlwZUZtYUlUbkZLaDhHT0VQRTVrPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJWXxId0x0RWFab196d11MZVpBNQtUQF1hSn5QdEVjWHxWdXNSRmBb;MTM3NTE4OEAzMjMwMmUzNDJlMzBXSDc1ZW9BMnpwT0NveDhxVzdPMDhWKzlTMFRYNy9CUnl4QnYwM2F5ZkN3PQ==;MTM3NTE4OUAzMjMwMmUzNDJlMzBiT0F0VVh4K0RsdDFUZFAyL1hlamVOZ0dIcis4RW00eVBBa21wcXBYTURZPQ==;MTM3NTE5MEAzMjMwMmUzNDJlMzBGQTVRVmc4eENSakYrbi9ONlNtTDFNd0ZKOHBSQ2t5Si9rdHI3bjlsL0JNPQ==');
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
      newTaskTitle: '',
      tasks: [],
      treeViewData: [],
      pendingTasksData: []
    };
  }
  public scheduleObj: ScheduleComponent;
  

  componentDidMount() 
  
  {
  const addTaskBtn = document.getElementById('add-task-btn');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', this.handleAddTaskClick);
    }
  
    const addEventBtn = document.getElementById('add-event-btn');
    if (addEventBtn) {
      addEventBtn.addEventListener('click', this.handleAddEventClick);
    }
  
    const organizeTasksBtn = document.getElementById('organize-tasks-btn');
    if (organizeTasksBtn) {
      organizeTasksBtn.addEventListener('click', this.handleOrganizeTasksClick);
    }
  }
  
  organizeTasks(tasks: { [key: string]: any }[]) {
    const HIGH_PRIORITY = 3;
    const MEDIUM_PRIORITY = 2;
    const LOW_PRIORITY = 1;
    return tasks
      .sort((a, b) => {
        const aDueDate = new Date(a.due_date);
        const bDueDate = new Date(b.due_date);
        const aPriority =
          a.priority_level === "Highly Important"
            ? HIGH_PRIORITY
            : a.priority_level === "Important"
            ? MEDIUM_PRIORITY
            : a.priority_level === "Regular"
            ? LOW_PRIORITY
            : 0;
        const bPriority =
          b.priority_level === "Highly Important"
            ? HIGH_PRIORITY
            : b.priority_level === "Important"
            ? MEDIUM_PRIORITY
            : b.priority_level === "Regular"
            ? LOW_PRIORITY
            : 0;
        if (aPriority > bPriority) {
          return -1;
        }
        if (aPriority < bPriority) {
          return 1;
        }
        if (aDueDate < bDueDate) {
          return -1;
        }
        if (aDueDate > bDueDate) {
          return 1;
        }
        return 0;
      });
  }
  

    
  
    private localData = [
      {
        Id: 1,
        Subject: 'Senior Seminar Course',
        StartTime: new Date(2023, 3, 3, 13, 0),
        EndTime: new Date(2023, 3, 3, 14, 0),
        IsAllDay: false,
        Importance: 'Important',
        Location: "Norfolk State University",
        RecurrenceRule: 'FREQ=DAILY;BYDAY=MO,WE;INTERVAL=1;COUNT=20',
        //IsBlock: true
      },
      {
        Id: 2,
        Subject: 'Software Engineering Course',
        StartTime: new Date(2023, 3, 3, 13, 30),
        EndTime: new Date(2023, 3, 3, 15, 0),
        IsAllDay: false,
        Importance: 'Highly Important',
        Location: "Norfolk State University",
        RecurrenceRule: 'FREQ=DAILY;BYDAY=TU,TH;INTERVAL=1;COUNT=20',
      },
      {
        Id: 3,
        Subject: 'Writing Course',
        StartTime: new Date(2023, 3, 3, 11, 0),
        EndTime: new Date(2023, 3, 3, 12, 0),
        IsAllDay: false,
        Importance: 'Optional',
        Location: "Norfolk State University",
        RecurrenceRule: 'FREQ=DAILY;BYDAY=MO,WE,FR;INTERVAL=1;COUNT=20',
      },
      {
        Id: 4,
        Subject: 'Computer Arch Course',
        StartTime: new Date(2023, 3, 3, 16, 30),
        EndTime: new Date(2023, 3, 3, 18, 0),
        IsAllDay: false,
        Importance: 'Optional',
        Location: "Norfolk State University",
        RecurrenceRule: 'FREQ=DAILY;BYDAY=MO,WE;INTERVAL=1;COUNT=20',
      },
      {
        Id: 5,
        Subject: 'Linear Algebra',
        StartTime: new Date(2023, 3, 3, 11, 0),
        EndTime: new Date(2023, 3, 3, 12, 30),
        IsAllDay: false,
        Importance: 'Optional',
        Location: "Norfolk State University",
        RecurrenceRule: 'FREQ=DAILY;BYDAY=TU,TH;INTERVAL=1;COUNT=20',
      },
      {
        Id: 6,
        Subject: 'Survey Programming Course',
        StartTime: new Date(2023, 3, 3, 16, 30),
        EndTime: new Date(2023, 3, 3, 18, 0),
        IsAllDay: false,
        Importance: 'Optional',
        Location: "Norfolk State University",
        RecurrenceRule: 'FREQ=DAILY;BYDAY=TU,TH;INTERVAL=1;COUNT=20',
      },
      {
        Id: 7,
        Subject: 'African Music Course',
        StartTime: new Date(2023, 3, 3, 13, 0),
        EndTime: new Date(2023, 3, 3, 15, 0),
        IsAllDay: false,
        Importance: 'Optional',
        Location: "Online",
        RecurrenceRule: 'FREQ=DAILY;BYDAY=FR;INTERVAL=1;COUNT=20',
      }
    ];


  private treeViewData: { [key: string]: Object }[] = [
   
  ];
     
  public field: Object = {dataSource: this.treeViewData, id:'Id', text: 'Title'}


  handleAddTaskClick = () => {
    const newTaskId = this.state.pendingTasksData.length + 1;
  
    const eventData = {
      Id: newTaskId,
      Subject: "",
      StartTime: new Date(),
      EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
      Importance: "",
    };
  
    this.scheduleObj.openEditor(eventData, "Add", true);
  
    this.scheduleObj.actionBegin = (args: ActionEventArgs) => {
      if (args.requestType === "eventCreate" && Array.isArray(args.data)) {
        args.cancel = true;
        const task = {
          Id: newTaskId,
          Title: args.data[0].Subject,
          Importance: args.data[0].Importance,
          //recurrenceRule: args.data[0].RecurrenceRule //TEST
        };
  
        this.setState((prevState) => ({
          pendingTasksData: [
            ...prevState.pendingTasksData,
            task,
          ],
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

    this.scheduleObj.openEditor(
      {
        isModal: true,
        subject: 'New Event',
        event: {
          StartTime: new Date(),
          EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
          IsBlock: true,
        },
      },
      'Add'
    );
  };

  
  

  handleOrganizeTasksClick = () => {
    // Order tasks by importance
    const orderedTasks = this.state.pendingTasksData.slice().sort((a: any, b: any) => {
      const HIGH_PRIORITY = 3;
      const MEDIUM_PRIORITY = 2;
      const LOW_PRIORITY = 1;
  
      const aPriority =
        a.importance === "Highly Important"
          ? HIGH_PRIORITY
          : a.importance === "Important"
          ? MEDIUM_PRIORITY
          : a.importance === "Regular"
          ? LOW_PRIORITY
          : 0;
      const bPriority =
        b.importance === "Highly Important"
          ? HIGH_PRIORITY
          : b.importance === "Important"
          ? MEDIUM_PRIORITY
          : b.importance === "Regular"
          ? LOW_PRIORITY
          : 0;
  
      return bPriority - aPriority;
    });

    /* orderedTasks.forEach((task: any) => {

          const event = {
            Id: this.localData.length + 1,
            Subject: task.Title,
            StartTime: new Date(),
            EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
            IsAllDay: false,
            Importance: task.importance,
          };

          let eventStartTime = new Date(task.StartTime).setHours(task.StartTime.getHours());
          let cellDetails = this.scheduleObj.getCellDetails(task.StartTime);
  
          while (!cellDetails || cellDetails && ((event) => new Date(event.startTime).setHours(event.startTime.getHours()) === eventStartTime)(cellDetails)) {
            eventStartTime += 60 * 60 * 1000; // Increase by 1 hour
            task.StartTime = new Date(eventStartTime);
            cellDetails = this.scheduleObj.getCellDetails(task.StartTime);
          }
  
          switch (task.importance) {
            case 'Highly Important':
              task.EndTime = new Date(task.StartTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours
              break;
            case 'Important':
              task.EndTime = new Date(task.StartTime.getTime() + 1 * 60 * 60 * 1000); // 1 hour
              break;
            case 'Regular':
            default:
              task.EndTime = new Date(task.StartTime.getTime() + 30 * 60 * 1000); // 30 minutes
              break;
          }


          this.localData.push(event);
        }); */


    
    
  
    // Calculate free time and add tasks to the calendar
    orderedTasks.forEach((task: any) => {
      // Find free time slot here and update StartTime and EndTime
      const event = {
        Id: this.localData.length + 1,
        Subject: task.Title,
        StartTime: new Date(),
        EndTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        IsAllDay: false,
        Importance: task.Importance,
        RecurrenceRule: '',
        Location: '',
        Description: ''
      };

      this.localData.push(event);
    });
  
    // Clear pending tasks
    this.setState({ pendingTasksData: [] });

  
    // Refresh the calendar
    this.scheduleObj.refresh();
  }
  
  


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
    
      <table className='custom-event-editor'>
        <tbody>
          <tr>
            <td className='e-textlabel'>Subject</td>
            <td><input id="Subject" className="e-field e-input" name="Subject" type="text"/></td>
          </tr>
          <tr>
            <td className='e-textlabel'>Importance</td>
            <td>
              <DropDownListComponent id="EventType" dataSource={['Highly Important', 'Important', 'Regular']}
            className="e-field" placeholder='Choose option' data-name="EventType" value={props.EventType || null}>
            </DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Start Time</td>
            <td>
              <DateTimePickerComponent id="StartTime" data-name="StartTime"
              className="e-field" value={new Date(props.startTime || props.StartTime)} format='dd/MM/yy hh:mm a'>
              </DateTimePickerComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">End Time</td>
            <td>
            <DateTimePickerComponent id="EndTime" data-name="EndTime"
            className="e-field" value={new Date(props.endTime || props.EndTime)}  format='dd/MM/yy hh:mm a'>
            </DateTimePickerComponent>
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
            <td><input id="Location" className="e-field e-input" name="Location" type="text" /></td>
          </tr>
          <tr>
            <td className="e-textlabel">Description</td>
            <td><textarea id="Description" className="e-field e-input" name="Description" rows={3} cols={50}
            style={{width: '100%', height:'30px !important', resize: 'vertical'}}></textarea></td>
          </tr>
        </tbody>

      </table>
      );
  }
 
  
  render() {
    return (

      <div className='whole-app'>
      <div className='scheduler-component'>
      <ScheduleComponent currentView='Month' ref={schedule => this.scheduleObj = schedule as ScheduleComponent}
      eventSettings={{dataSource: this.localData}} selectedDate={new Date()} views={['Day','Week','Month','Agenda']}
       editorTemplate={this.editorWindowTemplate.bind(this)}> 
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]} />
      </ScheduleComponent>  
      </div>
      <div className='treeview-title-container'>Pending Assignments</div>
      <div className='treeview-component'>
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