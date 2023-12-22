// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module'; // Ensure this import is present

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    // ... other components
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Ensure AppRoutingModule is imported here
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
