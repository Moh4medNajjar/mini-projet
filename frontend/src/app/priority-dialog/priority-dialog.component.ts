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
  selector: 'app-priority-dialog',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatChipsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './priority-dialog.component.html',
  styleUrl: './priority-dialog.component.scss'
})
export class PriorityDialogComponent {
  updatePriorityForm: FormGroup;
  priorities = ['High', 'Medium', 'Low'];

  constructor(
    private dialogRef: MatDialogRef<PriorityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { priority: String },
    private fb: FormBuilder,
  ) {
    this.updatePriorityForm = this.fb.group({
      priority: [this.data.priority, Validators.required],
    });


  }


    save() {
      if (this.updatePriorityForm.valid) {
        this.dialogRef.close(this.updatePriorityForm.value);
      }
    }
  
    cancel() {
      this.dialogRef.close();
    }

}