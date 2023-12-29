import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {

  constructor(private http: HttpClient) { }

  registerUser(data: any):Observable<any>{
    return this.http.post('http://127.0.0.1:3000/user/register', data)
  }

  loginUser(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/user/login', data)
  }

  getUser(id: String): Observable<any> {
    return this.http.get(`http://127.0.0.1:3000/user/getbyid/${id}`)
  }

  getUserId(username: String): Observable<any> {
    return this.http.get(`http://127.0.0.1:3000/user/getbyname/${username}`)
  }

  findCollab(email: String): Observable<any>{
    return this.http.get(`http://127.0.0.1:3000/user/getbyemail/${email}`)
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://127.0.0.1:3000/user/all`);
  }
  

  getUserDataFromToken(){
    const token = localStorage.getItem('token')
    if (!token) {
      console.log("Token not found")
    } else {
      try{
        let data = JSON.parse(window.atob(token.split('.')[1]))
       // console.log(data)
        return data
      } catch (error) {
        console.error('Error parsing token:', error);
     }
    }
  }


}
