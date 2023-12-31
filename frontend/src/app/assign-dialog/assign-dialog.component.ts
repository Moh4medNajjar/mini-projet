import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule ,FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { User } from '../user.model';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import { WebRequestService } from './../web-request.service';
import { HttpClientModule } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';

@Component({
  selector: 'app-assign-dialog',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatChipsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './assign-dialog.component.html',
  styleUrl: './assign-dialog.component.scss',
  providers: [WebRequestService]
})
export class AssignDialogComponent {

  assignForm: FormGroup;
  public allusers: string[] = [];
  
  constructor(public WebReqService : WebRequestService,
    private dialogRef: MatDialogRef<AssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {assignedName: string, participantsNames: string[] },
    private fb: FormBuilder,
  ) {
    this.allusers = this.data.participantsNames;
    console.log(this.data.assignedName);
    this.assignForm = this.fb.group({
      participant: [this.data.assignedName],
    });



  }





  save() {
    if (this.assignForm.valid) {
      this.dialogRef.close(this.assignForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
