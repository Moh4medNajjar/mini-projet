import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TaskComponent } from './pages/task/task.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {path: "", component: SigninComponent},
  {path: "home", component: DashboardComponent},
  {path: "register", component: SignupComponent},
  {path: "login", component: SigninComponent},
  { path: "task/:taskId", component: TaskComponent },
];
