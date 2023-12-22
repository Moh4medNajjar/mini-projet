import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task',
  template: `
    <h2>Task List</h2>
    <ul>
      <li *ngFor="let task of tasks">{{ task.title }}</li>
    </ul>

    <div>
      <h3>Create New Task</h3>
      <form (submit)="onCreateTask()">
        <label>Title: </label>
        <input type="text" [(ngModel)]="newTask.title" required>

        <label>Description: </label>
        <textarea [(ngModel)]="newTask.description"></textarea>

        <!-- Add more input fields for other task properties -->

        <button type="submit">Create Task</button>
      </form>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasks: any[] = []; // Initialize the property here

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe((tasks) => (this.tasks = tasks));
  }

  onCreateTask(): void {
    this.taskService.createTask(this.newTask).subscribe(() => {
      // Refresh the task list after creating a new task
      this.loadTasks();

      // Clear the form fields
      this.newTask = {};
    });
  }
}
