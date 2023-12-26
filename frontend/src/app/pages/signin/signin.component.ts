import { WebRequestService } from './../../web-request.service';
import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  providers: [WebRequestService]
})
export class SigninComponent {
  constructor(private WebRequestService: WebRequestService, private router: Router){}
  email: String = ""
  password: String = ""

  token: any
  onLogin() {
    const existantUserData = {
      email: this.email,
      password: this.password
    };

    this.WebRequestService.loginUser(existantUserData).subscribe(
      (res: any) => {
        this.token = res;
        if (this.token && this.token.token) {
          localStorage.setItem('token', this.token.token);
          alert('Successfully connected! Welcome to the dashboard!');
          this.router.navigate(['/home']);
        }
      },
      (err: any) => {
        console.log('Login failed!');
        console.log(err);
      }
    );
  }

}
