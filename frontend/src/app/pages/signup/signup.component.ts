import { Router } from '@angular/router';
import { WebRequestService } from './../../web-request.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, HttpClientModule,ReactiveFormsModule, CommonModule ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  providers: [WebRequestService]
})
export class SignupComponent implements OnInit {
  constructor(private WebRequestService: WebRequestService, private router: Router, private fb: FormBuilder ){}
  registrationForm: FormGroup | any;

  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      public: [false, Validators.requiredTrue], // Assuming it's a checkbox
    });
  }
  firstname: String="";
  lastname: String="";
  username: String =""
  email: String="";
  password: String="";
  repassword: String="";
  phone: String =""

  onRegister(){
    Object.keys(this.registrationForm.controls).forEach(controlName => {
      this.registrationForm.get(controlName).markAsTouched();
    });
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
