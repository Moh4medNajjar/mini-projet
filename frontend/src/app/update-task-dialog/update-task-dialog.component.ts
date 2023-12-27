import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Import Angular forms module if not already done


@Component({
  selector: 'app-update-task-dialog',
  standalone: true,
  imports: [],
  templateUrl: './update-task-dialog.component.html',
  styleUrl: './update-task-dialog.component.scss'
})
export class UpdateTaskDialogComponent {
  updateTaskForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<UpdateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { taskId: string },
    private fb: FormBuilder
  ) {
    this.updateTaskForm = this.fb.group({
      // Define form controls for task update
    });
  }

  save() {
    // Validate form and save the data
    if (this.updateTaskForm.valid) {
      this.dialogRef.close(this.updateTaskForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
