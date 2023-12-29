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
  public participants: string[] =[];
  public participantsNames: string[] =[];
  public attachments: string[] =[];
  public comments: string[] =[];
  public TaskData?: Task ;
  public ownerName: string = '';
  private participantsNamesSet: Set<string> = new Set<string>();
  private participantsSet: Set<string> = new Set<string>();
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
      this.owner = this.TaskData.owner || '';
      this.getUsername(this.owner).subscribe((data: User) =>{
        this.ownerName=data.username;
      })
    });

  }

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
    this.getTask().subscribe((data: Task) => {
      this.TaskData = data;
      this.title = this.TaskData.title || '';
      this.participants = this.TaskData.participants || [];
      this.owner = this.TaskData.owner || '';
      this.getUsername(this.owner).subscribe((data: User) =>{
        this.ownerName=data.username;  
        // if(this.participants.length>0){
        this.participantsNamesSet = new Set<string>(this.participantsNames);
          for (const participantId of this.participants) {
            this.getUsername(participantId).subscribe((data: User) => {
              const username = data.username;
              if (!this.participantsNamesSet.has(username)) {
                this.participantsNames.push(username);
                this.participantsNamesSet.add(username);}
                
              const dialogRef = this.dialog.open(ParticipantsDialogComponent, {
                width: '700px', 
                data: {participantsNames: this.participantsNames,ownerName: this.ownerName },
              });

              dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                  this.participantsSet = new Set<string>(this.participants);
                  for(const participantName of this.participantsNames){
                    this.getUserId(participantName).subscribe((data: any) =>{
                      if (!this.participantsSet.has(data._id)) {
                        this.participants.push(data._id);
                        this.participantsSet.add(data._id);
                      }
                      this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
                    })
                  }
                }
              });
            });
          }
        // }
      })
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