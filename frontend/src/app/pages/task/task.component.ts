import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { TaskService } from '../../task.service';
import { Task } from '../../task.model';
import { User } from '../../user.model';
import { WebRequestService } from './../../web-request.service';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ParticipantsDialogComponent } from '../../participants-dialog/participants-dialog.component'; 
import { StatusDialogComponent } from '../../status-dialog/status-dialog.component'; 
import { PriorityDialogComponent } from '../../priority-dialog/priority-dialog.component'; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatTooltipModule, MatInputModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss','../dashboard/dashboard.component.scss'],
  providers: [TaskService, WebRequestService]
})
export class TaskComponent implements OnInit {
  public taskId: string = '';
  public title: string = '';
  public description: string ='';
  public status: string ='';
  public priority: string ='';
  public category: string ='';
  public due_date:  Date | null = null;
  public owner: string ='';
  public participants: string[] =[];
  public participantsNames: string[] =[];
  public attachments: string[] =[];
  public comments: string[] =[];
  public TaskData?: Task ;
  public ownerName: string = '';
  private participantsNamesSet: Set<string> = new Set<string>();
  private participantsSet: Set<string> = new Set<string>();
  startAtDate: Date | null = null;
  constructor(public TaskService: TaskService, public WebReqService : WebRequestService, private route: ActivatedRoute, private dialog: MatDialog) {
    const paramMap: ParamMap = this.route.snapshot.paramMap;
    this.taskId = paramMap.get('taskId') || '';
    this.TaskData = {
      _id: this.taskId,
      title: 'title',
      priority: '',
      description: '',
      due_date: new Date(),
      owner: '',
      status: '',
      category: '',
      participants: [],
      comments: [],
      attachments: []
    };

  }
  

  ngOnInit(){
    this.getTask().subscribe((data: Task) => {
      this.TaskData = data;
      this.title = this.TaskData.title || '';
      this.participants = this.TaskData.participants || [];
      this.priority = this.TaskData.priority;
      this.status = this.TaskData.status || '';
      this.due_date = this.TaskData.due_date || new Date();
      if (this.due_date) {

        this.startAtDate = this.due_date;
      }
      this.owner = this.TaskData.owner || '';
      this.getUsername(this.owner).subscribe((data: User) =>{
        this.ownerName=data.username;
        this.participantsNamesSet = new Set<string>(this.participantsNames);
        for (const participantId of this.participants) {
          this.getUsername(participantId).subscribe((data: User) => {
            const username = data.username;
            if (!this.participantsNamesSet.has(username)) {
              this.participantsNames.push(username);
              this.participantsNamesSet.add(username);}
          });
        }
      })
    });
  }
  

  dateFilter = (date: Date): boolean => {
    return !date ;
  };

  public getTask(): Observable<Task> {
    return this.TaskService.getTasksById(this.taskId);
  }

  public getUsername(id: String): Observable<User>{
    return this.WebReqService.getUser(id);
  }

  private getUserId(username: String): Observable<User>{
    return this.WebReqService.getUserId(username);
  }

  ParticipantsDialog() {
    
    const dialogRef = this.dialog.open(ParticipantsDialogComponent, {
      width: '700px', 
      data: {participantsNames: this.participantsNames,ownerName: this.ownerName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.TaskData) {
        this.participantsSet = new Set<string>();
        this.TaskData.participants = [];
        for(const participantName of this.participantsNames){
          this.getUserId(participantName).subscribe((data: any) =>{
            if (!this.participantsSet.has(data._id)) {
              this.TaskData?.participants?.push(data._id);
              this.participantsSet.add(data._id);
            }
            this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
          })
        }
        if(this.participantsNames.length == 0)
          this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      }
    });
  }

  StatusDialog() {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '250px', 
      data: {status: this.status},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.TaskData) {
        this.status = result.status;
        this.TaskData.status= result.status;
        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      }
    });
  }

  PriorityDialog() {
    const dialogRef = this.dialog.open(PriorityDialogComponent, {
      width: '250px', 
      data: {priority: this.priority},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.TaskData) {
        this.priority = result.priority;
        this.TaskData.priority= result.priority;
        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      }
    });
  }

  updateDueDate(newDate: Date | null) {
    this.due_date = newDate;
    //console.log('Due Date updated:', this.due_date);
    if(this.TaskData){
      this.TaskData.due_date= this.due_date || new Date();
      this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
  }
  }

  updateTask(taskId: string, updatedTask: Task) {
    this.TaskService.updateTask(taskId, updatedTask).subscribe(
      (response) => {
        console.log('Task updated:', response);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

}