import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {path: "", component: DashboardComponent},
  {path: "register", component: SignupComponent},
  {path: "login", component: SigninComponent},
];
