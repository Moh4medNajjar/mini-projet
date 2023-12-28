import { Component, OnInit} from '@angular/core';
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
@Component({
  selector: 'app-task',
  standalone: true,
  imports: [HttpClientModule],
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
  public owner: string ='';
  public participants: string[] =[''];
  public participantsNames: string[] =[''];
  public attachments: string[] =[''];
  public comments: string[] =[''];
  public TaskData?: Task ;
  public ownerName: string = '';


  constructor(public TaskService: TaskService, public WebReqService : WebRequestService, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit() {
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
    this.getTask().subscribe((data: Task) => {
      this.TaskData = data;
      this.title = this.TaskData.title || '';
      this.participants = this.TaskData.participants || [];
      this.owner = this.TaskData.owner || '';
      this.getUsername(this.owner).subscribe((data: User) =>{
      this.ownerName=data.username;
    })    });
    for (const participantId of this.participants) {
      this.getUsername(participantId).subscribe((data: User) => {
        this.participantsNames.push(data.username);
      });
    }
  }

  public getTask(): Observable<Task> {
    return this.TaskService.getTasksById(this.taskId);
  }

  public getUsername(id: String): Observable<User>{
    return this.WebReqService.getUser(id);
  }

  
  ParticipantsDialog(participants: String[]) {

    const dialogRef = this.dialog.open(ParticipantsDialogComponent, {
      width: '700px', 
      data: { participants },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.participants.push(result);
        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      }
    });
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