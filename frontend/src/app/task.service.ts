import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './task.model';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/task';

  constructor(private http: HttpClient) {}

  getAllTasks(ownerId?: string): Observable<any[]> {
    const url = ownerId ? `${this.baseUrl}/all/${ownerId}` : `${this.baseUrl}/all`;
    return this.http.get<any[]>(url);
  }
  
  getTasksById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/add`, task);
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/update/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
}
