import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:3000/tasks';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, task);
  }

  updateTask(id: string, task: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  assignTask(taskId: string, assigneeId: string): Observable<any> {
    const update = { assigneeId };
    return this.http.put<any>(`${this.baseUrl}/${taskId}/assignTask`, update);
  }

  addParticipants(taskId: string, participants: any[]): Observable<any> {
    const update = { participants };
    return this.http.put<any>(`${this.baseUrl}/${taskId}/addParticipants`, update);
  }
}
