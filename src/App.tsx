import React from 'react';
import './App.css';
import { registerLicense } from '@syncfusion/ej2-base';
import { ScheduleComponent, Inject, Agenda, Day, Month, Week, WorkWeek, 
  EventSettingsModel, DragAndDrop, Resize, CellClickEventArgs } from '@syncfusion/ej2-react-schedule';
import { DataManager,WebApiAdaptor } from '@syncfusion/ej2-data';

import { TreeViewComponent, DragAndDropEventArgs} from '@syncfusion/ej2-react-navigations';

import { isJSDocReadonlyTag } from 'typescript';



// Registering Syncfusion license key
registerLicense('Mgo+DSMBaFt/QHRqVVhkVFpAaV5LQmFJfFBmRGlad1R1ckU3HVdTRHRcQl5hSX5SdU1mXnpdeHM=;Mgo+DSMBPh8sVXJ0S0J+XE9AflRGQmJAYVF2R2BJflRzfF9DZkwgOX1dQl9gSX1RdkViWndbd3FQRWc=;ORg4AjUWIQA/Gnt2VVhkQlFacldJWXxId0x0RWFab196d11MZVpBNQtUQF1hSn5QdEVjWHxWdXNQQGhb;MTM3NTE4MkAzMjMwMmUzNDJlMzBvTUVUMWwwN051Tlo0cUhQY1NMVG14bUY5b3ljODBMRFBYc2d1QW5QSmN3PQ==;MTM3NTE4M0AzMjMwMmUzNDJlMzBHOGFtb09tTzFTdmpUZ3U0RW5KakVwMWhNVVNkbERXYmVESkRpVzVJZGJvPQ==;NRAiBiAaIQQuGjN/V0Z+WE9EaFtKVmdWf1ppR2NbfE5xflZOallXVAciSV9jS31TdUdjWX5deHFSQGJVVg==;MTM3NTE4NUAzMjMwMmUzNDJlMzBGQTVRVmc4eENSakYrbi9ONlNtTDFNd0ZKOHBSQ2t5Si9rdHI3bjlsL0JNPQ==;MTM3NTE4NkAzMjMwMmUzNDJlMzBIQ3dsNUhqMVVHbHVIRmVEZ1JwWGRuOVlwZUZtYUlUbkZLaDhHT0VQRTVrPQ==;Mgo+DSMBMAY9C3t2VVhkQlFacldJWXxId0x0RWFab196d11MZVpBNQtUQF1hSn5QdEVjWHxWdXNSRmBb;MTM3NTE4OEAzMjMwMmUzNDJlMzBXSDc1ZW9BMnpwT0NveDhxVzdPMDhWKzlTMFRYNy9CUnl4QnYwM2F5ZkN3PQ==;MTM3NTE4OUAzMjMwMmUzNDJlMzBiT0F0VVh4K0RsdDFUZFAyL1hlamVOZ0dIcis4RW00eVBBa21wcXBYTURZPQ==;MTM3NTE5MEAzMjMwMmUzNDJlMzBGQTVRVmc4eENSakYrbi9ONlNtTDFNd0ZKOHBSQ2t5Si9rdHI3bjlsL0JNPQ==');


class App extends React.Component {

  public scheduleObj: ScheduleComponent;

  private localData = [{
      Id: 1,
      EndTime: new Date(2023, 2, 20, 6, 30),
      StartTime: new Date(2023, 2, 20, 4, 0),
      Subject:'Testing Guy',
      IsAllDay: true,
      ReccurrenceRule: 'FREQ=DAILY,INTERVAL=1,COUNT=10',
      Location: 'Norfolk State University'
      //IsReadonly: true, (Make event non-editable and remove CRUD operations)
      //IsBlock: true (block off time so no events can be added in time slot)
    },
    {
      Id: 2,
      EndTime: new Date(2023, 2, 21, 6, 30),
      StartTime: new Date(2023, 2, 21, 4, 0),
      Subject:'Testing James',
      IsAllDay: false,
      ReccurrenceRule: 'FREQ=DAILY,INTERVAL=1,COUNT=10',
      Location: 'Norfolk State University'
      //IsReadonly: true, (Make event non-editable and remove CRUD operations)
      //IsBlock: true (block off time so no events can be added in time slot)
    }];

  private treeViewData: {[key: string]: Object}[] = [

      {Id: 1, Title: 'Senior Project Work'},
      {Id: 2, Title: 'CyberSecurity Homework'},
      {Id: 3, Title: 'Research Tasks'},
      {Id: 4, Title: 'Zoom Meeting'},
      {Id: 5, Title: 'Software Engineering Project'}
  ];

  public field: Object = {dataSource: this.treeViewData, id:'Id', text: 'Title'}

  private remoteData = new DataManager({ //Events loaded into scheduler from external source USE THIS!!
    url: 'https://js.syncfusion.com/demos/ejservices/api/Schedule/LoadData', 
    adaptor: new WebApiAdaptor, 
    crossDomain: true 
  });



  //Allows me to drag pending tasks to calendar
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

    this.scheduleObj.addEvent(eventData);

  }
 
  
  render() {
    return (
      <div className='whole-app'>
      <div className='scheduler-component'>
      <ScheduleComponent currentView='Month' ref={schedule => this.scheduleObj = schedule as ScheduleComponent}
      eventSettings={{dataSource: this.localData}} selectedDate={new Date(2023, 2, 20)} > 
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]} />
      </ScheduleComponent>  
      </div>

      <div className='treeview-title-container'>Pending Assignments</div>
      <div className='treeview-component'>
        <TreeViewComponent className='inner-treeview-component' fields ={this.field} allowDragAndDrop={true}
        nodeDragStop={this.onTreeDragStop.bind(this)} />
      </div>
      </div>
    );
  }
}
   

export default App;