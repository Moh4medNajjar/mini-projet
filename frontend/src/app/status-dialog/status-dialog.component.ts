import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ReactiveFormsModule ,FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
@Component({
  selector: 'app-status-dialog',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatChipsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './status-dialog.component.html',
  styleUrl: './status-dialog.component.scss'
})
export class StatusDialogComponent {
  updateStatusForm: FormGroup;
  statuses = ['Todo', 'In Progress', 'Done'];

  constructor(
    private dialogRef: MatDialogRef<StatusDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { status: String },
    private fb: FormBuilder,
  ) {
    this.updateStatusForm = this.fb.group({
      status: [this.data.status, Validators.required],
    });


  }


    save() {
      if (this.updateStatusForm.valid) {
        this.dialogRef.close(this.updateStatusForm.value);
      }
    }
  
    cancel() {
      this.dialogRef.close();
    }

}