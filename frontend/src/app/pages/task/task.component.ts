import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';
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
import { AssignDialogComponent } from '../../assign-dialog/assign-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [HttpClientModule, CommonModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatTooltipModule, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss', '../dashboard/dashboard.component.scss'],
  animations: [
    trigger('descriptionState', [
      state('visible', style({ height: '*', opacity: 1 })),
      state('hidden', style({ height: '0', opacity: 0 })),
      transition('visible <=> hidden', animate('300ms ease-in-out')),
    ]),
  ],
  providers: [TaskService, WebRequestService]
})
export class TaskComponent implements OnInit {
  public taskId: string = '';
  public title: string = '';
  public description: string = '';
  public status: string = '';
  public priority: string = '';
  public category: string = '';
  public due_date: Date | null = null;
  public owner: string = '';
  public assigned_to: string = '000000000000000000000000';
  public participants: string[] = [];
  public participantsNames: string[] = [];
  public attachments: string[] = [];
  public comments: string[] = [];
  public TaskData?: Task;
  public ownerName: string = '';
  public assignedName: string = '';
  private participantsNamesSet: Set<string> = new Set<string>();
  private participantsSet: Set<string> = new Set<string>();
  public userId = this.WebReqService.getUserDataFromToken()._id;
  editingDescription = false;
  editedDescription: string = '';
  countdown: string = '';
  private countdownSubscription!: Subscription;
  startAtDate: Date | null = null;
  descriptionState: 'visible' | 'hidden' = 'visible';
  sectionState: 'visible' | 'hidden' = 'visible';

  constructor(public TaskService: TaskService, public WebReqService: WebRequestService, private route: ActivatedRoute, private dialog: MatDialog, private fb: FormBuilder) {
    const paramMap: ParamMap = this.route.snapshot.paramMap;
    this.taskId = paramMap.get('taskId') || '';
    this.TaskData = {
      _id: this.taskId,
      title: 'title',
      priority: '',
      description: '',
      due_date: new Date(),
      owner: '',
      assigned_to: '000000000000000000000000',
      status: '',
      category: '',
      participants: [],
      comments: [],
      attachments: []
    };

  }


  ngOnInit() {
    this.getTask().subscribe((data: Task) => {
      this.TaskData = data;
      this.title = this.TaskData.title || '';
      this.participants = this.TaskData.participants || [];
      this.priority = this.TaskData.priority;
      this.status = this.TaskData.status || '';
      this.description = this.TaskData.description || '';
      this.due_date = this.TaskData.due_date || new Date();
      if (this.due_date) {
        this.startAtDate = this.due_date;
        this.countdownSubscription = interval(1000).subscribe(() => {
          this.updateCountdown();
        });
      }
      this.owner = this.TaskData.owner || '';
      this.assigned_to = this.TaskData.assigned_to || '';
      this.getUsername(this.owner).subscribe((data: User) => {
        this.ownerName = data.username;
        if (this.assigned_to != "000000000000000000000000") {
          this.getUsername(this.assigned_to).subscribe((data: User) => {
            this.assignedName = data.username;
            this.participantsNamesSet = new Set<string>(this.participantsNames);
            for (const participantId of this.participants) {
              this.getUsername(participantId).subscribe((data: User) => {
                const username = data.username;
                if (!this.participantsNamesSet.has(username)) {
                  this.participantsNames.push(username);
                  this.participantsNamesSet.add(username);
                }
              });
            }
          })
        }
        else {
          this.participantsNamesSet = new Set<string>(this.participantsNames);
          for (const participantId of this.participants) {
            this.getUsername(participantId).subscribe((data: User) => {
              const username = data.username;
              if (!this.participantsNamesSet.has(username)) {
                this.participantsNames.push(username);
                this.participantsNamesSet.add(username);
              }
            });
          }
        }
      });
    });
  }


  ngOnDestroy() {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }


  dateFilter = (date: Date): boolean => {
    return !date;
  };

  public getTask(): Observable<Task> {
    return this.TaskService.getTasksById(this.taskId);
  }

  public getUsername(id: String): Observable<User> {
    return this.WebReqService.getUser(id);
  }

  private getUserId(username: String): Observable<User> {
    return this.WebReqService.getUserId(username);
  }

  ParticipantsDialog() {

    const dialogRef = this.dialog.open(ParticipantsDialogComponent, {
      width: '700px',
      data: { participantsNames: this.participantsNames, ownerName: this.ownerName },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.TaskData) {
        this.participantsSet = new Set<string>();
        this.TaskData.participants = [];
        if (this.TaskData.assigned_to != '000000000000000000000000') {
          if (this.TaskData.assigned_to && !this.participantsNames.includes(this.TaskData.assigned_to)) {
            this.assignedName = "";
            this.assigned_to = '000000000000000000000000';
            this.TaskData.assigned_to = '000000000000000000000000';
          }
          for (const participantName of this.participantsNames) {
            this.getUserId(participantName).subscribe((data: any) => {
              if (!this.participantsSet.has(data._id)) {
                this.TaskData?.participants?.push(data._id);
                this.participantsSet.add(data._id);
              }
              this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
            })
          }
        }
        if (this.participantsNames.length == 0)
          this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      }
    });
  }




  AssignDialog() {
    const dialogRef = this.dialog.open(AssignDialogComponent, {
      width: '250px',
      data: { assignedName: this.assignedName, participantsNames: this.participantsNames },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assignedName = result.participant;
        if (this.assignedName) {
          this.getUserId(this.assignedName).subscribe((data: any) => {
            if (this.TaskData)
              this.TaskData.assigned_to = data._id;
            this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
          });
        }
        else {
          if (this.TaskData)
            this.TaskData.assigned_to = '000000000000000000000000';
          this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
        }
      }
    });
  }





  StatusDialog() {
    const dialogRef = this.dialog.open(StatusDialogComponent, {
      width: '250px',
      data: { status: this.status },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.TaskData) {
        this.status = result.status;
        this.TaskData.status = result.status;
        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      }
    });
  }

  PriorityDialog() {
    const dialogRef = this.dialog.open(PriorityDialogComponent, {
      width: '250px',
      data: { priority: this.priority },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.TaskData) {
        this.priority = result.priority;
        this.TaskData.priority = result.priority;
        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      }
    });
  }





  updateDueDate(newDate: Date | null) {
    this.due_date = newDate;
    //console.log('Due Date updated:', this.due_date);
    if (this.TaskData) {
      this.TaskData.due_date = this.due_date || new Date();
      this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
    }
  }

  DisableSelection(newDate: Date | null) {
    this.due_date = newDate;
    if (this.TaskData) {
      this.TaskData.due_date = this.due_date || new Date();
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

  updateCountdown() {
    if (this.due_date) {
      const now = new Date();
      const dueDate = new Date(this.due_date);
      const timeDifference = dueDate.getTime() - now.getTime();

      if (timeDifference <= 0) {
        this.countdown = 'Time expired';
      } else {
        const seconds = Math.floor(timeDifference / 1000) % 60;
        const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    } else {
      this.countdown = 'Due date not set';
    }
  }


  startEditing() {
    this.editingDescription = true;
    this.editedDescription = this.description;
    this.descriptionState = 'hidden';
  }

  openSection(): void {
    this.descriptionState = this.descriptionState === 'visible' ? 'hidden' : 'visible';
  }
  



  saveChanges() {
    this.descriptionState = 'visible'; 
    this.description = this.editedDescription;
    if (this.TaskData) {
      this.TaskData.description = this.description;
      this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
      this.editingDescription = false;
    }
  }

  cancelEditing() {
    this.editingDescription = false;
    this.descriptionState = 'visible';
  }





}