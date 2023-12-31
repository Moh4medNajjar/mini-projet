import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ReactiveFormsModule ,FormBuilder, FormGroup, Validators, FormControl, FormArray} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Task } from '../task.model';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ElementRef, ViewChild, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import {LiveAnnouncer} from '@angular/cdk/a11y';
@Component({
  selector: 'app-new-task-dialog',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, FormsModule, MatChipsModule, MatIconModule, MatAutocompleteModule, AsyncPipe],
  templateUrl: './new-task-dialog.component.html',
  styleUrl: './new-task-dialog.component.scss'
})
export class NewTaskDialogComponent {
  createTaskForm: FormGroup;
  priorities = ['High', 'Medium', 'Low'];

  minDate: Date;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl('');
  filteredcategories: Observable<string[]>;
  categories: string[] = [];
  allcategories: string[] = ['Frontend', 'Web', 'Backend', 'Mobile', 'Desktop'];

  @ViewChild('categoryInput') categoryInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(
    private dialogRef: MatDialogRef<NewTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {newTaskData : Task},
    private fb: FormBuilder
  ) {

    this.minDate = new Date();
    this.createTaskForm = this.fb.group({
      title: ['',Validators.required],
      description: ['' ,Validators.required],
      due_date: [this.minDate ,Validators.required],
      priority: [this.data.newTaskData?.priority,Validators.required],
      category: []
    });

    this.filteredcategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((category: string | null) => (category ? this._filter(category) : this.allcategories.slice())),
    );


  }


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();


    if (value) {
      this.categories.push(value);
    }

    event.chipInput!.clear();

    this.categoryCtrl.setValue(null);
  }

  remove(category: string): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);

      this.announcer.announce(`Removed ${category}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allcategories.filter(category => category.toLowerCase().includes(filterValue));
  }

  save() {
    if (this.createTaskForm.valid) {
      const formData = this.createTaskForm.value;
      this.data.newTaskData.title=formData.title;
      this.data.newTaskData.description=formData.description;
      this.data.newTaskData.due_date=formData.due_date;
      this.data.newTaskData.priority=formData.priority;
      this.data.newTaskData.category=formData.category;
      console.log(this.data.newTaskData.assigned_to);
      this.dialogRef.close(this.createTaskForm.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
