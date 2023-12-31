import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../task.service';
import { Task } from '../../task.model';
import { WebRequestService } from './../../web-request.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskDialogComponent } from '../../update-task-dialog/update-task-dialog.component';
import { NewTaskDialogComponent } from '../../new-task-dialog/new-task-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag, HttpClientModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [TaskService, WebRequestService]
})
export class DashboardComponent {
  public AllTasks: Task[] = [];
  public AllOwnedTasks: Task[] = [];
  public newTaskData: Task = {
    _id: undefined,
    title: '',
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

  public TaskData: Task = {
    _id: undefined,
    title: '',
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

  todo: Task[] = [];

  inProgress: Task[] = [];

  done: Task[] = [];

  participating: Task[] = [];

  searchedEmail: string = ""
  collaborators = [
    { username: 'MohamedNajjar', email: 'najjarmohamed443@gmail.com', image: '../../../assets/images/image.png' },

  ];

  constructor(public TaskService: TaskService, public WebReqService: WebRequestService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {

    this.getTasks();
    this.getPartTasks();
  }
  public getTasks(): void {
    this.todo = [];
    this.inProgress = [];
    this.done = [];
    this.AllTasks = [];
    this.AllOwnedTasks = [];
    const ownerId = this.WebReqService.getUserDataFromToken()._id;

    this.TaskService.getAllTasks(ownerId).subscribe((data: Task[]) => {
      this.AllOwnedTasks = data;

      if (this.AllOwnedTasks && Array.isArray(this.AllOwnedTasks)) {
        this.AllOwnedTasks.forEach((task: Task) => {
          switch (task.status) {
            case 'Todo':
              this.todo.push(task);
              break;
            case 'In Progress':
              this.inProgress.push(task);
              break;
            case 'Done':
              this.done.push(task);
              break;
          }

          // Add task participants to collaborators
          if (task.participants && Array.isArray(task.participants)) {
            task.participants.forEach((participant: any) => {
              // Assuming 'participant' has properties like 'username', 'email', 'image'
              // Modify the properties accordingly based on your actual data structure
              const collaborator = {
                username: participant.username,
                email: participant.email,
                image: participant.image
              };

              // Check if the collaborator is not already in the array
              if (!this.collaborators.some(c => c.email === collaborator.email)) {
                this.collaborators.push(collaborator);
              }
            });
          }
        });
      }
    });
  }

  public getPartTasks() {
    this.participating = [];
    this.AllTasks = [];
    const ownerId = this.WebReqService.getUserDataFromToken()._id;
    this.TaskService.getAllTasks().subscribe((data: Task[]) => {
      this.AllTasks = data;
      if (this.AllTasks && Array.isArray(this.AllTasks)) {
        this.AllTasks.forEach((task: Task) => {
          task.participants?.forEach((participant_id: string) => {
            if (participant_id == ownerId) {
              this.participating.push(task);
            }
          })
        });
      }
    });
  }




  public newTask() {
    this.newTaskData.status = 'Todo';
    this.newTaskData.owner = this.WebReqService.getUserDataFromToken()._id;
    this.TaskService.createTask(this.newTaskData).subscribe(
      (response) => {
        console.log('New task created:', response);
      },
      (error) => {
        console.error('Error creating task:', error);
      }
    );
    this.AllTasks.push(this.newTaskData);
    this.getTasks();
  }




  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const status = ['Todo', 'In Progress', 'Done'];
      const str = event.container.id;
      const match = str.match(/\d+/);
      if (match) {
        const numberAsStr = match[0];
        const numberAsInt = parseInt(numberAsStr, 10);


        let updatedTask = event.container.data[event.currentIndex];
        updatedTask.status = status[numberAsInt]

        console.log("new status :", updatedTask.status);
        this.updateTask(updatedTask._id, updatedTask);
      }
    }
  }


  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#FF7575';
      case 'medium':
        return '#FFD166';
      case 'low':
        return '#A3D9A5';
      default:
        return '#CCCCCC';
    }
  }

  // addCollaborator(){
  //   this.WebReqService.findCollab(this.searchedEmail).subscribe(
  //     (foundCollaborator) => {
  //       console.log("Found collaborator is " + foundCollaborator[0].firstName + " " + foundCollaborator[0]);
  //       this.collaborators.push(foundCollaborator);
  //       console.log(foundCollaborator.username)
  //     }
  //   )
  // }

  addCollaborator() {
    this.WebReqService.findCollab(this.searchedEmail).subscribe(
      (foundCollaborator) => {
        // console.log("Found collaborator is " + foundCollaborator[0].firstname + " " + foundCollaborator[0]);
        this.collaborators.push(foundCollaborator);
        console.log(foundCollaborator.username);
      },
      (error) => {
        console.error("Error finding collaborator:", error);
      }
    );
  }


  public unsubscribeTask(taskId: string): void {
    const userId = this.WebReqService.getUserDataFromToken()._id;
  
    this.TaskService.getTasksById(taskId).subscribe(
      (data: Task) => {
        this.TaskData = data;
  
        if (this.TaskData.participants) {
          const indexToRemove = this.TaskData.participants.findIndex((id) => id === userId);
          const indexToRemove1 = this.participating.findIndex((id) => id === userId);
          if (indexToRemove !== -1) {
            this.TaskData.participants.splice(indexToRemove, 1);
            this.participating.splice(indexToRemove1, 1);
          }
        }
  
        if (this.TaskData.assigned_to === userId) {
          this.TaskData.assigned_to = '000000000000000000000000';
        }
  
        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
        this.getTasks();
      },
      (error) => {
        console.error('Error getting task by ID:', error);
      }
    );
  }
  


  public deleteTask(taskId: string): void {
    this.TaskService.getTasksById(taskId).subscribe((data) => {
    this.TaskData = data; 
    this.TaskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Task deleted successfully');
        const indexToRemove = this.AllTasks.findIndex(task => task._id === this.TaskData._id);
        if (indexToRemove !== -1) {
          this.AllTasks.splice(indexToRemove, 1);
        }
        this.getPartTasks();
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );})
  }

  newTaskDialog() {

    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '700px',
      data: { newTaskData: this.newTaskData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newTask();
      }
    });
  }




  updateTaskDialog(task: Task) {
    let taskId = task._id;
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '700px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTask(taskId, result);
      }
    });
  }

  updateTask(taskId: string, updatedTask: Task) {
    this.TaskService.updateTask(taskId, updatedTask).subscribe(
      (response) => {
        console.log('Task updated:', response);
        this.getTasks();
      },
      (error) => {
        console.error('Error updating task:', error);
        // Handle error, display an error message, etc.
      }
    );
  }

  openTask(taskId: string) {
    this.router.navigate(['task', taskId]);
  }
}

