import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-list',
  template: `
    <h2>Task List</h2>
    <ul>
      <li *ngFor="let task of tasks">{{ task.title }}</li>
    </ul>
  `,
})
export class TaskListComponent implements OnInit {
  tasks: any[] = []; // Initialize the property here

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((tasks) => (this.tasks = tasks));
  }
}
