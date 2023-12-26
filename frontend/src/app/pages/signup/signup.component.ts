import { Router } from '@angular/router';
import { WebRequestService } from './../../web-request.service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [WebRequestService]
})
export class SignupComponent {
  constructor(private WebRequestService: WebRequestService, private router: Router ){}

  firstname: String="";
  lastname: String="";
  username: String =""
  email: String="";
  password: String="";
  repassword: String="";
  phone: String =""

  onRegister(){
    const newUserData = {
      firstname: this.firstname,
      lastname: this.lastname,
      username: this.username,
      email: this.email,
      password: this.password
    }

    this.WebRequestService.registerUser(newUserData).subscribe(() => {
      alert("Account successfully created !");
      this.router.navigate(['/']);
      this.firstname = ""
      this.lastname = ""
      this.email = ""
      this.username = ""
      this.password = ""
    },
    (err) => {
      console.log(newUserData)
      console.log("Account creation failed !");
      console.log(err);
    })
  }


}
